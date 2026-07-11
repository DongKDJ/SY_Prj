import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { InkButton } from './shared/InkButton'
import {
  PaperGrain,
  CornerOrnament,
  FloatingMotes,
  MaskingTape,
  Sparkle,
} from './shared/Decorations'

/* 잉크 선으로 그린 오븐 — 창 너머 온기가 은은히 펄스, 위로 김이 피어오름 */
function StoryOven({ className = '' }) {
  return (
    <svg viewBox="0 0 160 158" className={className} fill="none" aria-hidden>
      <defs>
        <radialGradient id="oven-glow-grad" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#F3C063" />
          <stop offset="60%" stopColor="#D4A24C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#D4A24C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 김 (오븐 위) */}
      <g stroke="#3A2418" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round">
        <path className="scent-line" style={{ animationDelay: '0s' }}
              d="M62 34 C 57 26, 66 21, 62 12" />
        <path className="scent-line" style={{ animationDelay: '1.2s' }}
              d="M80 36 C 75 27, 85 22, 80 10" />
        <path className="scent-line" style={{ animationDelay: '2.1s' }}
              d="M98 34 C 93 26, 102 21, 98 13" />
      </g>

      {/* 다리 */}
      <g stroke="#3A2418" strokeWidth="2.4" strokeLinecap="round">
        <path d="M38 148 L 38 154" />
        <path d="M122 148 L 122 154" />
      </g>

      {/* 본체 */}
      <rect x="20" y="44" width="120" height="104" rx="10"
            fill="#F7E8CC" stroke="#3A2418" strokeWidth="2.2" />

      {/* 상판 구분선 + 다이얼 2개 + 온도창 */}
      <path d="M20 68 L 140 68" stroke="#3A2418" strokeWidth="1.6" />
      <circle cx="42" cy="56" r="4" stroke="#3A2418" strokeWidth="1.8" />
      <path d="M42 53.2 L 42 56" stroke="#3A2418" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="60" cy="56" r="4" stroke="#3A2418" strokeWidth="1.8" />
      <path d="M60 56 L 62.4 54.2" stroke="#3A2418" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="102" y="51" width="26" height="10" rx="3.5" stroke="#3A2418" strokeWidth="1.5" />
      <circle cx="110" cy="56" r="1.2" fill="#8B2E3F" />
      <circle cx="116" cy="56" r="1.2" fill="#D4A24C" />
      <circle cx="122" cy="56" r="1.2" fill="#7A8A6F" />

      {/* 손잡이 */}
      <rect x="52" y="75" width="56" height="5" rx="2.5" fill="#3A2418" fillOpacity="0.75" />

      {/* 오븐 창 (어두운 내부) */}
      <rect x="40" y="87" width="80" height="48" rx="7"
            fill="#2A1810" stroke="#3A2418" strokeWidth="2.2" />
      {/* 온기 글로우 */}
      <ellipse className="oven-glow" cx="80" cy="115" rx="34" ry="17" fill="url(#oven-glow-grad)" />
      {/* 부풀어 오르는 반죽 실루엣 */}
      <path d="M62 131 Q 64 112 80 112 Q 96 112 98 131 Z" fill="#E8C078" fillOpacity="0.85" />

      {/* 본체 모서리 작은 별 각인 */}
      <path d="M131 76 l1.1 2.8 2.8 1.1 -2.8 1.1 -1.1 2.8 -1.1 -2.8 -2.8 -1.1 2.8 -1.1 Z"
            fill="#8B2E3F" opacity="0.6" />
    </svg>
  )
}

export default function ResultTransition({ onComplete }) {
  const [showButton, setShowButton] = useState(false)
  const calledRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleComplete = () => {
    if (calledRef.current) return
    calledRef.current = true
    onComplete()
  }

  return (
    <div className="min-h-[100dvh] relative overflow-hidden bg-paper">
      {/* ── 페이지 배경: 오븐 온기가 도는 저녁 종이 ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F6E3C2] via-[#F0D3A6] to-[#DDB582]" />
      <PaperGrain />
      <div className="page-vignette" />
      <FloatingMotes count={12} palette={['honey', 'jam', 'sage']} />

      {/* ── 4 코너 장식 ── */}
      <CornerOrnament corner="tl" className="absolute top-5 left-5 w-10 h-10 text-ink/30" />
      <CornerOrnament corner="tr" className="absolute top-5 right-5 w-10 h-10 text-ink/30" />
      <CornerOrnament corner="bl" className="absolute bottom-5 left-5 w-10 h-10 text-ink/30" />
      <CornerOrnament corner="br" className="absolute bottom-5 right-5 w-10 h-10 text-ink/30" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16">
        {/* 상단 캡션 */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-7"
        >
          <span className="h-px w-10 bg-ink/25" />
          <span className="font-script text-2xl text-jam script-shimmer">— baking time —</span>
          <span className="h-px w-10 bg-ink/25" />
        </motion.div>

        {/* 오븐 */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* 발 밑 그림자 */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-40 h-3
                          bg-ink/20 rounded-full blur-md" />
          <StoryOven className="w-44 md:w-56 h-auto" />
        </motion.div>

        {/* 캡션 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-5 font-display text-base md:text-lg text-ink/80"
        >
          디저트가 구워지고 있어요...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-1 font-script text-lg text-sage"
        >
          sweet things take time
        </motion.p>

        {/* 여우씨 메모 (양피지) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7 }}
          className="relative mt-8 w-[88%] max-w-md"
        >
          <MaskingTape className="absolute -top-3 left-8 z-10" width={58} rotate={-10} tone="honey" />
          <MaskingTape className="absolute -top-3 right-8 z-10" width={58} rotate={9} tone="jam" />
          <div className="relative bg-[#FBF3E3] rounded-md px-5 py-4 border border-paper-edge
                          shadow-[0_12px_24px_-12px_rgba(58,36,24,0.5)]">
            <PaperGrain />
            <div className="relative flex items-center gap-2 mb-1.5">
              <Sparkle className="w-3 h-3 text-jam" />
              <span className="font-script text-base text-jam">Fox says…</span>
              <div className="flex-1 h-px bg-ink/15" />
            </div>
            <p className="relative font-display text-ink text-sm md:text-base leading-relaxed text-center">
              너의 이야기가 담긴 디저트를 확인해볼까?
            </p>
          </div>
        </motion.div>

        {/* 책장 넘기기 버튼 */}
        {showButton && (
          <InkButton
            onClick={handleComplete}
            size="md"
            tone="jam"
            sub="turn the page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
            aria-label="책장 넘기기"
          >
            책장 넘기기
          </InkButton>
        )}
      </div>
    </div>
  )
}
