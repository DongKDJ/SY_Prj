import { motion } from 'framer-motion'
import Character from './shared/Character'
import {
  PaperGrain,
  Divider,
  Sparkle,
  WheatSprig,
  CornerOrnament,
  WaxSeal,
  FloatingMotes,
} from './shared/Decorations'

export default function TitleScreen({ onStart }) {
  return (
    <div className="min-h-[100dvh] w-full relative overflow-hidden bg-paper">
      {/* ── 페이지 배경: 종이 결 + 워시 그라데이션 ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBF3E3] via-[#F5E6CD] to-[#E8D0AC]" />
      <PaperGrain />
      <div className="page-vignette" />

      {/* ── 떠있는 작은 장식들 ── */}
      <FloatingMotes count={18} palette={['jam', 'honey', 'sage']} />

      {/* ── 4 코너 장식 ── */}
      <CornerOrnament corner="tl" className="absolute top-5 left-5 w-12 h-12 text-ink/40" />
      <CornerOrnament corner="tr" className="absolute top-5 right-5 w-12 h-12 text-ink/40" />
      <CornerOrnament corner="bl" className="absolute bottom-5 left-5 w-12 h-12 text-ink/40" />
      <CornerOrnament corner="br" className="absolute bottom-5 right-5 w-12 h-12 text-ink/40" />

      {/* ── 상단 캡션: Vol. I ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute top-12 left-0 right-0 flex items-center justify-center gap-3 z-10"
      >
        <span className="h-px w-12 bg-ink/30" />
        <span className="font-script text-xl text-jam tracking-wide script-shimmer">
          Vol. I
        </span>
        <span className="h-px w-12 bg-ink/30" />
      </motion.div>

      {/* ── 중앙 콘텐츠 ── */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center
                      px-6 pt-20 pb-32">
        {/* 타이틀 묶음 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-md mx-auto relative"
        >
          {/* 양옆 밀이삭 */}
          <WheatSprig className="absolute -left-6 md:-left-14 top-2 w-10 md:w-14 h-auto text-sage/70" />
          <WheatSprig flip className="absolute -right-6 md:-right-14 top-2 w-10 md:w-14 h-auto text-sage/70" />

          {/* 메인 타이틀 */}
          <h1 className="font-display text-[2.6rem] leading-[1.15] md:text-6xl md:leading-tight
                         text-ink font-bold tracking-tight relative">
            <span className="relative inline-block">
              여우씨의
              {/* 작은 별 강조 */}
              <Sparkle className="absolute -top-3 -right-5 w-4 h-4 text-honey" />
            </span>
            <br />
            <span className="relative inline-block">
              디저트 레시피
              <Sparkle className="absolute -bottom-2 -left-4 w-3 h-3 text-jam" />
            </span>
          </h1>

          {/* 손그림 디바이더 */}
          <div className="flex justify-center my-5">
            <Divider className="w-44 h-3 text-jam/80" />
          </div>

          {/* 서브카피 */}
          <p className="font-display italic text-base md:text-lg text-ink/75 leading-relaxed">
            나만의 디저트로 알아보는<br />
            <span className="font-script text-2xl text-jam not-italic">
              성격 이야기
            </span>
          </p>

          {/* 작은 캡션 */}
          <p className="mt-5 font-script text-lg text-sage tracking-wider">
            — a recipe for who you are —
          </p>
        </motion.div>

        {/* 여우씨 등장 (타이틀 아래 살짝 큰 캐릭터) */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 60, damping: 14 }}
          className="relative mt-2 md:mt-6"
        >
          {/* 캐릭터 발 밑 그림자 */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-3
                          bg-ink/25 rounded-full blur-md" />
          <Character variant="half" size="normal" />

          {/* 캐릭터 옆 손글씨 캡션 */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="hidden md:flex absolute -right-32 top-12 flex-col items-start"
          >
            <span className="font-script text-2xl text-jam -rotate-6">hello!</span>
            <span className="font-display text-xs text-ink/60 mt-1">— 여우씨가 인사를 건넵니다</span>
          </motion.div>
        </motion.div>

        {/* 시작 버튼 - 왁스 씰 형태 */}
        <motion.button
          onClick={onStart}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: 'spring', stiffness: 140, damping: 12 }}
          whileHover={{ scale: 1.06, rotate: 1 }}
          whileTap={{ scale: 0.94, rotate: -2 }}
          className="mt-10 relative group cursor-pointer"
          aria-label="시작하기"
        >
          {/* 점선 호 (씰 주변 도장 자국) */}
          <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full -m-3 pointer-events-none">
            <circle cx="70" cy="70" r="66" fill="none"
                    stroke="rgba(58, 36, 24, 0.35)" strokeWidth="1"
                    strokeDasharray="2 6" className="origin-center"
                    style={{ animation: 'spin 22s linear infinite' }} />
          </svg>

          <WaxSeal size={132} rotate={-4} className="seal-stamp">
            <span className="block font-display text-2xl leading-tight">시작하기</span>
            <span className="block font-script text-sm mt-1 opacity-80">open the book</span>
          </WaxSeal>
        </motion.button>

        {/* 하단 푸터 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3"
        >
          <span className="font-script text-base text-ink/45">Chapter Zero</span>
          <span className="w-1 h-1 rounded-full bg-ink/30" />
          <span className="font-display text-xs text-ink/45 tracking-widest">
            FOX&apos;S BAKERY · 2026
          </span>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
