import { useState, useEffect } from 'react'

export default function DialogBox({ lines, onComplete, speed = 40 }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  const currentLine = lines[lineIndex] || ''

  useEffect(() => {
    setLineIndex(0)
    setCharIndex(0)
    setIsTyping(true)
  }, [lines])

  useEffect(() => {
    if (!isTyping) return
    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => setCharIndex(prev => prev + 1), speed)
      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
    }
  }, [charIndex, currentLine, isTyping, speed])

  const handleClick = () => {
    if (isTyping) {
      // 타이핑 중이면 즉시 완료
      setCharIndex(currentLine.length)
      setIsTyping(false)
    } else if (lineIndex < lines.length - 1) {
      // 다음 대사
      setLineIndex(prev => prev + 1)
      setCharIndex(0)
      setIsTyping(true)
    } else {
      // 모든 대사 완료
      onComplete?.()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full max-w-xl mx-auto block bg-cream-dark/90 backdrop-blur-sm
                 rounded-2xl px-6 py-4 text-left cursor-pointer
                 border-2 border-cabin/30 shadow-lg
                 transition-all duration-300 hover:border-cabin/50"
    >
      <p className="text-brown text-base leading-relaxed min-h-[3rem]">
        <span className="text-cabin font-semibold mr-2">여우씨</span>
        <span>{currentLine.slice(0, charIndex)}</span>
        {isTyping && <span className="typing-caret" />}
      </p>
      <p className="text-right text-xs text-brown-light/60 mt-2">
        {isTyping ? '' : lineIndex < lines.length - 1 ? '클릭하여 계속 ▶' : '클릭하여 진행 ▶'}
      </p>
    </button>
  )
}
