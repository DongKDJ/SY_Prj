import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Character from './shared/Character'
import {
  PaperGrain,
  Sparkle,
  Floret,
  WheatSprig,
  CornerOrnament,
  MaskingTape,
  Divider,
} from './shared/Decorations'
import { foxDialogs } from '../data/desserts'

/* 카운터에 진열된 작은 디저트 폴라로이드들 */
const shelfTreats = [
  { emoji: '🧁', x: 'left-[3%] md:left-[6%]',  size: 'w-12 h-12 md:w-16 md:h-16', rot: -6, tone: 'honey' },
  { emoji: '🍫', x: 'left-[18%] md:left-[20%]', size: 'w-10 h-10 md:w-14 md:h-14', rot: 4,  tone: 'jam' },
  { emoji: '🍰', x: 'right-[4%] md:right-[8%]', size: 'w-14 h-14 md:w-20 md:h-20', rot: 5,  tone: 'sage' },
  { emoji: '🍮', x: 'right-[22%] md:right-[26%]', size: 'w-11 h-11 md:w-14 md:h-14', rot: -7, tone: 'honey' },
  { emoji: '🍪', x: 'right-[36%] md:right-[42%]', size: 'w-10 h-10 md:w-12 md:h-12', rot: 8,  tone: 'cream' },
]

