import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Character from './shared/Character'
import { ArtStage, ArtLayer, GoldFrame } from './shared/ArtStage'
import {
  openingBg, openingBubble, openingObject,
  bookmarkBg, grassLayers, bookmarkTitles,
} from '../assets/screenImages'
import { foxDialogs } from '../data/desserts'

/* ── 배치 튜닝 상수 (스테이지 % 좌표, 3840x2160 원화 기준) ── */
// 책상 윗선: 이 높이에서 여우를 잘라 책상 뒤에 걸친 것처럼 보이게 한다
const DESK_TOP = '88%'
// 여우씨: 책상 뒤 중앙-왼쪽, 말풍선 꼬리(캔버스 약 53%, 72%)가 머리 오른쪽 위에 오도록.
// 얼굴이 잼병 오브젝트(캔버스 x 35~54%)에 가리지 않게 왼쪽에. bottom은 책상 윗선 기준.
const FOX = { left: '6%', width: '41%', bottom: '-6%' }
// 말풍선 구름 안쪽 텍스트 영역 (원화 말풍선 bbox: x 49~94%, y 14~72%)
const BUBBLE_TEXT = { left: '55%', top: '25%', width: '32%', height: '31%' }
// 말풍선 전체 축소 배율 — 말풍선 중심(71% 43%) 기준, 안의 텍스트·안내도 같이 줄어든다
const BUBBLE_SCALE = 0.92

export default function DialogScreen({ onComplete }) {
  const lines = foxDialogs.intro
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const completedRef = useRef(false)

  const currentLine = lines[lineIndex] || ''
  const isTyping = charIndex < currentLine.length

  useEffect(() => {
    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => setCharIndex(prev => prev + 1), 40)
      return () => clearTimeout(timer)
    }
  }, [charIndex, currentLine])

  // 다음 화면(책갈피) 원화 선로딩 — 전환 시 4K 디코드로 화면이 끊기지 않게
  useEffect(() => {
    ;[bookmarkBg, ...grassLayers, bookmarkTitles[1]].forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const handleClick = () => {
    if (isTyping) {
      setCharIndex(currentLine.length)
    } else if (lineIndex < lines.length - 1) {
      setLineIndex(prev => prev + 1)
      setCharIndex(0)
    } else if (!completedRef.current) {
      completedRef.current = true
      // 영구 래치 금지 — 전환이 무산돼도 다시 누를 수 있게 재무장 (이중 전진은 700ms 락이 방어)
      setTimeout(() => { completedRef.current = false }, 1000)
      onComplete()
    }
  }

  const hintText = lineIndex < lines.length - 1 ? '탭하여 계속 →' : '탭하여 시작 →'

  return (
    <button
      onClick={handleClick}
      className="relative block h-[100dvh] w-full overflow-hidden cursor-pointer text-left"
      aria-label="대화 진행"
    >
      <ArtStage>
        <ArtLayer src={openingBg} />

        {/* 여우씨 — 책상 윗선(DESK_TOP)에서 잘라 책상 뒤에 걸친 것처럼 */}
        <div
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{ height: DESK_TOP }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.15 }}
            className="absolute"
            style={{ left: FOX.left, width: FOX.width, bottom: FOX.bottom }}
          >
            <Character variant="half" size="free" className="w-full aspect-[1224/1129]" />
          </motion.div>
        </div>

        {/* 책상 위 잼병 — 여우 앞 전경 */}
        <ArtLayer src={openingObject} />

        <GoldFrame />

        {/* 말풍선 + 대사 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 90, damping: 13 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 art-bob">
            <div
              className="absolute inset-0"
              style={{ transform: `scale(${BUBBLE_SCALE})`, transformOrigin: '71% 43%' }}
            >
              <ArtLayer src={openingBubble} />

              {/* 대사 텍스트 (세로 화면에서는 하단 스트립으로 대체) */}
              <div
                className="absolute flex items-center justify-center portrait:hidden"
                style={BUBBLE_TEXT}
              >
                <p
                  className="font-display font-bold text-ink leading-relaxed text-center"
                  style={{ fontSize: 'max(3.2dvh, 1.8vw)' }}
                >
                  {currentLine.slice(0, charIndex)}
                  {isTyping && <span className="typing-caret" />}
                </p>
              </div>

              {/* 계속 안내 (말풍선 오른쪽 아래) */}
              {!isTyping && (
                <span
                  className="absolute font-display text-ink/60 portrait:hidden"
                  style={{ left: '83%', top: '57%', fontSize: 'max(2dvh, 1.1vw)' }}
                >
                  {hintText}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </ArtStage>

      {/* 세로 화면: 대사를 하단 양피지 스트립으로 (말풍선이 크롭돼 읽을 수 없으므로) */}
      <div className="hidden portrait:block absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[92vw] z-20">
        <div className="bg-paper/95 border border-paper-edge rounded-md px-4 py-3
                        shadow-[0_12px_24px_-12px_rgba(58,36,24,0.5)]">
          <p className="font-display text-ink text-sm leading-relaxed min-h-[3.5rem]">
            {currentLine.slice(0, charIndex)}
            {isTyping && <span className="typing-caret" />}
          </p>
          <p className="font-script text-right text-sm text-jam/70 mt-1 min-h-[1.25rem]">
            {!isTyping && hintText}
          </p>
        </div>
      </div>
    </button>
  )
}
