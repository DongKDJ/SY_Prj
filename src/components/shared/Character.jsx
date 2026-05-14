import { useState, useEffect } from 'react'

// 캐릭터 레이어 이미지 동적 임포트
// fox-body / fox-blink-01~04 / fox-hand 가 폴더에 있으면 자동 인식
const foxLayerModules = import.meta.glob(
  '../../assets/images/character/fox-*.png',
  { eager: true }
)

function getFoxLayer(filename) {
  const key = `../../assets/images/character/${filename}`
  return foxLayerModules[key]?.default || null
}

const bodySource = getFoxLayer('fox-body.png')
const blinkSources = [
  getFoxLayer('fox-blink-01.png'),
  getFoxLayer('fox-blink-02.png'),
  getFoxLayer('fox-blink-03.png'),
  getFoxLayer('fox-blink-04.png'),
]
const handSource = getFoxLayer('fox-hand.png')

export default function Character({ variant = 'half', size = 'normal', className = '' }) {
  const isHalf = variant === 'half'
  const sizeClass = isHalf && size === 'large'
    ? 'w-60 h-72 md:w-auto md:h-[65vh]'
    : 'w-44 h-56 md:w-52 md:h-64'

  const [blinkFrame, setBlinkFrame] = useState(0)

  useEffect(() => {
    let cancelled = false
    let timer

    const scheduleNextBlink = () => {
      const wait = 2000 + Math.random() * 2500
      timer = setTimeout(() => {
        if (cancelled) return
        setBlinkFrame(1)
        timer = setTimeout(() => {
          if (cancelled) return
          setBlinkFrame(2)
          timer = setTimeout(() => {
            if (cancelled) return
            setBlinkFrame(3)
            timer = setTimeout(() => {
              if (cancelled) return
              setBlinkFrame(0)
              scheduleNextBlink()
            }, 80)
          }, 120)
        }, 80)
      }, wait)
    }

    scheduleNextBlink()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [])

  return (
    <div className={`relative flex-shrink-0 ${sizeClass} ${className}`}>
      {bodySource && (
        <img
          src={bodySource}
          alt="여우씨"
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}
      {blinkSources[blinkFrame] && (
        <img
          src={blinkSources[blinkFrame]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}
      {handSource && (
        <img
          src={handSource}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none fox-hand-sway"
        />
      )}
    </div>
  )
}
