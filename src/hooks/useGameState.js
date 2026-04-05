import { useState, useCallback } from 'react'
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

  const selectCard = useCallback((stageIndex, cardId) => {
    setSelections(prev => {
      const next = [...prev]
      next[stageIndex] = cardId
      return next
    })
  }, [])

  const nextScreen = useCallback(() => {
    setScreen(prev => {
      const idx = SCREENS.indexOf(prev)
      if (idx < SCREENS.length - 1) {
        const next = SCREENS[idx + 1]
        // 결과 전환 시 디저트 계산
        if (next === 'result') {
          const key = selections.join('-')
          setCurrentResult(dessertResults[key] || null)
        }
        return next
      }
      return prev
    })
  }, [selections])

  const goToScreen = useCallback((screenName) => {
    setScreen(screenName)
    if (screenName === 'result') {
      const key = selections.join('-')
      setCurrentResult(dessertResults[key] || null)
    }
  }, [selections])

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
