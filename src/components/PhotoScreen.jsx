import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDessert from './shared/AnimatedDessert'
import { InkButton } from './shared/InkButton'
import { ArtStage, ArtLayer } from './shared/ArtStage'
import { Sparkle } from './shared/Decorations'
import { goldFrames } from '../assets/screenImages'
import { stickers } from '../data/stickers'
import { useCamera } from '../hooks/useCamera'
import { composePhoto, isTouchMobile } from '../lib/composePhoto'

const COUNTDOWN_FROM = 3
const MAX_STICKERS = 12

const ERROR_TEXT = {
  unsupported: '이 주소에서는 카메라를 쓸 수 없어요.\nhttps 주소로 열어 주세요.',
  denied: '카메라 사용을 허용해 주세요.\n주소창의 카메라 아이콘에서 허용한 뒤 다시 시도할 수 있어요.',
  notfound: '카메라를 찾을 수 없어요.',
  busy: '다른 앱이 카메라를 쓰고 있어요.\n그 앱을 닫고 다시 시도해 주세요.',
  unknown: '카메라를 켜지 못했어요.',
}

function stamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return {
    file: `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`,
    caption: `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`,
  }
}

/* 새 스티커 자리 — 화면 가운데 근처에 무작위로, 스티커마다 정해진 범위로 살짝 기울여서 */
function placeSticker(sticker, n) {
  const r = Math.random
  return {
    uid: `s${n}`,
    sticker,
    x: 30 + r() * 40,
    y: 25 + r() * 40,
    rot: Math.round((r() * 2 - 1) * sticker.tilt),
  }
}

/* 붙인 스티커 — 끌어서 옮기고, 탭하면 지우기 배지가 뜬다. 회전은 <img>에만 걸어 상자(부모)는 회전 전 크기를 유지한다(합성용). */
function PlacedSticker({ item, areaRef, selected, onSelect, onRemove }) {
  return (
    <div
      className="absolute"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.sticker.w * 100}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div
        drag
        dragConstraints={areaRef}
        dragElastic={0.06}
        dragMomentum={false}
        whileDrag={{ scale: 1.06 }}
        onTap={() => onSelect(item.uid)}
        className="relative w-full cursor-grab active:cursor-grabbing touch-none"
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          src={item.sticker.src}
          alt={item.sticker.label}
          draggable={false}
          data-rot={item.rot}
          className="sticker-img w-full h-full object-contain select-none pointer-events-none
                     drop-shadow-[0_6px_10px_rgba(0,0,0,0.3)]"
          style={{ transform: `rotate(${item.rot}deg)` }}
        />
        {selected && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onRemove(item.uid) }}
            aria-label={`${item.sticker.label} 스티커 지우기`}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-jam text-cream text-sm
                       flex items-center justify-center shadow cursor-pointer z-10"
          >
            ✕
          </button>
        )}
      </motion.div>
    </div>
  )
}

/**
 * 내 디저트와 사진 찍기 — 화면 전체가 거울이 된다: 정면 카메라(좌우반전)가 원화 스테이지를 채우고 금장 테두리가 가장자리에 남는다.
 * 뽑은 디저트가 옆에 둥실 떠 있고(끌어 옮김), 아래 트레이의 스티커를 눌러 붙이고 끌어 꾸민다.
 * 찰칵 → 꾸미기 UI가 사라지고 3초 카운트다운 → 보이는 그대로 합성(테두리·디저트·스티커 + 폴라로이드 캡션) → 찍힌 사진.
 *
 * kiosk(전시 PC, ?kiosk=1): 저장 버튼 없음 — 찍힌 화면을 관람객이 자기 폰으로 찍는다(미러샷). 사진은 메모리에만.
 * 그 외(관람객 폰·태블릿·일반 PC): 저장(폰은 공유 시트로 사진 앱에, PC는 다운로드).
 * 닫기(책으로)는 결과 화면의 펼친 책 페이지로 바로 돌아간다. 화면을 떠나면 카메라는 즉시 꺼진다(useCamera cleanup).
 */
