import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useGameState } from './hooks/useGameState'
import { readKioskFlag, useKioskIdle, useKioskLock } from './hooks/useKiosk'
import { useImagesReady } from './hooks/useImagesReady'
import KioskIdlePrompt from './components/shared/KioskIdlePrompt'
import { LoadingCover } from './components/shared/ArtStage'
import {
  titleBg, titleLogo, goldFrames,
  openingBg, openingBubble, openingObject,
  bookmarkBg, grassLayers, bookmarkTitles, ingredientLayers, cardPlate,
} from './assets/screenImages'
import { cardImages, cardBack } from './assets/imageMap'
import { foxLayerSources } from './assets/foxLayers'
import TitleScreen from './components/TitleScreen'
import DialogScreen from './components/DialogScreen'
import StageScreen from './components/StageScreen'
import ResultTransition from './components/ResultTransition'
import ResultScreen from './components/ResultScreen'
import DessertBook from './components/DessertBook'

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  // pointerEvents: 퇴장 페이드 중인 화면이 클릭을 받아 가드 ref를 다시 잠그는 유령 클릭 방지
  exit: { opacity: 0, pointerEvents: 'none' },
  transition: { duration: 0.5 },
}

const isKiosk = readKioskFlag()

// 시작 시 전 흐름 자산을 한 번에 로드 — 이후 어떤 화면에서도 요소가 낱장으로 뜨지 않는다.
// (결과 디저트 이미지는 오븐 대기 중 선로딩되는 기존 경로 유지)
const ALL_ART_SRCS = [
  titleBg, titleLogo, ...goldFrames,
  openingBg, openingBubble, openingObject, ...foxLayerSources,
  bookmarkBg, ...grassLayers,
  ...Object.values(bookmarkTitles), ...Object.values(ingredientLayers),
  ...Object.values(cardImages), cardBack, cardPlate,
]

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

  useKioskLock(isKiosk)
  const idleSeconds = useKioskIdle({
    enabled: isKiosk,
    armed: screen !== 'title', // 타이틀에서는 되돌릴 진행 상태가 없다
    onReset: restart,
  })

  // 스테이지 4개는 한 마운트를 공유 — 스테이지 사이에 페이지 페이드(크림색 플래시)와
  // 4K 레이어 리마운트가 끼지 않도록 key를 묶는다. 전환은 StageScreen 내부 페이즈가 담당.
  const stageNo = screen.startsWith('stage') ? parseInt(screen.slice(5), 10) : null
  const pageKey = stageNo ? 'stages' : screen

  // 전 자산 로드 완료 후에야 앱을 연다
  const { ready: assetsReady, progress } = useImagesReady(ALL_ART_SRCS)
  if (!assetsReady) {
    return (
      <MotionConfig reducedMotion="user">
        <LoadingCover progress={progress} />
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh] bg-cream overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={pageKey} {...pageTransition}>
            {screen === 'title' && (
              <TitleScreen onStart={nextScreen} />
            )}

            {screen === 'dialog' && (
              <DialogScreen onComplete={nextScreen} />
            )}

            {stageNo && (
              <StageScreen
                stageIndex={stageNo - 1}
                selections={selections.slice(0, stageNo - 1)}
                onSelect={selectCard}
                onComplete={nextScreen}
              />
            )}

            {screen === 'resultTransition' && (
              <ResultTransition onComplete={nextScreen} result={currentResult} />
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
                onExit={() => goToScreen('result')}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {idleSeconds !== null && (
            <KioskIdlePrompt key="kiosk-idle" secondsLeft={idleSeconds} />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default App
