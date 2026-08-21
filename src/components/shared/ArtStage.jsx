import { motion } from 'framer-motion'
import { goldFrames, titleBg } from '../../assets/screenImages'
import { useImagesReady } from '../../hooks/useImagesReady'

/* 3840x2160 원화 레이어 화면용 16:9 스테이지.
   화면을 cover 로 채우고(세로 화면 = 중앙 크롭) 자식은 스테이지 기준 % 좌표로 배치한다.
   width/height 중 한쪽 max() 만 이기므로 16:9 비율이 항상 유지된다. */
export function ArtStage({ children, className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 'max(100vw, 177.78dvh)', height: 'max(100dvh, 56.25vw)' }}
      >
        {children}
      </div>
    </div>
  )
}

/* 스테이지 전체를 덮는 원화 레이어 한 장 */
export function ArtLayer({ src, className = '', style }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      className={`absolute inset-0 w-full h-full select-none pointer-events-none ${className}`}
      style={style}
    />
  )
}

/* 금장 프레임 5장 (전 화면 공통) */
export function GoldFrame() {
  return goldFrames.map((src, i) => <ArtLayer key={i} src={src} />)
}

/* 금장 프레임 전역 오버레이 — 개별 화면이 아니라 App 레벨에 상주시켜
   화면 전환 페이드 때마다 테두리가 사라졌다 다시 뜨지 않게 한다.
   titleBg를 게이트에 포함해 첫 등장이 타이틀 리빌보다 앞서지 않게 맞춘다. */
const FRAME_SRCS = [...goldFrames, titleBg]

export function ArtFrameOverlay() {
  const ready = useImagesReady(FRAME_SRCS)
  if (!ready) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-30 pointer-events-none"
    >
      <ArtStage>
        <GoldFrame />
      </ArtStage>
    </motion.div>
  )
}

/* 원화 로딩 대기 화면 — 레이어가 낱장으로 뜨는 대신 종이색에서 잠깐 멈췄다가 완성된 화면을 연다 */
export function LoadingCover() {
  return (
    <div className="h-[100dvh] w-full bg-paper flex items-center justify-center">
      <span className="font-script text-xl text-ink/50 script-shimmer">
        여우씨가 페이지를 준비하고 있어요…
      </span>
    </div>
  )
}

/* 세로 화면 보조 — 원화 캔버스의 가로 밴드(top%~bottom%)만 잘라 보여준다.
   중앙 크롭으로 잘려나가는 타이틀 로고·책갈피 배너를 세로에서 따로 띄울 때 사용. */
export function ArtBandCrop({ src, top, bottom, className = '' }) {
  const h = bottom - top
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `3840 / ${Math.round(2160 * h / 100)}` }}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute left-0 w-full select-none pointer-events-none"
        style={{ top: `${-(top / h) * 100}%` }}
      />
    </div>
  )
}