export default function PhotoScreen({ result, kiosk = false, onBack }) {
  const { stream, status, error, canFlip, flip, retry, mirrored } = useCamera('user')
  const videoRef = useRef(null)
  const areaRef = useRef(null)
  const [mode, setMode] = useState('live')    // 'live' | 'countdown' | 'shot'
  const [count, setCount] = useState(null)
  const [flash, setFlash] = useState(false)
  const [shot, setShot] = useState(null)      // { blob, url, name }
  const [shotError, setShotError] = useState(false)
  const [placed, setPlaced] = useState([])    // 붙인 스티커
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.srcObject = stream
    if (stream) v.play().catch(() => {})
  }, [stream])

  useEffect(() => () => { if (shot?.url) URL.revokeObjectURL(shot.url) }, [shot])

  const nextUid = useRef(0)
  const addSticker = (sticker) => {
    if (placed.length >= MAX_STICKERS) return
    nextUid.current += 1
    const item = placeSticker(sticker, nextUid.current)
    setPlaced(p => [...p, item])
    setSelected(item.uid)
  }
  const removeSticker = (uid) => {
    setPlaced(p => p.filter(s => s.uid !== uid))
    setSelected(null)
  }

  const capture = useCallback(async () => {
    const video = videoRef.current
    const area = areaRef.current
    if (!video || !area) return
    setFlash(true)
    setTimeout(() => setFlash(false), 260)
    try {
      const t = stamp()
      const gold = Array.from(document.querySelectorAll('img.photo-gold'))
        .map(img => ({ img, rect: img.getBoundingClientRect() }))
      const items = Array.from(area.querySelectorAll('img.dessert-layer, img.sticker-img'))
        .map(img => (img.classList.contains('sticker-img')
          ? { img, rect: img.parentElement.getBoundingClientRect(), rot: parseFloat(img.dataset.rot) || 0 }
          : { img, rect: img.getBoundingClientRect() }))
      const blob = await composePhoto({
        video,
        mirrored,
        frameRect: area.getBoundingClientRect(),
        videoRect: video.getBoundingClientRect(),
        layers: [...gold, ...items],
        title: result.name,
        subtitle: `여우씨의 디저트 레시피 · ${t.caption}`,
      })
      setShot({
        blob,
        url: URL.createObjectURL(blob),
        name: `fox-dessert-${String(result.id).padStart(2, '0')}-${t.file}.jpg`,
      })
      setShotError(false)
      setMode('shot')
    } catch {
      setShotError(true)
      setMode('live')
    }
  }, [mirrored, result])

  // 카운트다운: 3 → 2 → 1 → 찰칵
  useEffect(() => {
    if (count === null) return undefined
    const t = setTimeout(() => {
      if (count <= 1) {
        setCount(null)
        capture()
      } else {
        setCount(count - 1)
      }
    }, 1000)
    return () => clearTimeout(t)
  }, [count, capture])

  const startCountdown = () => {
    if (status !== 'live' || mode !== 'live') return
    setShotError(false)
    setSelected(null)
    setMode('countdown')
    setCount(COUNTDOWN_FROM)
  }

  const retake = () => {
    setShot(null)
    setMode('live')
  }

  // 폰·태블릿: 공유 시트(사진 앱에 저장) → 안 되면 다운로드. PC: 다운로드.
  const save = async () => {
    if (!shot) return
    const file = new File([shot.blob], shot.name, { type: 'image/jpeg' })
    if (isTouchMobile() && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: '여우씨의 디저트 레시피' })
        return
      } catch (e) {
        if (e?.name === 'AbortError') return
      }
    }
    const a = document.createElement('a')
    a.href = shot.url
    a.download = shot.name
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  if (!result) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-paper">
        <p className="font-display text-ink">결과를 불러올 수 없습니다.</p>
      </div>
    )
  }

  const chrome = mode === 'live'

  return (
    <div className="fixed inset-0 bg-ink overflow-hidden select-none">
      {/* 스테이지: 카메라가 원화 자리를 채우고 금장 테두리가 가장자리에 남는다 */}
      <ArtStage>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: mirrored ? 'scaleX(-1)' : undefined }}
        />
        {goldFrames.map((src, i) => (
          <ArtLayer key={i} src={src} className="photo-gold" />
        ))}
      </ArtStage>

      {/* 켜는 중 / 오류 — 디저트·스티커는 그 위에 그대로 보인다 */}
      {status !== 'live' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center
                        gap-4 px-6 text-center bg-ink/70">
          {status === 'starting' ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                className="w-8 h-8 rounded-full border-2 border-cream/30 border-t-cream"
              />
              <p className="font-display text-cream text-base">카메라를 켜는 중…</p>
            </>
          ) : (
            <>
              <p className="font-display text-cream text-base md:text-lg whitespace-pre-line leading-relaxed">
                {ERROR_TEXT[error] || ERROR_TEXT.unknown}
              </p>
              {error !== 'unsupported' && (
                <InkButton size="sm" tone="honey" arrow={false} onClick={retry}>
                  다시 시도
                </InkButton>
              )}
            </>
          )}
        </div>
      )}

      {/* 사진 영역: 디저트 + 스티커 (사진에 담기는 범위) */}
      <div
        ref={areaRef}
        className="photo-area z-20"
        onPointerDown={() => setSelected(null)}
      >
        <motion.div
          drag
          dragConstraints={areaRef}
          dragElastic={0.06}
          dragMomentum={false}
          whileDrag={{ scale: 1.03 }}
          className="absolute right-[5%] bottom-[12%] w-[30%] max-w-[22rem] portrait:w-[48%] aspect-square
                     cursor-grab active:cursor-grabbing touch-none"
          aria-label="디저트 옮기기"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]"
          >
            <AnimatedDessert
              dessertId={result.id}
              image={result.image}
              name={result.name}
              variant="thumb"
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>

        {placed.map(item => (
          <PlacedSticker
            key={item.uid}
            item={item}
            areaRef={areaRef}
            selected={chrome && selected === item.uid}
            onSelect={setSelected}
            onRemove={removeSticker}
          />
        ))}
      </div>

      {/* ── 꾸미기 UI — 찰칵을 누르면 전부 사라진다 ── */}
      <AnimatePresence>
        {chrome && (
          <motion.div
            key="chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {/* 닫기 — 펼친 책 페이지로 */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={onBack}
              aria-label="책으로 돌아가기"
              className="pointer-events-auto absolute top-3 left-3 md:top-5 md:left-5 gold-rim rounded-full
                         px-4 py-2 font-display font-bold text-ink text-sm md:text-base cursor-pointer
                         shadow-[0_8px_16px_-10px_rgba(0,0,0,0.6)]"
            >
              ✕ 책으로
            </motion.button>

            {/* 안내 */}
            <div className="absolute top-3 md:top-5 left-1/2 -translate-x-1/2 gold-rim rounded-full px-5 py-1.5 text-center">
              <p className="font-display text-sm md:text-base font-bold text-ink leading-tight">내 디저트와 사진 찍기</p>
              <p className="font-script text-xs md:text-sm text-jam leading-tight">스티커로 꾸미고 찰칵!</p>
            </div>

            {/* 카메라 전환 */}
            {status === 'live' && canFlip && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={flip}
                aria-label="카메라 전환"
                className="pointer-events-auto absolute top-3 right-3 md:top-5 md:right-5 w-11 h-11 rounded-full gold-rim
                           flex items-center justify-center text-ink/80 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor"
                     strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10a8 8 0 0 1 13.6-5.2" />
                  <path d="M17 2v3h-3" />
                  <path d="M20 14a8 8 0 0 1-13.6 5.2" />
                  <path d="M7 22v-3h3" />
                </svg>
              </motion.button>
            )}

            {/* 하단: 스티커 트레이 + 찰칵 */}
            <div className="pointer-events-auto absolute bottom-0 left-0 right-0 bg-cream/85 backdrop-blur-sm
                            border-t-[0.2rem] border-[#D6A64A]/70 px-3 py-2 md:py-3
                            flex items-center gap-3">
              <div className="sticker-tray flex-1 flex items-center gap-2 md:gap-3 overflow-x-auto py-1">
                {stickers.map(st => (
                  <motion.button
                    key={st.id}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addSticker(st)}
                    disabled={placed.length >= MAX_STICKERS}
                    aria-label={`${st.label} 스티커 붙이기`}
                    className="gold-rim rounded-full w-14 h-14 md:w-16 md:h-16 flex-shrink-0 flex items-center
                               justify-center cursor-pointer disabled:opacity-40 p-2"
                  >
                    <img src={st.src} alt="" draggable={false} className="w-full h-full object-contain select-none" />
                  </motion.button>
                ))}
              </div>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                {shotError && (
                  <p className="font-display text-xs text-jam">사진을 만들지 못했어요</p>
                )}
                <InkButton
                  size="md"
                  arrow={false}
                  onClick={startCountdown}
                  disabled={status !== 'live'}
                  className={status !== 'live' ? 'opacity-60' : ''}
                  aria-label="사진 찍기"
                >
                  <Sparkle className="w-4 h-4 text-jam/80" />
                  찰칵!
                </InkButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 카운트다운 */}
      <AnimatePresence>
        {count !== null && count > 0 && (
          <motion.div
            key={count}
            initial={{ opacity: 0, scale: 1.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
          >
            <span className="font-script text-[8rem] md:text-[11rem] leading-none text-cream
                             drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              {count}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 플래시 */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26 }}
            className="absolute inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ── 찍힌 사진 ── */}
      <AnimatePresence>
        {mode === 'shot' && shot && (
          <motion.div
            key="shot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[45] bg-ink flex flex-col items-center"
          >
            <div className="flex-1 min-h-0 w-full flex items-center justify-center p-3 md:p-5 pb-0">
              <motion.img
                initial={{ scale: 0.96, rotate: 0 }}
                animate={{ scale: 1, rotate: -1 }}
                transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                src={shot.url}
                alt={`${result.name}와 함께 찍은 사진`}
                draggable={false}
                className="max-w-full max-h-full object-contain select-none
                           shadow-[0_22px_40px_-20px_rgba(0,0,0,0.8)]"
              />
            </div>
            <div className="w-full bg-cream/90 border-t-[0.2rem] border-[#D6A64A]/70 px-3 py-3 md:py-4
                            flex flex-wrap items-center justify-center gap-3 md:gap-5">
              {kiosk ? (
                <div className="gold-rim rounded-full px-5 py-1.5 text-center">
                  <p className="font-display text-sm md:text-base font-bold text-ink leading-tight">
                    내 폰으로 이 화면을 찍어 보세요!
                  </p>
                  <p className="font-script text-xs md:text-sm text-jam leading-tight">mirror shot</p>
                </div>
              ) : (
                <InkButton size="sm" arrow={false} onClick={save} aria-label="사진 저장하기">
                  사진 저장하기
                </InkButton>
              )}
              <InkButton size="sm" tone="honey" arrow={false} onClick={retake}>
                다시 찍기
              </InkButton>
              <InkButton size="sm" tone="jam" arrow={false} onClick={onBack}>
                책으로 돌아가기
              </InkButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
