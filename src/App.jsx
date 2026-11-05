import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useGameState } from './hooks/useGameState'
import { readKioskFlag, useKioskIdle, useKioskLock } from './hooks/useKiosk'
import { useWakeLock, useAndroidBack } from './hooks/useDevice'
import ErrorBoundary from './components/shared/ErrorBoundary'
import { useImagesReady } from './hooks/useImagesReady'
import KioskIdlePrompt from './components/shared/KioskIdlePrompt'
import { LoadingCover } from './components/shared/ArtStage'
import {
  titleBg, titleLogo, titleSpoon, titleFork, titleBgPatch, goldFrames,
  openingBg, openingBubble, openingObject,
  bookmarkBg, grassLayers, bookmarkTitles, ingredientLayers, cardPlate,
} from './assets/screenImages'
import { cardImages, cardBack } from './assets/imageMap'
import { foxLayerSources } from './assets/foxLayers'
import backButtonImg from './assets/images/ui/back-button.png'
import TitleScreen from './components/TitleScreen'
import DialogScreen from './components/DialogScreen'
import StageScreen from './components/StageScreen'
import ResultTransition from './components/ResultTransition'
import ResultScreen from './components/ResultScreen'
import DessertBook from './components/DessertBook'
import PhotoScreen from './components/PhotoScreen'
import SoundToggle from './components/shared/SoundToggle'
import SoundGate from './components/shared/SoundGate'
import { play, startBgm } from './lib/sound'

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
  titleBg, titleBgPatch, titleSpoon, titleFork, titleLogo, ...goldFrames,
  openingBg, openingBubble, openingObject, ...foxLayerSources,
  bookmarkBg, ...grassLayers,
  ...Object.values(bookmarkTitles), ...Object.values(ingredientLayers),
  ...Object.values(cardImages), cardBack, cardPlate,
  backButtonImg,
]

function App() {
  const {
    screen,
    selections,
    currentResult,
    selectCard,
    nextScreen,
    prevScreen,
    goToScreen,
    restart,
  } = useGameState()

  // 결과 화면을 어느 페이지로 열지 — 오븐에서 오면 메달리온 공개, 사진 찍기에서 돌아오면 곧장 펼친 책
  const [resultPhase, setResultPhase] = useState('reveal')
  // 스테이지를 어느 페이즈로 열지 — 대화에서 오면 책갈피, 결과·오븐에서 뒤로 오면 곧장 카드 고르기
  // (스테이지 사이에서 뒤로 갈 때와 같은 규칙. 2026-11-04 검수: 결과에서 이전 → 책갈피라 한 번 더 눌러야 했다)
  const [stageEntry, setStageEntry] = useState('bookmark')

  useKioskLock(isKiosk)
  useWakeLock()     // 화면 꺼짐 방지 (2026-11-05 대표)
  useAndroidBack()  // 폰 뒤로 가기 = 이전으로

  // 소리 — 열리자마자 배경음악 시도(막히면 첫 터치·키 입력에서), 버튼을 누를 때마다 클릭음.
  // 카드처럼 제 소리가 따로 있는 버튼은 data-sfx="none"으로 뺀다.
  useEffect(() => {
    startBgm()
    const onDown = (e) => {
      startBgm()
      const btn = e.target.closest?.('button, [role="button"]')
      if (btn && btn.dataset.sfx !== 'none' && !btn.disabled) play('click')
    }
    // 우클릭·길게 누르기 메뉴 차단 — 모든 기기(퍼가기 방지, 2026-11-05 대표). 사진 찍기 결과(.allow-save)만 예외.
    const onMenu = (e) => { if (!e.target.closest?.('.allow-save')) e.preventDefault() }
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', startBgm, true)
    document.addEventListener('contextmenu', onMenu)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', startBgm, true)
      document.removeEventListener('contextmenu', onMenu)
    }
  }, [])
  const idleSeconds = useKioskIdle({
    enabled: isKiosk,
    armed: screen !== 'title', // 타이틀에서는 되돌릴 진행 상태가 없다
    onReset: restart,
    idleMs: screen === 'photo' ? 180_000 : undefined, // 포토부스는 포즈 잡는 동안 손을 안 대니 3분
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
      {/* 오류 안전망 — 평소엔 투명, 깨지면 카드 띄우고 처음으로 */}
      <ErrorBoundary onReset={restart}>
        <AnimatePresence mode="wait">
          <motion.div key={pageKey} {...pageTransition}>
            {screen === 'title' && (
              <TitleScreen onStart={nextScreen} />
            )}

            {screen === 'dialog' && (
              <DialogScreen onComplete={() => { setStageEntry('bookmark'); nextScreen() }} onBack={prevScreen} />
            )}

            {stageNo && (
              <StageScreen
                stageIndex={stageNo - 1}
                selections={selections.slice(0, stageNo - 1)}
                initialPhase={stageEntry}
                onSelect={selectCard}
                onComplete={nextScreen}
                onBack={prevScreen}
              />
            )}

            {screen === 'resultTransition' && (
              <ResultTransition
                onComplete={() => { setResultPhase('reveal'); nextScreen() }}
                result={currentResult}
                onBack={() => { setStageEntry('cards'); prevScreen() }}
              />
            )}

            {screen === 'result' && (
              <ResultScreen
                result={currentResult}
                initialPhase={resultPhase}
                onViewBook={() => goToScreen('dessertBook')}
                onTakePhoto={() => goToScreen('photo')}
                onRestart={restart}
                kiosk={isKiosk}
                onBack={() => { setStageEntry('cards'); prevScreen() }}
              />
            )}

            {screen === 'photo' && (
              <PhotoScreen
                result={currentResult}
                kiosk={isKiosk}
                onBack={() => { setResultPhase('detail'); prevScreen() }}
              />
            )}

            {screen === 'dessertBook' && (
              <DessertBook
                currentResult={currentResult}
                onRestart={restart}
                onExit={() => { setResultPhase('detail'); goToScreen('result') }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* 소리 켜기·끄기 — 사진 찍기 화면은 아래 트레이와 겹쳐서 숨긴다 */}
        {screen !== 'photo' && <SoundToggle />}
        {/* 브라우저가 자동재생을 막았으면 첫 터치로 소리부터 켜게 안내(두 번째 터치가 시작) */}
        {screen === 'title' && <SoundGate />}

        <AnimatePresence>
          {idleSeconds !== null && (
            <KioskIdlePrompt key="kiosk-idle" secondsLeft={idleSeconds} />
          )}
        </AnimatePresence>
      </ErrorBoundary>
      </div>
    </MotionConfig>
  )
}

export default App
