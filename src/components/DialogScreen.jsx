import { useState, useEffect, useRef } from 'react'
import FoxKitchen, { KitchenPortraitStrip } from './shared/FoxKitchen'
import { kitchenSrcs } from '../assets/screenImages'
import { LoadingCover } from './shared/ArtStage'
import BackButton from './shared/BackButton'
import { foxDialogs } from '../data/desserts'
import { useImagesReady } from '../hooks/useImagesReady'

export default function DialogScreen({ onComplete, onBack }) {
  const lines = foxDialogs.intro
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const completedRef = useRef(false)

  const currentLine = lines[lineIndex] || ''
  const isTyping = charIndex < currentLine.length

  // 원화·여우 레이어가 다 준비된 뒤에 화면을 연다 (타자기도 그때부터 시작)
  const { ready } = useImagesReady(kitchenSrcs)

  useEffect(() => {
    if (!ready) return
    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => setCharIndex(prev => prev + 1), 40)
      return () => clearTimeout(timer)
    }
  }, [ready, charIndex, currentLine])

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

  if (!ready) return <LoadingCover />

  const typed = (
    <>
      {currentLine.slice(0, charIndex)}
      {isTyping && <span className="typing-caret" />}
    </>
  )

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <FoxKitchen text={typed} hint={isTyping ? null : hintText} />
      <KitchenPortraitStrip text={typed} hint={isTyping ? null : hintText} />

      {/* 화면 전체 탭 — 원화 레이어 위를 덮는다 (이전 버튼보다는 아래) */}
      <button
        onClick={handleClick}
        className="absolute inset-0 z-30 cursor-pointer"
        aria-label="대화 진행"
      />

      <BackButton onClick={onBack} label="타이틀로" />
    </div>
  )
}