export default function DialogScreen({ onComplete }) {
  const lines = foxDialogs.intro
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const completedRef = useRef(false)

  const currentLine = lines[lineIndex] || ''

  useEffect(() => {
    setCharIndex(0)
    setIsTyping(true)
  }, [lineIndex])

  useEffect(() => {
    if (!isTyping) return
    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => setCharIndex(prev => prev + 1), 40)
      return () => clearTimeout(timer)
    }
    setIsTyping(false)
  }, [charIndex, currentLine, isTyping])

  const handleClick = () => {
    if (isTyping) {
      setCharIndex(currentLine.length)
      setIsTyping(false)
    } else if (lineIndex < lines.length - 1) {
      setLineIndex(prev => prev + 1)
    } else if (!completedRef.current) {
      completedRef.current = true
      onComplete()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="min-h-[100dvh] w-full flex flex-col relative overflow-hidden
                 cursor-pointer text-left bg-paper"
    >
      {/* ===== 배경: 종이 + 오두막 벽 ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5DDB8] via-[#E8C49E] to-[#C89770]" />
        <PaperGrain />
        <div className="page-vignette" />

        {/* 벽 줄눈 (나무판자 결) */}
        <div className="absolute inset-0 opacity-25"
             style={{
               backgroundImage:
                 'repeating-linear-gradient(0deg, transparent 0 38px, rgba(58,36,24,0.18) 38px 39px)',
             }} />

        {/* 4코너 장식 */}
        <CornerOrnament corner="tl" className="absolute top-4 left-4 w-10 h-10 text-ink/40" />
        <CornerOrnament corner="tr" className="absolute top-4 right-4 w-10 h-10 text-ink/40" />
      </div>

      {/* ===== 상단 여백 ===== */}
      <div className="flex-1 min-h-[28vh]" />

      {/* ===== 말풍선 (양피지 메모) ===== */}
      <motion.div
        initial={{ opacity: 0, y: -8, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 100, damping: 14 }}
        className="relative z-30 mx-auto w-[88%] max-w-md mb-3"
      >
        <div className="relative">
          {/* 마스킹 테이프 (양 상단) */}
          <MaskingTape className="absolute -top-3 left-6" width={60} rotate={-12} tone="honey" />
          <MaskingTape className="absolute -top-3 right-6" width={60} rotate={10} tone="jam" />

          {/* 메모 바디 */}
          <div className="bg-[#FBF3E3] backdrop-blur-sm rounded-md px-5 py-4
                          border border-paper-edge shadow-[0_12px_24px_-12px_rgba(58,36,24,0.5)]
                          relative">
            <PaperGrain />

            {/* 헤더 라벨 */}
            <div className="relative flex items-center gap-2 mb-2">
              <Sparkle className="w-3 h-3 text-jam" />
              <span className="font-script text-base text-jam">Fox says…</span>
              <div className="flex-1 h-px bg-ink/15" />
              <span className="font-display text-[10px] text-ink/40 tracking-[0.25em]">
                NOTE {String(lineIndex + 1).padStart(2, '0')}/{String(lines.length).padStart(2, '0')}
              </span>
            </div>

            <p className="relative font-display text-ink text-sm md:text-base leading-relaxed
                          min-h-[2.5rem]">
              {currentLine.slice(0, charIndex)}
              {isTyping && <span className="typing-caret" />}
            </p>

            <div className="relative flex items-center justify-between mt-2">
              <Floret className="w-3 h-3 text-honey/70" />
              <p className="font-script text-xs text-jam/70">
                {isTyping ? '' : lineIndex < lines.length - 1 ? '탭하여 계속 →' : '탭하여 시작 →'}
              </p>
            </div>
          </div>

          {/* 메모 꼬리 (살짝 들린 모서리 그림자) */}
          <div className="absolute -bottom-1 left-[18%] w-3 h-3
                          bg-[#FBF3E3] border-r border-b border-paper-edge
                          rotate-45 shadow-sm" />
        </div>
      </motion.div>

      {/* ===== 캐릭터 + 카운터 + 디저트 진열 ===== */}
      <div className="relative z-20 w-full">
        {/* 캐릭터 */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 80 }}
          className="relative z-20 w-60 md:w-[70vh] mx-auto -mb-6"
        >
          {/* 발 밑 그림자 */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-3
                          bg-ink/30 rounded-full blur-md" />
          <Character variant="half" size="large" />

          {/* 캐릭터 옆 작은 손글씨 캡션 */}
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="hidden md:block absolute top-12 right-0 translate-x-full
                       font-script text-lg text-jam/80 -rotate-3"
          >
            여우씨
          </motion.span>
        </motion.div>

        {/* 카운터 */}
        <div className="relative z-25">
          {/* 카운터 상단 (디저트 진열) */}
          <div className="h-6 bg-gradient-to-b from-[#C4A06E] via-[#B8956E] to-[#A0805A]
                          rounded-t-md shadow-md relative z-30">
            {/* 가장자리 줄 */}
            <div className="absolute top-1 left-0 right-0 h-px bg-cream/30" />

            {/* 디저트 카드 */}
            {shelfTreats.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14, scale: 0.85, rotate: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: d.rot }}
                transition={{ delay: 0.7 + i * 0.08, type: 'spring', stiffness: 90 }}
                className={`absolute -top-[110%] ${d.x} ${d.size}
                           bg-[#FBF3E3] flex items-center justify-center
                           border border-paper-edge shadow-md p-1`}
              >
                {/* 미니 마스킹 테이프 */}
                <MaskingTape
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2"
                  width={Math.floor(parseInt(d.size.match(/w-(\d+)/)?.[1] || 12) * 2)}
                  rotate={d.rot * 0.7}
                  tone={d.tone}
                />
                <span className="text-xl md:text-3xl drop-shadow-sm">{d.emoji}</span>
              </motion.div>
            ))}
          </div>

          {/* 카운터 본체 (나무 결) */}
          <div className="h-28 md:h-36 bg-gradient-to-b from-[#8B6D4A] to-[#5A4028] relative">
            <PaperGrain />
            {/* 결무늬 */}
            <div className="absolute inset-0 opacity-40"
                 style={{
                   backgroundImage:
                     'repeating-linear-gradient(0deg, transparent 0 10px, rgba(0,0,0,0.12) 10px 11px), repeating-linear-gradient(90deg, transparent 0 80px, rgba(255,255,255,0.04) 80px 81px)',
                 }} />
            {/* 가장자리 두께선 */}
            <div className="absolute top-3 left-4 right-4 h-[1px] bg-cabin-light/20" />
            <div className="absolute top-7 left-4 right-4 h-[1px] bg-cabin-light/12" />

            {/* 작은 라벨 — 가게 이름 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2
                            font-script text-base text-cream/70 tracking-wider">
              Fox&apos;s Bakery · est. forest
            </div>
          </div>
        </div>
      </div>

      {/* ===== 하단 안내 바 (양피지 톤) ===== */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-40 bg-[#3A2418] backdrop-blur-sm
                   px-4 py-3 flex items-center justify-center gap-3
                   border-t-2 border-honey/40"
      >
        <Sparkle className="w-3 h-3 text-honey" />
        <span className="font-display text-cream/85 text-xs md:text-sm tracking-wide">
          {isTyping
            ? '여우씨가 말하고 있어요…'
            : lineIndex < lines.length - 1
              ? '화면을 탭하여 다음 대사'
              : '화면을 탭하여 시작하기'}
        </span>
        <Sparkle className="w-3 h-3 text-honey" />
      </motion.div>
    </button>
  )
}
