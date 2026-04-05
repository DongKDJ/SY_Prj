import { useState, useCallback, useRef } from 'react'
import { dessertResults } from '../data/desserts'

const SCREENS = [
  'title',
  'intro',
  'dialog',
  'stage1',
  'stage2',
  'stage3',
  'stage4',
  'resultTransition',
  'result',
  'dessertBook',
]

export function useGameState() {
  const [screen, setScreen] = useState('title')
  const [selections, setSelections] = useState([])
  const [currentResult, setCurrentResult] = useState(null)
  const selectionsRef = useRef(selections)

  // selections가 바뀔 때 ref도 업데이트
  selectionsRef.current = selections

  const selectCard = useCallback((stageIndex, cardId) => {
    setSelections(prev => {
      const next = [...prev]
      next[stageIndex] = cardId
      return next
    })
  }, [])

  // nextScreen은 의존성 없이 안정적 참조 유지
  const nextScreen = useCallback(() => {
    setScreen(prev => {
      const idx = SCREENS.indexOf(prev)
      if (idx < SCREENS.length - 1) {
        const next = SCREENS[idx + 1]
        if (next === 'result') {
          const key = selectionsRef.current.join('-')
          setCurrentResult(dessertResults[key] || null)
        }
        return next
      }
      return prev
    })
  }, [])

  const goToScreen = useCallback((screenName) => {
    setScreen(screenName)
    if (screenName === 'result') {
      const key = selectionsRef.current.join('-')
      setCurrentResult(dessertResults[key] || null)
    }
  }, [])

  const restart = useCallback(() => {
    setScreen('title')
    setSelections([])
    setCurrentResult(null)
  }, [])

  return {
    screen,
    selections,
    currentResult,
    selectCard,
    nextScreen,
    goToScreen,
    restart,
  }
}
