import { goldFrames } from '../../assets/screenImages'

/* 3840x2160 원화 레이어 화면용 16:9 스테이지. 자식은 스테이지 기준 % 좌표로 배치한다.
   가로 화면 = contain(원화 전체가 보이고 16:10 등은 위아래 여백 — 바탕 화면 ArtStage에 bg-ink를 줘 액자 여백으로), 세로 화면 = cover 중앙 크롭.
   크기 규칙은 index.css .art-stage-box */
export function ArtStage({ children, className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="art-stage-box absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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

/* 원화가 없는 화면(결과·도감)의 배경 — 책갈피 책상 원화를 흐리게 깔고 금장 테두리를 두른다.
   실시간 backdrop-filter 대신 이미지 자체에 blur (페이드 중 모퉁이 깜빡임 방지, StageScreen 확대 뷰와 같은 방식).
   veil: 원화 위 종이빛 덧칠 클래스 — 글이 원화에 묻히지 않게 */
export function ArtBackdrop({ src, veil = 'bg-cream/45' }) {
  // fixed — 도감·펼친 책처럼 화면보다 긴 페이지에서도 배경과 테두리는 화면에 붙어 있게
  return (
    <div className="fixed inset-0" aria-hidden="true">
      <ArtStage className="bg-ink">
        <img
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute -inset-[3%] w-[106%] h-[106%] max-w-none object-cover select-none"
          style={{ filter: 'blur(14px) saturate(1.05)' }}
        />
        <div className={`absolute inset-0 ${veil}`} />
        <GoldFrame />
      </ArtStage>
    </div>
  )
}

/* 원화 로딩 대기 화면 — 레이어가 낱장으로 뜨는 대신 종이색에서 멈췄다가 완성된 화면을 연다 */
export function LoadingCover({ progress }) {
  return (
    <div className="h-[100dvh] w-full bg-paper flex flex-col items-center justify-center gap-5">
      <span className="font-script text-xl text-ink/50 script-shimmer">
        여우씨가 레시피 재료를 준비하고 있어요…
      </span>
      {progress != null && (
        <div className="gold-rim w-56 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full gold-bead rounded-full transition-[width] duration-300 ease-out"
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
