import { goldFrames } from '../../assets/screenImages'

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

/* 원화 로딩 대기 화면 — 레이어가 낱장으로 뜨는 대신 종이색에서 멈췄다가 완성된 화면을 연다 */
export function LoadingCover({ progress }) {
  return (
    <div className="h-[100dvh] w-full bg-paper flex flex-col items-center justify-center gap-5">
      <span className="font-script text-xl text-ink/50 script-shimmer">
        여우씨가 레시피 재료를 준비하고 있어요…
      </span>
      {progress != null && (
        <div className="w-56 h-1.5 rounded-full bg-ink/10 overflow-hidden">
          <div
            className="h-full bg-honey rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}
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
