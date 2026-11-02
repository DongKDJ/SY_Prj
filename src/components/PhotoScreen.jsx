import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedDessert from './shared/AnimatedDessert'
import { InkButton } from './shared/InkButton'
import BackButton from './shared/BackButton'
import { ArtBackdrop } from './shared/ArtStage'
import { Divider, Sparkle } from './shared/Decorations'
import { bookmarkBg } from '../assets/screenImages'
import { useCamera } from '../hooks/useCamera'
import { composePhoto, isTouchMobile } from '../lib/composePhoto'

const COUNTDOWN_FROM = 3

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

/**
 * 내 디저트와 사진 찍기 — 화면이 거울이 된다: 정면 카메라(좌우반전) 옆에 결과 디저트가 둥실 떠 있고, 끌어서 옮길 수 있다.
 * 카메라가 둘이면 전환 버튼. 화면을 떠나면(언마운트) 카메라는 바로 꺼진다(useCamera cleanup).
 *
 * kiosk(전시 PC, ?kiosk=1): 거울만 — 관람객이 자기 폰 후면 카메라로 화면을 찍는 미러샷. 앱 안 촬영·저장이 없어
 *   전시 PC에 얼굴이 남지 않는다.
 * 그 외(관람객 폰·태블릿·일반 PC): 찰칵 → 3초 카운트다운 → 보이는 그대로 합성(폴라로이드 테 + 이름 캡션)
 *   → 저장(폰은 공유 시트로 사진 앱에, PC는 다운로드). 사진은 저장을 누르기 전까지 메모리에만 있다.
 */
