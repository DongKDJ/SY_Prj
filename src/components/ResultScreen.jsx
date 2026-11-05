import Sentences from './shared/Sentences'
import { useState, useMemo, useCallback, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedDessert from './shared/AnimatedDessert'
import { InkButton } from './shared/InkButton'
import BackButton from './shared/BackButton'
import { ArtBackdrop } from './shared/ArtStage'
import { bookmarkBg, cardPlate } from '../assets/screenImages'
import { resultCards } from '../data/desserts'
import { ComboCards, CardLightbox } from './shared/BookUi'
import stampImg from '../assets/images/ui/stamp-soyo.png'
import sparkleImg from '../assets/images/stickers/sparkle.png'
// 대표가 준 인스타 QR(SY_Prj/QR.png)을 640px·24색 팔레트 PNG로 줄인 사본(55KB).
// 점무늬라 손실 WebP로 바꾸면 오히려 커져서(140KB) ?url로 변환을 건너뛴다.
import qrImg from '../assets/images/ui/result-qr.png?url'
import { play } from '../lib/sound'
import {
  PaperGrain,
  Divider,
  Sparkle,
  Floret,
  CornerOrnament,
} from './shared/Decorations'

/* ── 컨페티 입자: 꽃잎/별/원/재료 조각 ── */
function createMote(id) {
  const types = ['petal', 'sparkle', 'dot', 'crumb']
  const palettes = [
    'text-jam',     'text-jam-soft',
    'text-honey',   'text-honey-soft',
    'text-sage',    'text-sage-soft',
    'text-sky',
  ]
  // 결정적 난수 (id 기반)
  const r = (n) => {
    const x = Math.sin((id + 1) * (n + 17) * 13.7) * 10000
    return x - Math.floor(x)
  }
  return {
    id,
    type: types[Math.floor(r(0) * types.length)],
    color: palettes[Math.floor(r(1) * palettes.length)],
    x: -10 + r(2) * 120,        // %
    startY: -10 - r(3) * 35,    // vh
    endY:   110 + r(4) * 25,
    drift:  -25 + r(5) * 50,
    size:   10 + r(6) * 18,
    delay:  r(7) * 1.4,
    duration: 2.4 + r(8) * 2.4,
    rotation: -360 + r(9) * 720,
  }
}

// initialPhase: 'reveal'(오븐에서 온 첫 공개) | 'detail'(사진 찍기에서 돌아올 때 — 메달리온을 건너뛰고 펼친 책으로)
export default function ResultScreen({ result, onViewBook, onTakePhoto, onRestart, onBack, initialPhase = 'reveal', kiosk = false }) {
  const [phase, setPhase] = useState(initialPhase)
  const [lightbox, setLightbox] = useState(null) // { card } | { dessert } — 확대 보기
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const cards = useMemo(() => resultCards(result), [result])
  // 디저트가 처음 공개될 때 한 번(사진 찍기에서 돌아올 때는 아님)
  useEffect(() => { if (initialPhase === 'reveal') play('fanfare') }, [initialPhase])
  const motes = useMemo(() =>
    Array.from({ length: 44 }, (_, i) => createMote(i)), []
  )

  if (!result) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-paper">
        <p className="font-display text-ink">결과를 불러올 수 없습니다.</p>
      </div>
    )
  }

  const pageNum = result.id

  return (
    <div className="min-h-[100dvh] w-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════
            Phase 1: 오늘의 레시피 — 메달리온 공개
            ═══════════════════════════════════════════ */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="min-h-[100dvh] flex items-center justify-center relative"
          >
            {/* 배경: 책갈피 책상 원화(흐림) + 금장 테두리 — 앞 화면들과 같은 그림책 안 */}
            <ArtBackdrop src={bookmarkBg} veil="bg-cream/30" />

            {/* 중앙 빛줄기 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 0.55, scale: 1.5 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[40rem] h-[40rem] rounded-full pointer-events-none
                         bg-radial from-honey-soft/70 via-cream/30 to-transparent blur-2xl"
            />

            {/* 방사형 점선 헤일로 */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 0.35, rotate: 360 }}
              transition={{
                opacity: { delay: 0.6, duration: 1 },
                rotate:  { repeat: Infinity, duration: 32, ease: 'linear' },
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[26.25rem] h-[26.25rem] pointer-events-none"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="92" fill="none"
                        stroke="#3A2418" strokeWidth="0.6" strokeDasharray="1 5" />
                <circle cx="100" cy="100" r="80" fill="none"
                        stroke="#8B2E3F" strokeWidth="0.4" strokeDasharray="3 7" />
              </svg>
            </motion.div>

            {/* 컨페티 (꽃잎/별/점/부스러기) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {motes.map(m => (
                <motion.span
                  key={m.id}
                  initial={{
                    x: `${m.x}vw`, y: `${m.startY}vh`,
                    rotate: 0, opacity: 0, scale: 0,
                  }}
                  animate={{
                    x: `${m.x + m.drift}vw`, y: `${m.endY}vh`,
                    rotate: m.rotation,
                    opacity: [0, 1, 1, 0.7],
                    scale:   [0, 1.1, 1, 0.8],
                  }}
                  transition={{
                    duration: m.duration,
                    delay: m.delay,
                    ease: 'easeOut',
                  }}
                  className={`absolute ${m.color}`}
                  style={{ fontSize: `${m.size}px`, width: m.size, height: m.size }}
                >
                  {m.type === 'sparkle' && <Sparkle className="w-full h-full" />}
                  {m.type === 'petal'   && <Floret  className="w-full h-full" />}
                  {m.type === 'dot'     && (
                    <span className="block w-full h-full rounded-full bg-current" />
                  )}
                  {m.type === 'crumb'   && (
                    <span className="block w-full h-1 rounded-sm bg-current rotate-12" />
                  )}
                </motion.span>
              ))}
            </div>

            {/* 메인 카드: 메달리온 + 이름 */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotateZ: -8 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 55, damping: 12 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* 메달리온 — 안쪽 종이 톤 + 디저트 */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 60px rgba(212,162,76,0.35), inset 0 0 0 4px rgba(94,70,50,0.12)',
                    '0 0 90px rgba(212,162,76,0.55), inset 0 0 0 4px rgba(94,70,50,0.18)',
                    '0 0 60px rgba(212,162,76,0.35), inset 0 0 0 4px rgba(94,70,50,0.12)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="relative w-60 h-60 md:w-80 md:h-80 rounded-full
                           flex items-center justify-center"
                style={{
                  // 금장 테 — 원화 금장 프레임·카드 테두리와 같은 결의 금색 그라데이션 링
                  border: '0.4rem solid transparent',
                  background:
                    'linear-gradient(135deg, #FFF5DD, #EFD4A4) padding-box, ' +
                    'linear-gradient(135deg, #FBEBB0, #D6A64A 30%, #FFF1BE 52%, #B98A34 76%, #F6DE8D) border-box',
                }}
              >
                {/* 메달리온 안쪽 점선 링 */}
                <div className="absolute inset-3 rounded-full border border-dashed border-ink/15" />
                {/* 4방향 작은 별 */}
                {[0, 90, 180, 270].map(deg => (
                  <Sparkle key={deg}
                    className="absolute w-4 h-4 text-jam/70"
                    style={{
                      transform: `rotate(${deg}deg) translateY(-${typeof window !== 'undefined' && window.innerWidth >= 768 ? '9.5rem' : '7.25rem'})`,
                      transformOrigin: 'center',
                    }}
                  />
                ))}

                {/* 디저트 */}
                <AnimatedDessert
                  dessertId={result.id}
                  image={result.image}
                  name={result.name}
                  variant="full"
                  className="w-40 h-40 md:w-56 md:h-56 relative z-10"
                />
              </motion.div>

              {/* 이름 + 성격 */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.7 }}
                className="text-center mt-7 max-w-sm px-4"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
                  {result.name}
                </p>
                <div className="flex justify-center mt-3">
                  <Divider className="w-32 h-3 text-jam/70" />
                </div>
                <p className="font-display italic text-base text-ink/70 mt-3">
                  {result.personality}
                </p>
              </motion.div>
            </motion.div>

            {/* 하단: 페이지 넘기기 힌트 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute above-bar left-0 right-0 flex flex-col items-center gap-1 z-30"
            >
              <span className="font-display text-sm md:text-base text-ink/85 tracking-widest">
                탭하여 자세히 보기 →
              </span>
            </motion.div>

            {/* 전체 탭 영역 */}
            <button
              onClick={() => setPhase('detail')}
              className="absolute inset-0 z-40 cursor-pointer"
              aria-label="다음 페이지"
            />
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            Phase 2: 펼친 책 — 좌우 페이지 레이아웃
            (2026-11-05 대표 재구성: 왼쪽 = 도감 금테 카드 + 조합 + 고른 카드 4장,
             오른쪽 = 카드 뒤집었을 때와 같은 명판 + 따옴표 설명, 영어 머리글·장식 제거, 도장)
            ═══════════════════════════════════════════ */}
        {phase === 'detail' && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-[100dvh] relative flex items-center justify-center px-3 py-6 md:px-8 md:py-10 portrait:pt-[7.5rem] portrait:md:pt-10"
          >
            {/* 배경: 책상 원화(흐림) 위에 펼친 책 */}
            <ArtBackdrop src={bookmarkBg} veil="bg-cream/25" />

            {/* 책 컨테이너 — 바깥쪽에 겹친 종이 가장자리(book-edges)로 두께감 */}
            <div className="relative z-10 w-full max-w-5xl mx-auto page-turn-in book-edges">
              {/* 책등 그림자 (중앙 세로 가운데) — md 이상에서만 */}
              <div className="hidden md:block absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-16
                              bg-gradient-to-r from-transparent via-ink/25 to-transparent
                              pointer-events-none z-20" />
              {/* 분홍 책갈피 끈 — 책등 위에서 내려온다 (두 쪽 펼침에서만). 대표 지시로 도형(SVG): 새틴 결 그라데이션 + 양옆 박음질 + 제비꼬리 끝 */}
              <div aria-hidden="true"
                   className="hidden md:block absolute -top-1.5 left-1/2 -translate-x-1/2 w-9 lg:w-11 h-[66%] z-30 pointer-events-none
                              drop-shadow-[0_8px_10px_rgba(94,70,50,0.38)]">
                <svg viewBox="0 0 40 400" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="ribbon-satin" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0" stopColor="#F9A8C8" />
                      <stop offset="0.22" stopColor="#F173A6" />
                      <stop offset="0.55" stopColor="#EC5A95" />
                      <stop offset="0.82" stopColor="#F27AAB" />
                      <stop offset="1" stopColor="#D8437E" />
                    </linearGradient>
                    <linearGradient id="ribbon-fold" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#B32E66" stopOpacity="0.55" />
                      <stop offset="1" stopColor="#B32E66" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M3 0 H37 V384 L20 358 L3 400 Z" fill="url(#ribbon-satin)" />
                  {/* 위쪽 접힌 그늘 — 책등에서 나오는 자리 */}
                  <rect x="3" y="0" width="34" height="26" fill="url(#ribbon-fold)" />
                  {/* 박음질 */}
                  <path d="M8 6 V380" stroke="#FFE3EF" strokeWidth="1" strokeDasharray="5 5" opacity="0.8" fill="none" vectorEffect="non-scaling-stroke" />
                  <path d="M32 6 V366" stroke="#FFE3EF" strokeWidth="1" strokeDasharray="5 5" opacity="0.6" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              <div className="grid md:grid-cols-2 gap-0
                              gold-rim rounded-2xl md:rounded-[2rem]
                              shadow-[0_34px_70px_-30px_rgba(94,70,50,0.55)]
                              overflow-hidden relative">

                {/* ─────── 왼쪽 페이지: 나만의 레시피 — 디저트(카드 테 없이) + 반짝이 + 재료 ─────── */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.7 }}
                  className="page-left page-frame relative flex flex-col items-center justify-center gap-3 md:gap-4 @container
                             px-7 pt-9 pb-12 md:px-12 md:pr-16 md:py-11
                             min-h-[60vh] md:min-h-[70vh] ruled-paper
                             bg-gradient-to-br from-[#FBF3E3] via-[#F7EBD2] to-[#EFDDB5]"
                >
                  <PaperGrain />
                  <CornerOrnament corner="tl" className="absolute top-3 left-3 w-10 h-10 text-honey" />
                  <CornerOrnament corner="bl" className="absolute bottom-3 left-3 w-10 h-10 text-honey" />

                  {/* 페이지 제목 — 손글씨 '나만의+레시피'(result-title.png). 그림이 없으면 명조 글씨를 둥글게 휘어 임시로 */}
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="relative flex flex-col items-center"
                  >
                    {ART.title ? (
                      <img src={ART.title} alt="나만의 레시피" draggable={false} className="w-60 @sm:w-80 h-auto select-none" />
                    ) : (
                      <ArchTitle />
                    )}
                    <span className="font-display text-[11px] md:text-xs text-ink/70 tracking-[0.25em] gold-rim rounded-full px-3 py-0.5 mt-1">
                      레시피 {String(pageNum).padStart(2, '0')}번
                    </span>
                  </motion.div>

                  {/* 디저트 — 금테 카드 없이 그림만. 반짝이 둘이 왼쪽 위·오른쪽 아래에.
                      반짝이 그림 = 대표 지정 IMG_2907(스티커 sparkle.png가 바로 그 그림을 잘라 둔 것) */}
                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 80, damping: 14 }}
                    className="relative flex flex-col items-center gap-2"
                  >
                    <div className="relative">
                      <img src={sparkleImg} alt="" aria-hidden="true" draggable={false}
                           className="sparkle-twinkle absolute -left-8 @sm:-left-16 -top-2 w-16 @sm:w-28 -rotate-12 select-none pointer-events-none" />
                      <img src={sparkleImg} alt="" aria-hidden="true" draggable={false}
                           className="sparkle-twinkle [animation-delay:1.4s] absolute -right-7 @sm:-right-14 bottom-2 w-14 @sm:w-24 rotate-[150deg] select-none pointer-events-none" />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setLightbox({ dessert: result })}
                        aria-label={`${result.name} 크게 보기`}
                        className="relative block cursor-pointer w-52 h-52 @sm:w-72 @sm:h-72"
                      >
                        <AnimatedDessert
                          dessertId={result.id}
                          image={result.image}
                          name={result.name}
                          variant="card"
                          className="w-full h-full"
                        />
                      </motion.button>
                    </div>
                    <p className="font-display text-xl md:text-2xl font-bold text-ink text-center leading-tight">
                      {result.name}
                    </p>
                    <Divider className="w-24 h-3 text-jam/55 -mt-1" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="relative mt-1"
                  >
                    <ComboCards combo={result.combo} cards={cards} onCard={(card) => setLightbox({ card })} />
                  </motion.div>

                  <PageNumber n={pageNum * 2 - 1} />
                </motion.section>

                {/* ─────── 오른쪽 페이지: 성격 명판 + 설명 노트 / 버튼(왼쪽 세로) + 작품 더보기 QR + 도장(오른쪽 아래) ─────── */}
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="page-right page-frame relative flex flex-col items-center justify-center @container
                             px-7 pt-9 pb-12 md:px-12 md:pl-16 md:py-11
                             min-h-[60vh] md:min-h-[70vh] ruled-paper
                             bg-gradient-to-bl from-[#FCF5E6] via-[#F7EBD2] to-[#EFDDB5]"
                >
                  <PaperGrain />
                  <CornerOrnament corner="tr" className="absolute top-3 right-3 w-10 h-10 text-honey" />
                  <CornerOrnament corner="br" className="absolute bottom-3 right-3 w-10 h-10 text-honey" />

                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="relative mb-3"
                  >
                    <SectionLabel>이런 사람이에요</SectionLabel>
                  </motion.div>

                  {/* 성격 명판 — 카드 확대 화면과 같은 뼈다귀 프레임 */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="relative w-64 md:w-80"
                  >
                    <img src={cardPlate} alt="" aria-hidden="true" draggable={false} className="w-full h-auto select-none" />
                    <div className="absolute inset-0 flex items-center justify-center pt-[5%] px-10">
                      <h2 className="font-display text-lg md:text-2xl font-bold text-ink text-center leading-tight whitespace-nowrap">
                        {result.personality}
                      </h2>
                    </div>
                  </motion.div>

                  {/* 디저트 설명 — 점선 테 노트 상자, 쉼표·문장마다 줄바꿈, 가운데 정렬 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="relative mt-4 w-full max-w-md note-inset rounded-xl px-5 py-4 md:px-6 md:py-5 flex flex-col items-center"
                  >
                    <Floret className="w-4 h-4 text-honey mb-2" />
                    <p className="font-display text-base md:text-lg text-ink leading-relaxed text-center">
                      <Sentences text={result.description} quote />
                    </p>
                  </motion.div>

                  {/* 아래쪽: 버튼은 왼쪽에 세로로, 그 아래 '작품 더보기' QR과 큰 도장이 나란히 (2026-11-05 대표 시안).
                      페이지가 좁으면(폰) 버튼만 가운데로 모은다. */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="relative w-full max-w-md mt-6 flex flex-col items-start @max-sm:items-center gap-3"
                  >
                    <InkButton
                      size="md"
                      tone="jam"
                      arrow={false}
                      onClick={onTakePhoto}
                      aria-label="내 디저트와 사진 찍기"
                    >
                      <Sparkle className="w-4 h-4 text-jam/80" />
                      내 디저트와 사진 찍기!
                    </InkButton>

                    <InkButton
                      size="sm"
                      onClick={onViewBook}
                      aria-label="디저트 북 보기"
                    >
                      디저트 북 보기
                    </InkButton>

                    <InkButton
                      size="sm"
                      tone="honey"
                      arrow={false}
                      onClick={() => {
                        // 받은 사람이 들어올 사이트 주소 — 전시 PC 주소(?kiosk=1)가 아닌 기본 주소
                        const url = new URL(import.meta.env.BASE_URL, window.location.origin).href
                        const text =
                          `나의 디저트는 "${result.name}"!\n성격: ${result.personality}\n\n${result.description}\n\n여우씨의 디저트 레시피에서 확인해보세요!`
                        if (navigator.share) {
                          // 주소는 url 칸으로 — 받는 앱이 링크 미리보기로 붙인다. 시트를 닫으면 AbortError — 조용히 무시
                          navigator.share({ title: '여우씨의 디저트 레시피', text, url }).catch(() => {})
                        } else if (navigator.clipboard) {
                          navigator.clipboard.writeText(`${text}\n${url}`)
                            .then(() => alert('결과가 클립보드에 복사되었습니다!'))
                            .catch(() => alert('복사하지 못했어요. 화면을 캡처해 주세요.'))
                        } else {
                          alert('이 브라우저에서는 공유를 지원하지 않아요. 화면을 캡처해 주세요.')
                        }
                      }}
                      aria-label="결과 공유하기"
                    >
                      결과 공유
                    </InkButton>

                    <InkButton
                      size="sm"
                      tone="sage"
                      arrow={false}
                      onClick={onRestart}
                      aria-label="다시하기"
                    >
                      다시하기
                    </InkButton>

                    <div className="w-full flex items-end justify-between @max-sm:justify-center @max-sm:gap-7 gap-3 mt-1 @max-sm:mt-3">
                      <MoreWorks kiosk={kiosk} />
                      {/* 도장 — 대표가 준 PNG를 갈색 마스크로 (파일은 그대로). 시안대로 오른쪽 아래에 크게 */}
                      <div
                        aria-hidden="true"
                        className="stamp-ink shrink-0 w-32 h-32 @sm:w-56 @sm:h-56 @sm:-mt-36 @sm:-mr-2"
                        style={{ '--stamp': `url(${stampImg})` }}
                      />
                    </div>
                  </motion.div>

                  <PageNumber n={pageNum * 2} />
                </motion.section>
              </div>

              {/* 책 아래 그림자 */}
              <div className="h-6 w-[90%] mx-auto bg-ink/25 blur-xl rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardLightbox item={lightbox} onClose={closeLightbox} />

      {/* 확대 보기 → 닫기, 펼친 책 → 메달리온 페이지, 메달리온 → 마지막 선택 */}
      <BackButton onClick={() => (lightbox ? closeLightbox() : phase === 'detail' ? setPhase('reveal') : onBack())} />
    </div>
  )
}

/* 결과 책에 얹는 작가 그림 — images/ui/result-title.png(손글씨 제목)가 있으면 쓰고, 없으면 임시본으로 그린다.
   ※ 글롭(?url)으로 찾은 그림은 WebP 변환을 건너뛴다 — 손글씨 제목 파일이 오면 stampImg처럼 정적 import로 바꿀 것.
   파일만 넣으면 바뀌도록 글롭으로 찾는다(없어도 빌드는 된다). */
const artFiles = import.meta.glob('../assets/images/ui/result-*.png', { eager: true, query: '?url', import: 'default' })
const art = (name) => Object.entries(artFiles).find(([p]) => p.endsWith(`/result-${name}.png`))?.[1]
const ART = { title: art('title') }
const INSTAGRAM = 'https://www.instagram.com/soyo_88_/'

/* 손글씨 제목 그림이 오기 전 임시 — 명조 글씨를 둥글게 휘어 놓는다 */
function ArchTitle() {
  const id = useId()
  return (
    <svg viewBox="0 0 320 118" className="w-60 @sm:w-80 h-auto overflow-visible" role="img" aria-label="나만의 레시피">
      <path id={id} d="M 14 108 Q 160 -14 306 108" fill="none" />
      <text className="font-display" fontSize="46" fontWeight="700" fill="#A8782F" letterSpacing="3">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">나만의 ✦ 레시피</textPath>
      </text>
    </svg>
  )
}

/* '작품 더보기' — 작가 인스타 QR + 계정. 폰·일반 PC에서는 누르면 새 창으로 열리고, 전시 PC(kiosk)는 스캔 전용(사이트를 벗어나지 않게) */
function MoreWorks({ kiosk }) {
  const body = (
    <>
      <span className="font-display font-bold text-sm md:text-base text-[#B9682A] tracking-wide whitespace-nowrap">✦ 작품 더보기 ✦</span>
      <img src={qrImg} alt="작가 인스타그램 QR" draggable={false} className="w-24 h-24 @sm:w-32 @sm:h-32 my-0.5 select-none" />
      <span className="font-display text-xs md:text-sm text-[#B9682A] tracking-[0.12em]">@SOYO_88_</span>
    </>
  )
  const cls = 'flex flex-col items-center gap-1'
  return kiosk ? (
    <div className={cls}>{body}</div>
  ) : (
    <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" data-sfx="none"
       aria-label="작가 인스타그램 열기" className={`${cls} cursor-pointer`}>
      {body}
    </a>
  )
}

/* 작은 구역 이름 — 양옆 선 + 글자 간격 넓게 */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="w-6 h-px bg-ink/20" />
      <span className="font-display text-xs md:text-sm text-ink/60 tracking-[0.3em]">{children}</span>
      <span className="w-6 h-px bg-ink/20" />
    </div>
  )
}

/* 펼친 책 페이지 번호 — 왼쪽 홀수·오른쪽 짝수 */
function PageNumber({ n }) {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
      <span className="font-display text-xs text-ink/50 tracking-[0.3em]">
        {String(n).padStart(2, '0')}
      </span>
    </div>
  )
}
