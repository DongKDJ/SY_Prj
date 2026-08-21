import { useState, useEffect } from 'react'
import { bodySource, blinkSources, handSource } from '../../assets/foxLayers'

export default function Character({ variant = 'half', size = 'normal', className = '' }) {
  const isHalf = variant === 'half'
  // 'free' = 크기를 호출부(className)에 위임 — ArtStage % 좌표 배치용
  const sizeClass = size === 'free'
    ? ''
    : isHalf && size === 'large'
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
