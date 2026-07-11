import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  PaperGrain,
  Divider,
  CornerOrnament,
  FloatingMotes,
} from './shared/Decorations'

/* 잉크 선으로 그린 향기 연기 — 세 가닥이 번갈아 피어오름 */
function ScentSwirls({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 96"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <path className="scent-line" style={{ animationDelay: '0s' }}
            d="M38 88 C 32 72, 46 64, 40 50 C 34 38, 46 30, 42 16" />
      <path className="scent-line" style={{ animationDelay: '1.1s' }}
            d="M62 92 C 56 76, 70 66, 63 52 C 57 40, 70 30, 65 14" />
      <path className="scent-line" style={{ animationDelay: '2.2s' }}
            d="M86 86 C 80 72, 92 64, 87 52 C 82 42, 92 32, 88 20" />
    </svg>
  )
}

export default function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState(0)
  const calledRef = useRef(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 2500)
    const t3 = setTimeout(() => {
      // 한 번만 호출되도록 보호
      if (!calledRef.current) {
        calledRef.current = true
        onComplete()
      }
    }, 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, []) // 의존성 비움 — 마운트 시 1회만 실행

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase >= 2 ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="min-h-[100dvh] relative overflow-hidden bg-paper"
    >
      {/* ── 페이지 배경: 속표지 종이 ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBF4E6] via-[#F6E9CF] to-[#EBD9B6]" />
      <PaperGrain />
      <div className="page-vignette" />
      <FloatingMotes count={10} palette={['honey', 'sage', 'jam']} />

      {/* ── 4 코너 장식 ── */}
      <CornerOrnament corner="tl" className="absolute top-5 left-5 w-10 h-10 text-ink/30" />
      <CornerOrnament corner="tr" className="absolute top-5 right-5 w-10 h-10 text-ink/30" />
      <CornerOrnament corner="bl" className="absolute bottom-5 left-5 w-10 h-10 text-ink/30" />
      <CornerOrnament corner="br" className="absolute bottom-5 right-5 w-10 h-10 text-ink/30" />

      {/* ── 본문: 프롤로그 페이지 ── */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
        {/* 상단 캡션 */}
        <div className="ink-bleed-in flex items-center gap-3 mb-8">
          <span className="h-px w-10 bg-ink/25" />
          <span className="font-script text-2xl text-jam script-shimmer">— prologue —</span>
          <span className="h-px w-10 bg-ink/25" />
        </div>

        {/* 향기 연기 */}
        <div className="ink-bleed-in text-ink/45" style={{ animationDelay: '0.2s' }}>
          <ScentSwirls className="w-20 h-16 md:w-24 md:h-20" />
        </div>

        {phase >= 1 && (
          <>
            {/* 의성어 */}
            <p className="ink-bleed-in font-display text-sm text-ink/50 tracking-[0.3em] mt-1 mb-6">
              보글보글..
            </p>

            {/* 본문 */}
            <p className="ink-bleed-in font-display text-lg md:text-2xl text-ink leading-relaxed"
               style={{ animationDelay: '0.15s' }}>
              깊은 숲속 어디선가 흐르는<br />향긋한 버터의 향기..
            </p>

            <div className="ink-bleed-in my-6" style={{ animationDelay: '0.3s' }}>
              <Divider className="w-36 h-3 text-jam/70" />
            </div>

            <p className="ink-bleed-in font-display italic text-sm md:text-base text-ink/55"
               style={{ animationDelay: '0.45s' }}>
              향기를 따라가 볼까요?
            </p>
          </>
        )}

        {/* 하단 손글씨 */}
        <span className="ink-bleed-in absolute bottom-9 font-script text-lg text-ink/40"
              style={{ animationDelay: '0.6s' }}>
          the story begins…
        </span>
      </div>
    </motion.div>
  )
}
