import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArtStage, ArtLayer, GoldFrame, ArtBandCrop, LoadingCover } from './shared/ArtStage'
import {
  titleBg, titleLogo, goldFrames,
  openingBg, openingBubble, openingObject,
} from '../assets/screenImages'
import { foxLayerSources } from '../assets/foxLayers'
import { useImagesReady } from '../hooks/useImagesReady'

const TITLE_SRCS = [titleBg, titleLogo, ...goldFrames]

export default function TitleScreen({ onStart }) {
  const ready = useImagesReady(TITLE_SRCS)

  // 타이틀에 머무는 동안 다음 화면(대화) 원화·여우 레이어 선로딩
  useEffect(() => {
    ;[openingBg, openingBubble, openingObject, ...foxLayerSources].forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  if (!ready) return <LoadingCover />

  return (
    <button
      onClick={onStart}
      className="relative block h-[100dvh] w-full overflow-hidden cursor-pointer"
      aria-label="시작하기"
    >
      <ArtStage>
        <ArtLayer src={titleBg} className="art-zoom" />

        {/* 타이틀 로고 — 가로 화면에서는 원화 좌표 그대로 (세로에서는 아래 밴드로 대체) */}
        <motion.div
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute inset-0 portrait:hidden"
        >
          <div className="absolute inset-0 art-bob">
            <ArtLayer src={titleLogo} />
          </div>
        </motion.div>

        <GoldFrame />
      </ArtStage>

      {/* 세로 화면: 로고를 캔버스 상단 밴드에서 잘라 화면 폭에 맞춰 표시 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="hidden portrait:block absolute top-[6%] left-1/2 -translate-x-1/2 w-[94vw] z-10"
      >
        <div className="art-bob">
          <ArtBandCrop src={titleLogo} top={1} bottom={49} />
        </div>
      </motion.div>

      {/* 하단 시작 안내 — 뷰포트 기준(세로 크롭에서도 항상 보이게) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-[5%] left-0 right-0 z-10 flex flex-col items-center gap-1 pointer-events-none"
      >
        <span className="font-display font-bold text-ink text-lg md:text-2xl script-shimmer
                         [text-shadow:0_0_10px_rgba(255,248,240,0.95),0_1px_3px_rgba(255,248,240,0.9)]">
          화면을 탭해 레시피를 펼쳐보세요
        </span>
        <span className="font-script text-xl text-jam
                         [text-shadow:0_0_8px_rgba(255,248,240,0.9)]">
          open the book
        </span>
      </motion.div>
    </button>
  )
}
