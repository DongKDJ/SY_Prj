import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedDessert from './shared/AnimatedDessert'
import { InkButton } from './shared/InkButton'
import {
  PaperGrain,
  Divider,
  Sparkle,
  Floret,
  WheatSprig,
  CornerOrnament,
  MaskingTape,
} from './shared/Decorations'

/* ── 컨페티 입자: 꽃잎/별/원/재료 조각 ── */
function createMote(id) {
  const types = ['petal', 'sparkle', 'dot', 'crumb']
  const palettes = [
    'text-jam',     'text-jam-soft',
    'text-honey',   'text-honey-soft',
    'text-sage',    'text-sage-soft',
    'text-cabin-light',
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

export default function ResultScreen({ result, onViewBook }) {
  const [phase, setPhase] = useState('reveal')
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

  const pageNum = String(result.id).padStart(2, '0')

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
            {/* 배경: 종이 + 따뜻한 광휘 */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FBF3E3] via-[#F5DDB8] to-[#E8B888]" />
            <PaperGrain />
            <div className="page-vignette" />

            {/* 중앙 빛줄기 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 0.55, scale: 1.5 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[640px] h-[640px] rounded-full pointer-events-none
                         bg-gradient-radial from-honey-soft/70 via-cream/30 to-transparent blur-2xl"
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
                         w-[420px] h-[420px] pointer-events-none"
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
              {/* 손글씨 캡션 — Today's Recipe */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="flex items-center gap-3 mb-3"
              >
                <span className="h-px w-8 bg-jam/50" />
                <span className="font-script text-2xl text-jam tracking-wide">
                  today&apos;s recipe
                </span>
                <span className="h-px w-8 bg-jam/50" />
              </motion.div>

              {/* 메달리온 — 안쪽 종이 톤 + 디저트 */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 60px rgba(212,162,76,0.35), inset 0 0 0 4px rgba(58,36,24,0.12)',
                    '0 0 90px rgba(212,162,76,0.55), inset 0 0 0 4px rgba(58,36,24,0.18)',
                    '0 0 60px rgba(212,162,76,0.35), inset 0 0 0 4px rgba(58,36,24,0.12)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="relative w-60 h-60 md:w-80 md:h-80 rounded-full
                           bg-gradient-to-br from-[#FFF5DD] to-[#EFD4A4]
                           flex items-center justify-center
                           border-[3px] border-double border-ink/25"
              >
                {/* 메달리온 안쪽 점선 링 */}
                <div className="absolute inset-3 rounded-full border border-dashed border-ink/15" />
                {/* 4방향 작은 별 */}
                {[0, 90, 180, 270].map(deg => (
                  <Sparkle key={deg}
                    className="absolute w-4 h-4 text-jam/70"
                    style={{
                      transform: `rotate(${deg}deg) translateY(-${typeof window !== 'undefined' && window.innerWidth >= 768 ? '152px' : '116px'})`,
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
                  imgClassName="w-40 h-40 md:w-56 md:h-56 object-contain"
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
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 z-30"
            >
              <span className="font-script text-2xl text-jam">turn the page</span>
              <span className="font-display text-xs text-ink/55 tracking-widest">
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
            ═══════════════════════════════════════════ */}
        {phase === 'detail' && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-[100dvh] relative flex items-center justify-center px-3 py-6 md:px-8 md:py-10"
          >
            {/* 배경 */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#E8D0AC] via-[#F0DCB8] to-[#D8B888]" />
            <PaperGrain />

            {/* 책 컨테이너 */}
            <div className="relative z-10 max-w-5xl mx-auto page-turn-in">
              {/* 책등 그림자 (중앙 세로 가운데) — md 이상에서만 */}
              <div className="hidden md:block absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-16
                              bg-gradient-to-r from-transparent via-ink/30 to-transparent
                              pointer-events-none z-20" />

              <div className="grid md:grid-cols-2 gap-0 md:gap-0
                              bg-paper rounded-2xl md:rounded-[2rem]
                              shadow-[0_30px_60px_-30px_rgba(58,36,24,0.45)]
                              overflow-hidden relative
                              border border-paper-edge">

                {/* ─────── 좌측 페이지: 디저트 ─────── */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.7 }}
                  className="relative flex flex-col justify-center p-6 md:p-10 md:pr-14
                             min-h-[60vh] md:min-h-[78vh]
                             bg-gradient-to-br from-[#FBF3E3] to-[#F0DEB6]"
                >
                  <PaperGrain />
                  <CornerOrnament corner="tl" className="absolute top-3 left-3 w-9 h-9 text-ink/35" />
                  <CornerOrnament corner="bl" className="absolute bottom-3 left-3 w-9 h-9 text-ink/35" />

                  {/* 페이지 헤더 */}
                  <div className="relative flex items-center justify-between mb-4">
                    <span className="font-script text-lg text-jam tracking-wide">
                      Recipe №{pageNum}
                    </span>
                    <span className="font-display text-[10px] text-ink/50 tracking-[0.3em]">
                      FOX&apos;S BAKERY
                    </span>
                  </div>
                  <Divider variant="wave" className="w-full h-3 text-ink/40 mb-6" />

                  {/* 디저트 사진 — 마스킹 테이프로 고정된 폴라로이드 */}
                  <div className="relative flex items-center justify-center mt-4 md:mt-2">
                    {/* 살짝 틀어진 종이 폴라로이드 */}
                    <motion.div
                      initial={{ rotate: 0, y: 12, opacity: 0 }}
                      animate={{ rotate: -2.5, y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 80, damping: 14 }}
                      className="relative bg-[#FCF5E6] p-3 md:p-4 pb-10 md:pb-12
                                 shadow-[0_18px_30px_-18px_rgba(58,36,24,0.5)]
                                 border border-paper-edge"
                    >
                      <MaskingTape
                        className="absolute -top-3 left-6"
                        width={70} rotate={-12} tone="honey"
                      />
                      <MaskingTape
                        className="absolute -top-3 right-8"
                        width={70} rotate={9} tone="sage"
                      />

                      <div className="w-56 h-56 md:w-72 md:h-72 bg-[#F3E2C2]
                                      flex items-center justify-center">
                        <AnimatedDessert
                          dessertId={result.id}
                          image={result.image}
                          name={result.name}
                          variant="card"
                          className="w-48 h-48 md:w-60 md:h-60"
                          imgClassName="w-48 h-48 md:w-60 md:h-60 object-contain"
                        />
                      </div>

                      {/* 폴라로이드 캡션 */}
                      <p className="absolute bottom-2 left-0 right-0 text-center
                                    font-script text-xl text-ink/80">
                        {result.name}
                      </p>
                    </motion.div>

                    {/* 옆에 손글씨 메모 */}
                    <motion.div
                      initial={{ opacity: 0, x: 10, rotate: 0 }}
                      animate={{ opacity: 1, x: 0, rotate: 7 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="hidden md:block absolute -right-4 bottom-12
                                 max-w-[140px] text-jam"
                    >
                      <span className="font-script text-xl leading-tight block">
                        제일 좋아하는<br />레시피!
                      </span>
                      <svg viewBox="0 0 60 30" className="w-14 h-7 mt-1 text-jam"
                           fill="none" stroke="currentColor" strokeWidth="1.4"
                           strokeLinecap="round">
                        <path d="M2 4 Q 30 30, 56 12" strokeDasharray="3 3" />
                        <path d="M56 12 L 50 8 M 56 12 L 48 16" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* 콤보 라벨 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="relative mt-8 flex items-center justify-center gap-2 flex-wrap"
                  >
                    {result.combo.split('/').map((part, i, arr) => (
                      <span key={i} className="flex items-center gap-2">
                        <span className="font-display text-sm md:text-base text-ink/80
                                         px-2.5 py-0.5 bg-honey-soft/30
                                         border border-ink/15 rounded-full">
                          {part.trim()}
                        </span>
                        {i < arr.length - 1 && (
                          <Sparkle className="w-3 h-3 text-jam/70" />
                        )}
                      </span>
                    ))}
                  </motion.div>

                  {/* 페이지 번호 */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <span className="font-script text-base text-ink/55 tracking-widest">
                      · {pageNum} ·
                    </span>
                  </div>
                </motion.section>

                {/* ─────── 우측 페이지: 텍스트 ─────── */}
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="relative flex flex-col justify-center p-6 md:p-10 md:pl-14
                             min-h-[60vh] md:min-h-[78vh]
                             bg-gradient-to-bl from-[#FCF5E6] to-[#F0DEB6]"
                >
                  <PaperGrain />
                  <CornerOrnament corner="tr" className="absolute top-3 right-3 w-9 h-9 text-ink/35" />
                  <CornerOrnament corner="br" className="absolute bottom-3 right-3 w-9 h-9 text-ink/35" />
                  <WheatSprig className="absolute top-10 right-4 w-8 h-auto text-sage/40" />

                  {/* 페이지 헤더 */}
                  <div className="relative flex items-center justify-between mb-4">
                    <span className="font-display text-[10px] text-ink/50 tracking-[0.3em]">
                      PERSONALITY
                    </span>
                    <span className="font-script text-lg text-jam tracking-wide">
                      a note for you
                    </span>
                  </div>
                  <Divider variant="wave" className="w-full h-3 text-ink/40 mb-6" />

                  {/* 성격 한줄 */}
                  <motion.h2
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="font-display text-2xl md:text-3xl font-bold text-ink
                               text-center leading-tight ink-bleed-in"
                  >
                    {result.personality}
                  </motion.h2>
                  <div className="flex justify-center my-5">
                    <Divider className="w-28 h-3 text-jam/70" />
                  </div>

                  {/* 디저트 설명 — drop cap + 들여쓰기 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="relative mb-7"
                  >
                    <p className="font-display text-[15px] md:text-base text-ink/85
                                  leading-loose first-letter:font-display
                                  first-letter:text-5xl first-letter:font-bold
                                  first-letter:text-jam first-letter:mr-1
                                  first-letter:float-left first-letter:leading-[0.9]
                                  first-letter:mt-1">
                      {result.description}
                    </p>
                  </motion.div>

                  {/* 작은 디바이더 */}
                  <div className="flex justify-center my-5">
                    <Floret className="w-5 h-5 text-honey/80" />
                  </div>

                  {/* 버튼 2개 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex justify-center items-start gap-6 mt-10"
                  >
                    <InkButton
                      size="sm"
                      tone="honey"
                      arrow={false}
                      onClick={() => {
                        const text =
                          `나의 디저트는 "${result.name}"!\n성격: ${result.personality}\n\n${result.description}\n\n여우씨의 디저트 레시피에서 확인해보세요!`
                        if (navigator.share) {
                          navigator.share({ title: '여우씨의 디저트 레시피', text })
                        } else {
                          navigator.clipboard.writeText(text)
                          alert('결과가 클립보드에 복사되었습니다!')
                        }
                      }}
                      aria-label="결과 공유하기"
                    >
                      결과 공유
                    </InkButton>

                    <InkButton
                      size="sm"
                      sub="recipe book"
                      onClick={onViewBook}
                      aria-label="디저트 북 보기"
                    >
                      디저트 북 보기
                    </InkButton>
                  </motion.div>

                  {/* 페이지 번호 */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <span className="font-script text-base text-ink/55 tracking-widest">
                      · {pageNum} ·
                    </span>
                  </div>
                </motion.section>
              </div>

              {/* 책 아래 그림자 */}
              <div className="h-6 w-[90%] mx-auto bg-ink/20 blur-xl rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
