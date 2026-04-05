import { useState, useEffect } from 'react'

// 여우씨 캐릭터 - placeholder로 SVG 사용, 나중에 PNG 교체
export default function Character({ variant = 'half', className = '' }) {
  const [blinkFrame, setBlinkFrame] = useState(0)

  // 눈 깜빡임 주기 (실제 이미지 교체용 준비)
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkFrame(1)
      setTimeout(() => setBlinkFrame(2), 80)
      setTimeout(() => setBlinkFrame(3), 160)
      setTimeout(() => setBlinkFrame(0), 300)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  const isHalf = variant === 'half'
  const size = isHalf ? 'w-28 h-36' : 'w-40 h-56'

  // Placeholder 여우 캐릭터 (PNG 교체 전)
  return (
    <div className={`${size} relative flex-shrink-0 ${className}`}>
      {/* 실제 이미지로 교체할 때:
          <img src={`/assets/images/character/fox-${variant}.png`} />
          눈 깜빡임: fox-blink-${blinkFrame + 1}.png 를 오버레이
      */}
      <div className={`${size} rounded-2xl bg-cabin-light/30 border-2 border-cabin/20
                        flex items-center justify-center flex-col gap-1`}>
        <span className="text-4xl">{blinkFrame > 0 ? '😊' : '🦊'}</span>
        <span className="text-xs text-brown-light">여우씨</span>
      </div>
    </div>
  )
}
