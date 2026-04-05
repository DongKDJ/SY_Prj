import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Character from './shared/Character'
import { foxDialogs } from '../data/desserts'

const desserts = [
  { emoji: '🧁', x: 'left-1 md:left-4', size: 'w-12 h-12 md:w-16 md:h-16' },
  { emoji: '🍫', x: 'left-14 md:left-22', size: 'w-10 h-10 md:w-14 md:h-14' },
  { emoji: '🍰', x: 'right-2 md:right-6', size: 'w-14 h-14 md:w-20 md:h-20' },
  { emoji: '🍮', x: 'right-16 md:right-28', size: 'w-11 h-11 md:w-14 md:h-14' },
  { emoji: '🍪', x: 'right-28 md:right-44', size: 'w-9 h-9 md:w-12 md:h-12' },
]

export default function DialogScreen({ onComplete }) {
  const lines = foxDialogs.intro
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const completedRef = useRef(false)

  const currentLine = lines[lineIndex] || ''

  // 대사 바뀌면 타이핑 리셋
  useEffect(() => {
    setCharIndex(0)
    setIsTyping(true)
  }, [lineIndex])

  // 타이핑 효과
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
    } else {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete()
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className="min-h-[100dvh] w-full flex flex-col relative overflow-hidden
                 cursor-pointer bg-cream text-left"
    >
      {/* ===== 배경: 오두막 내부 ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8D5C4] via-[#F0E0D0] to-[#D4B896]" />
        {/* 선반 */}
        <div className="absolute top-[12%] left-[8%] right-[8%] h-3 bg-cabin-dark/30 rounded-full" />
        <div className="absolute top-[11%] left-[10%] w-8 h-8 bg-card rounded-lg border border-cabin/20
                        flex items-center justify-center text-lg shadow-sm">🫙</div>
        <div className="absolute top-[11%] left-[22%] w-7 h-9 bg-card rounded-lg border border-cabin/20
                        flex items-center justify-center text-base shadow-sm">📕</div>
        <div className="absolute top-[11%] right-[12%] w-8 h-8 bg-card rounded-lg border border-cabin/20
                        flex items-center justify-center text-lg shadow-sm">🍯</div>
        {/* 창문 */}
        <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-28 h-20 md:w-36 md:h-24
                        rounded-t-full border-4 border-cabin/30 bg-morning/50 overflow-hidden">
          <div className="absolute bottom-0 w-full h-1/2 bg-green-200/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[1px] h-full bg-cabin/20" />
          </div>
        </div>
      </div>

      {/* ===== 상단 여백 (배경이 보이는 공간) ===== */}
      <div className="flex-1 min-h-[20vh]" />

      {/* ===== 말풍선 ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className="relative z-30 mx-auto w-[85%] max-w-md mb-3"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4
                        border border-cabin/15 shadow-lg relative">
          <p className="text-brown text-sm md:text-base leading-relaxed min-h-[2.5rem]">
            {currentLine.slice(0, charIndex)}
            {isTyping && <span className="typing-caret" />}
          </p>
          <p className="text-right text-[10px] text-brown-light/50 mt-1.5">
            {isTyping ? '' : lineIndex < lines.length - 1 ? '탭하여 계속 ▶' : '탭하여 시작 ▶'}
          </p>
          {/* 말풍선 꼬리 */}
          <div className="absolute -bottom-[6px] left-[18%] w-3 h-3
                          bg-white/95 border-r border-b border-cabin/15
                          rotate-45" />
        </div>
      </motion.div>

      {/* ===== 캐릭터 + 카운터 + 디저트 ===== */}
      <div className="relative z-20 w-full">
        {/* 캐릭터 (카운터 뒤에 반신으로 서있음) */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 80 }}
          className="relative z-20 ml-[2%] md:ml-[8%] -mb-6"
        >
          <Character variant="half" size="large" />
        </motion.div>

        {/* 카운터 테이블 + 디저트 */}
        <div className="relative z-25">
          {/* 카운터 상단 면 (디저트가 올라가는 곳) */}
          <div className="relative">
            <div className="h-5 bg-gradient-to-b from-[#C4A06E] to-[#B8956E]
                            rounded-t-md shadow-md relative z-30">
              {/* 디저트 진열 */}
              {desserts.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.08, type: 'spring' }}
                  className={`absolute -top-full ${d.x} ${d.size}
                             bg-card/90 rounded-xl border border-cabin/15
                             flex items-center justify-center shadow-md
                             backdrop-blur-sm`}
                >
                  <span className="text-lg md:text-2xl">{d.emoji}</span>
                </motion.div>
              ))}
            </div>
            {/* 카운터 본체 */}
            <div className="h-24 md:h-32 bg-gradient-to-b from-[#8B6D4A] to-[#6B5035] relative">
              <div className="absolute top-3 left-4 right-4 h-[1px] bg-cabin-light/15" />
              <div className="absolute top-8 left-4 right-4 h-[1px] bg-cabin-light/10" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== 대답창 (하단 바) ===== */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-40 bg-cabin-dark/90 backdrop-blur-sm
                   px-4 py-3 flex items-center justify-center"
      >
        <span className="text-cream/80 text-xs md:text-sm">
          {isTyping
            ? '여우씨가 말하고 있어요...'
            : lineIndex < lines.length - 1
              ? '화면을 탭하여 다음 대사'
              : '화면을 탭하여 시작하기'
          }
        </span>
      </motion.div>
    </button>
  )
}
