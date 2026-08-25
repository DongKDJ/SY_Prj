import { useState, useCallback, useMemo, useRef } from 'react'
import { dessertResults } from '../data/desserts'

const SCREENS = [
  'title',
  'dialog',
  'stage1',
  'stage2',
  'stage3',
  'stage4',
  'resultTransition',
  'result',
  'dessertBook',
]

// 이전 화면 — 오븐(resultTransition)은 되돌아가도 곧장 다시 구워지는 자동 화면이라
// 결과에서 뒤로 갈 때는 건너뛰고 마지막 선택으로 보낸다.
const BACK_TO = {
  dialog: 'title',
  stage1: 'dialog',
  stage2: 'stage1',
  stage3: 'stage2',
  stage4: 'stage3',
  resultTransition: 'stage4',
  result: 'stage4',
  dessertBook: 'result',
}

export function useGameState() {
  const [screen, setScreen] = useState('title')
  const [selections, setSelections] = useState([])
  const lockRef = useRef(false)

  // 4단계 선택이 모두 모여야 키가 매칭됨 — 미완성 조합은 null
  const currentResult = useMemo(
    () => dessertResults[selections.join('-')] || null,
    [selections],
  )

  const selectCard = useCallback((stageIndex, cardId) => {
    setSelections(prev => {
      const next = [...prev]
      next[stageIndex] = cardId
      return next
    })
  }, [])

  // 전환 락: 한 번 호출되면 700ms간 추가 호출 무시
  const nextScreen = useCallback(() => {
    if (lockRef.current) return
    lockRef.current = true
    setTimeout(() => { lockRef.current = false }, 700)

    setScreen(prev => {
      const idx = SCREENS.indexOf(prev)
      return idx < SCREENS.length - 1 ? SCREENS[idx + 1] : prev
    })
  }, [])

  const prevScreen = useCallback(() => {
    if (lockRef.current) return
    lockRef.current = true
    setTimeout(() => { lockRef.current = false }, 700)

    setScreen(prev => BACK_TO[prev] || prev)
  }, [])

  const goToScreen = useCallback((screenName) => {
    if (lockRef.current) return
    lockRef.current = true
    setTimeout(() => { lockRef.current = false }, 700)

    setScreen(screenName)
  }, [])

  const restart = useCallback(() => {
    lockRef.current = false
    setScreen('title')
    setSelections([])
  }, [])

  return {
    screen,
    selections,
    currentResult,
    selectCard,
    nextScreen,
    prevScreen,
    goToScreen,
    restart,
  }
}
