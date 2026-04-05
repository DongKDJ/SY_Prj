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
  const lockRef = useRef(false)

  selectionsRef.current = selections

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
    if (lockRef.current) return
    lockRef.current = true
    setTimeout(() => { lockRef.current = false }, 700)

    setScreen(screenName)
    if (screenName === 'result') {
      const key = selectionsRef.current.join('-')
      setCurrentResult(dessertResults[key] || null)
    }
  }, [])

  const restart = useCallback(() => {
    lockRef.current = false
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
