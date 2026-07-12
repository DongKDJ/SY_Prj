import { useState, useEffect } from 'react'

export default function DialogBox({ lines, onComplete, speed = 40, fullscreen = false }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [prevLines, setPrevLines] = useState(lines)

  // lines 교체 시 처음부터 다시 타이핑 — 렌더 중 상태 보정 패턴 (이펙트 리셋 대체)
  if (prevLines !== lines) {
    setPrevLines(lines)
    setLineIndex(0)
    setCharIndex(0)
  }

  const currentLine = lines[lineIndex] || ''
  const isTyping = charIndex < currentLine.length

  useEffect(() => {
    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => setCharIndex(prev => prev + 1), speed)
      return () => clearTimeout(timer)
    }
  }, [charIndex, currentLine, speed])

  const handleClick = () => {
    if (isTyping) {
      setCharIndex(currentLine.length)
    } else if (lineIndex < lines.length - 1) {
      setLineIndex(prev => prev + 1)
      setCharIndex(0)
    } else {
      onComplete?.()
    }
  }

  const content = (
    <div className="w-full max-w-xl mx-auto bg-cream-dark/90 backdrop-blur-sm
                    rounded-2xl px-6 py-4 text-left
                    border-2 border-cabin/30 shadow-lg
                    transition-all duration-300">
      <p className="text-brown text-base leading-relaxed min-h-[3rem]">
        <span className="text-cabin font-semibold mr-2">여우씨</span>
        <span>{currentLine.slice(0, charIndex)}</span>
        {isTyping && <span className="typing-caret" />}
      </p>
      <p className="text-right text-xs text-brown-light/60 mt-2">
        {isTyping ? '' : lineIndex < lines.length - 1 ? '클릭하여 계속 ▶' : '클릭하여 진행 ▶'}
      </p>
    </div>
  )

  // fullscreen: 화면 어디를 눌러도 작동
  if (fullscreen) {
    return (
      <>
        <button
          onClick={handleClick}
          className="fixed inset-0 z-50 cursor-pointer"
        />
        <div className="relative z-40 pointer-events-none">
          <div className="pointer-events-auto">
            {content}
          </div>
        </div>
      </>
    )
  }

  return (
    <button onClick={handleClick} className="block w-full cursor-pointer">
      {content}
    </button>
  )
}