export default function PhotoScreen({ result, kiosk = false, onBack }) {
  const { stream, status, error, canFlip, flip, retry, mirrored } = useCamera('user')
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const [count, setCount] = useState(null)   // 카운트다운 잔여 초 (null = 진행 안 함)
  const [flash, setFlash] = useState(false)
  const [shot, setShot] = useState(null)     // { blob, url, name }
  const [shotError, setShotError] = useState(false)
  const [busy, setBusy] = useState(false)

  // 스트림을 <video>에 꽂는다 — 요소는 촬영 뒤에도 (숨긴 채) 유지되므로 다시 찍기가 즉시다
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.srcObject = stream
    if (stream) v.play().catch(() => {})
  }, [stream])

  // 찍은 사진의 object URL 정리
  useEffect(() => () => { if (shot?.url) URL.revokeObjectURL(shot.url) }, [shot])

  const capture = useCallback(async () => {
    const video = videoRef.current
    const frame = frameRef.current
    if (!video || !frame) return
    const wrap = frame.querySelector('.dessert-wrap')
    setFlash(true)
    setTimeout(() => setFlash(false), 260)
    setBusy(true)
    try {
      const t = stamp()
      const blob = await composePhoto({
        video,
        mirrored,
        frameRect: frame.getBoundingClientRect(),
        dessertRect: wrap ? wrap.getBoundingClientRect() : new DOMRect(0, 0, 0, 0),
        layerImgs: wrap ? Array.from(wrap.querySelectorAll('img.dessert-layer')) : [],
        title: result.name,
        subtitle: `여우씨의 디저트 레시피 · ${t.caption}`,
      })
      setShot({
        blob,
        url: URL.createObjectURL(blob),
        name: `fox-dessert-${String(result.id).padStart(2, '0')}-${t.file}.jpg`,
      })
      setShotError(false)
    } catch {
      setShotError(true)
    } finally {
      setBusy(false)
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
    if (status !== 'live' || count !== null || busy) return
    setShotError(false)
    setCount(COUNTDOWN_FROM)
  }

  const retake = () => setShot(null)

  // 폰·태블릿: 공유 시트(사진 앱에 저장) → 안 되면 다운로드. PC: 다운로드.
  const save = async () => {
    if (!shot) return
    const file = new File([shot.blob], shot.name, { type: 'image/jpeg' })
    if (isTouchMobile() && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: '여우씨의 디저트 레시피' })
        return
      } catch (e) {
        if (e?.name === 'AbortError') return // 시트를 닫은 것 — 조용히
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

  return (
    <div className="min-h-[100dvh] relative">
      <ArtBackdrop src={bookmarkBg} veil="bg-cream/40" />

      {/* 세로 화면은 이전 버튼이 좌상단에 오므로 머리말을 그 아래로 */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center
                      px-3 pt-[max(1.25rem,4dvh)] portrait:pt-32 pb-[max(1.25rem,4dvh)] gap-3 md:gap-4">
        {/* 헤더 */}
        <div className="gold-rim rounded-full px-7 md:px-10 py-1.5 text-center
                        shadow-[0_10px_24px_-14px_rgba(94,70,50,0.6)]">
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink leading-tight">
            내 디저트와 사진 찍기
          </h2>
          <p className="font-script text-sm text-jam">say cheese!</p>
        </div>

        {/* ───── 카메라 폴라로이드 (촬영 뒤에는 숨긴 채 유지) ───── */}
        <div className={shot ? 'hidden' : 'flex flex-col items-center gap-3 md:gap-4'}>
          <div className="relative bg-[#FCF5E6] p-2 md:p-3 pb-8 md:pb-10 border border-paper-edge
                          shadow-[0_18px_30px_-18px_rgba(94,70,50,0.5)] rounded-sm">
            <div ref={frameRef} className="photo-frame relative overflow-hidden bg-[#3A2A20]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: mirrored ? 'scaleX(-1)' : undefined }}
              />

              {/* 디저트 장식 — 둥실 떠 있고, 끌어서 옮긴다. 카메라가 거부돼도 디저트는 보인다 */}
              {status !== 'starting' && (
                <motion.div
                  drag
                  dragConstraints={frameRef}
                  dragElastic={0.08}
                  dragMomentum={false}
                  whileDrag={{ scale: 1.04 }}
                  className="absolute right-[5%] bottom-[6%] w-[34%] max-w-[260px] aspect-square
                             z-[25] cursor-grab active:cursor-grabbing touch-none"
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
              )}

              {/* 카메라 전환 (카메라가 둘 이상일 때) */}
              {status === 'live' && canFlip && count === null && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={flip}
                  aria-label="카메라 전환"
                  className="absolute top-2 right-2 z-20 w-10 h-10 rounded-full gold-rim
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

              {/* 켜는 중 / 오류 */}
              {status !== 'live' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center
                                gap-4 px-6 text-center bg-[#3A2A20]/85">
                  {status === 'starting' ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                        className="w-8 h-8 rounded-full border-2 border-cream/30 border-t-cream"
                      />
                      <p className="font-display text-cream text-sm md:text-base">카메라를 켜는 중…</p>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-cream text-sm md:text-base whitespace-pre-line leading-relaxed">
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

              {/* 카운트다운 */}
              <AnimatePresence>
                {count !== null && count > 0 && (
                  <motion.div
                    key={count}
                    initial={{ opacity: 0, scale: 1.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                  >
                    <span className="font-script text-[7rem] md:text-[9rem] leading-none text-cream
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
                    className="absolute inset-0 z-40 bg-white pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </div>

            <p className="absolute bottom-1.5 md:bottom-2 left-0 right-0 text-center
                          font-script text-lg md:text-xl text-ink/80 pointer-events-none">
              {result.name}
            </p>
          </div>

          <p className="font-display text-[0.7rem] md:text-xs text-ink/60 tracking-wide text-center">
            디저트를 끌어서 원하는 자리에 놓아 보세요
          </p>

          {kiosk ? (
            /* 전시 PC: 화면이 거울 — 관람객이 자기 폰으로 찍는다 */
            <div className="gold-rim rounded-full px-6 py-2 text-center">
              <p className="font-display text-sm md:text-base font-bold text-ink">
                내 폰으로 이 화면을 찍어 보세요!
              </p>
              <p className="font-script text-sm text-jam">mirror shot</p>
            </div>
          ) : (
            <>
              {shotError && (
                <p className="font-display text-sm text-jam text-center">사진을 만들지 못했어요. 다시 찍어 주세요.</p>
              )}
              <InkButton
                size="md"
                arrow={false}
                onClick={startCountdown}
                disabled={status !== 'live' || count !== null || busy}
                className={status !== 'live' || count !== null || busy ? 'opacity-60' : ''}
                aria-label="사진 찍기"
              >
                <Sparkle className="w-4 h-4 text-jam/80" />
                {count !== null ? '잠깐 멈춰요…' : '찰칵! 사진 찍기'}
              </InkButton>
            </>
          )}
        </div>

        {/* ───── 찍은 사진 ───── */}
        {shot && (
          <motion.div
            key="shot"
            initial={{ opacity: 0, y: 14, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ type: 'spring', stiffness: 80, damping: 14 }}
            className="flex flex-col items-center gap-4"
          >
            <img
              src={shot.url}
              alt={`${result.name}와 함께 찍은 사진`}
              draggable={false}
              className="max-w-[92vw] max-h-[64dvh] w-auto h-auto select-none
                         shadow-[0_22px_40px_-20px_rgba(94,70,50,0.6)]"
            />
            <Divider className="w-24 h-3 text-jam/60" />
            <div className="flex justify-center items-start gap-4 md:gap-6 flex-wrap">
              <InkButton size="sm" arrow={false} onClick={save} aria-label="사진 저장하기">
                사진 저장하기
              </InkButton>
              <InkButton size="sm" tone="honey" arrow={false} onClick={retake}>
                다시 찍기
              </InkButton>
            </div>
          </motion.div>
        )}
      </div>

      <BackButton onClick={onBack} />
    </div>
  )
}
