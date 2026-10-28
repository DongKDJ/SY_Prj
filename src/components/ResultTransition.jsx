import { useState, useRef, useEffect } from 'react'
import { getDessertImage, getDessertLayers } from '../assets/imageMap'
import FoxKitchen, { KitchenPortraitStrip } from './shared/FoxKitchen'
import BackButton from './shared/BackButton'

/* 오븐 대기 — 오프닝과 같은 여우씨 부엌에서 오른쪽 오븐 창이 달아오르고,
   다 구워지면 여우씨가 말풍선으로 꺼내 보자고 한다 */
const BAKING_LINE = '음~ 달콤한 냄새! 오븐 안에서 디저트가 부풀어 오르고 있어...'
const DONE_LINE = '다 구워졌다! 너의 이야기가 담긴 디저트를 확인해볼까?'
const BAKE_MS = 3000

export default function ResultTransition({ onComplete, result, onBack }) {
  const [done, setDone] = useState(false)
  const [charIndex, setCharIndex] = useState(0)
  const calledRef = useRef(false)

  const line = done ? DONE_LINE : BAKING_LINE
  const isTyping = charIndex < line.length

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true)
      setCharIndex(0)
    }, BAKE_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isTyping) return
    const timer = setTimeout(() => setCharIndex(prev => prev + 1), 40)
    return () => clearTimeout(timer)
  }, [isTyping, charIndex])

  // 오븐 대기 동안 결과 디저트 이미지 선로딩 (레이어 우선, 없으면 단일 폴백)
  useEffect(() => {
    if (!result) return
    const layers = getDessertLayers(result.id)
    const sources = layers
      ? [layers.plate, layers.back, ...layers.mains, ...layers.subs]
      : [getDessertImage(result.image)]
    sources.filter(Boolean).forEach(src => { new Image().src = src })
  }, [result])

  const handleComplete = () => {
    if (isTyping) {
      setCharIndex(line.length)
      return
    }
    if (calledRef.current) return
    calledRef.current = true
    // 영구 래치 금지 — 전환이 무산돼도 다시 누를 수 있게 재무장 (이중 전진은 700ms 락이 방어)
    setTimeout(() => { calledRef.current = false }, 1000)
    onComplete()
  }

  const typed = (
    <>
      {line.slice(0, charIndex)}
      {isTyping && <span className="typing-caret" />}
    </>
  )
  const hint = done && !isTyping ? '탭하여 꺼내 보기 →' : null

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <FoxKitchen text={typed} hint={hint} baking />
      <KitchenPortraitStrip text={typed} hint={hint} />

      {/* 다 구워진 뒤에만 화면 전체 탭으로 넘어간다 */}
      {done && (
        <button
          onClick={handleComplete}
          className="absolute inset-0 z-30 cursor-pointer"
          aria-label="책장 넘기기"
        />
      )}

      <BackButton onClick={onBack} />
    </div>
  )
}
