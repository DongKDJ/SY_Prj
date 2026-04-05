import { AnimatePresence, motion } from 'framer-motion'
import { useGameState } from './hooks/useGameState'
import TitleScreen from './components/TitleScreen'
import IntroScreen from './components/IntroScreen'
import DialogScreen from './components/DialogScreen'
import StageScreen from './components/StageScreen'
import ResultTransition from './components/ResultTransition'
import ResultScreen from './components/ResultScreen'
import DessertBook from './components/DessertBook'

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
}

function App() {
  const {
    screen,
    selections,
    currentResult,
    selectCard,
    nextScreen,
    goToScreen,
    restart,
  } = useGameState()

  return (
    <div className="min-h-[100dvh] bg-cream overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={screen} {...pageTransition}>
          {screen === 'title' && (
            <TitleScreen onStart={nextScreen} />
          )}

          {screen === 'intro' && (
            <IntroScreen onComplete={nextScreen} />
          )}

          {screen === 'dialog' && (
            <DialogScreen onComplete={nextScreen} />
          )}

          {screen === 'stage1' && (
            <StageScreen
              stageIndex={0}
              selections={selections.slice(0, 0)}
              onSelect={selectCard}
              onComplete={nextScreen}
            />
          )}

          {screen === 'stage2' && (
            <StageScreen
              stageIndex={1}
              selections={selections.slice(0, 1)}
              onSelect={selectCard}
              onComplete={nextScreen}
            />
          )}

          {screen === 'stage3' && (
            <StageScreen
              stageIndex={2}
              selections={selections.slice(0, 2)}
              onSelect={selectCard}
              onComplete={nextScreen}
            />
          )}

          {screen === 'stage4' && (
            <StageScreen
              stageIndex={3}
              selections={selections.slice(0, 3)}
              onSelect={selectCard}
              onComplete={nextScreen}
            />
          )}

          {screen === 'resultTransition' && (
            <ResultTransition onComplete={nextScreen} />
          )}

          {screen === 'result' && (
            <ResultScreen
              result={currentResult}
              onViewBook={() => goToScreen('dessertBook')}
            />
          )}

          {screen === 'dessertBook' && (
            <DessertBook
              currentResult={currentResult}
              onRestart={restart}
              onExit={restart}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
