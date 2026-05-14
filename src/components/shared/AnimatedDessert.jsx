import { getDessertImage, getDessertLayers } from '../../assets/imageMap'
import { dessertLayerConfig } from '../../data/dessertLayerConfig'

/**
 * 디저트 애니메이션 컴포넌트
 *
 * 레이어 이미지가 있으면 → 접시(static) + 백(static) + 메인·서브(boing + 흔들림)
 * 레이어 이미지가 없으면 → 단일 이미지에도 바운스 애니메이션 적용
 *
 * 레이어 순서 (뒤→앞): 접시 > 백 > 메인 > 서브
 * 같은 종류 내에서는 숫자가 높을수록 앞에 렌더링
 */
export default function AnimatedDessert({
  dessertId,
  image,
  name = '',
  variant = 'full',
  className = '',
  imgClassName = 'w-full h-full object-contain',
}) {
  const layers = getDessertLayers(dessertId)
  const fallbackImage = getDessertImage(image)
  const config = dessertLayerConfig[dessertId]
  const isThumb = variant === 'thumb'
  const bounceType = config?.bounce || 'bounce'
  const bounceClass = isThumb ? 'dessert-float-sm' : `dessert-${bounceType}`
  const pivotY = config?.pivotY || 'bottom'

  /* ── 레이어 없음: 단일 이미지에도 바운스 적용 ── */
  if (!layers) {
    if (fallbackImage) {
      return (
        <div className={`dessert-stage ${className}`}>
          <div className="dessert-wrap">
            <div className={bounceClass}>
              <img src={fallbackImage} alt={name} className="dessert-layer" draggable={false} />
            </div>
          </div>
          {!isThumb && <div className="dessert-shadow-el" />}
        </div>
      )
    }
    const emojiSize = variant === 'thumb'
      ? 'text-4xl md:text-5xl'
      : 'text-7xl md:text-8xl'
    return <span className={emojiSize}>🍰</span>
  }

  /* ── 레이어 애니메이션 렌더링 ── */
  return (
    <div className={`dessert-stage ${className}`}>
      <div className="dessert-wrap">
        {/* 서브 레이어 (접시 뒤): 맨 뒤에 렌더링 */}
        {layers.subs.map((sub, i) => {
          if (!config?.subBehind?.[i]) return null
          const type = config?.subs?.[i] || 'jelly'
          const subDelay = config?.subDelays?.[i]
          const delay = subDelay !== undefined && subDelay !== null ? subDelay : (i + 1) * 0.15
          return (
            <img
              key={`sub-behind-${i}`}
              src={sub}
              alt=""
              className={`dessert-layer dessert-sub dessert-sub-${type}`}
              style={{ animationDelay: `${delay}s` }}
              draggable={false}
            />
          )
        })}

        {/* 접시 레이어 – 항상 정적 */}
        {layers.plate && (
          <img
            src={layers.plate}
            alt=""
            className="dessert-layer"
            draggable={false}
          />
        )}

        {/* 바운스 그룹: 백 + 메인 + 서브 (접시에 붙은 느낌) */}
        <div className={bounceClass} style={{ transformOrigin: `center ${pivotY}` }}>
          {/* 백 레이어 – 개별 미세 바운스 */}
          {layers.back && (
            <img
              src={layers.back}
              alt=""
              className="dessert-layer dessert-back"
              draggable={false}
            />
          )}
          {/* 메인 레이어 (복수 가능, 숫자 높을수록 앞) */}
          {layers.mains.map((main, i) => (
            <img
              key={`main-${i}`}
              src={main}
              alt={i === 0 ? name : ''}
              className="dessert-layer"
              draggable={false}
            />
          ))}
          {/* 서브 레이어 (바운스 그룹 안): 메인과 함께 움직임 */}
          {layers.subs.map((sub, i) => {
            if (config?.subDetach?.[i]) return null
            const type = config?.subs?.[i] || 'jelly'
            const subPivot = config?.subPivots?.[i]
            const subDelay = config?.subDelays?.[i]
            const delay = subDelay !== undefined && subDelay !== null ? subDelay : (i + 1) * 0.15
            return (
              <img
                key={`sub-${i}`}
                src={sub}
                alt=""
                className={`dessert-layer dessert-sub dessert-sub-${type}`}
                style={{
                  animationDelay: `${delay}s`,
                  ...(subPivot && { transformOrigin: subPivot.includes(' ') ? subPivot : `center ${subPivot}` }),
                }}
                draggable={false}
              />
            )
          })}
        </div>

        {/* 서브 레이어 (바운스 그룹 밖): 독립 움직임 */}
        {layers.subs.map((sub, i) => {
          if (!config?.subDetach?.[i] || config?.subBehind?.[i]) return null
          const type = config?.subs?.[i] || 'jelly'
          const subPivot = config?.subPivots?.[i]
          const subDelay = config?.subDelays?.[i]
          const delay = subDelay !== undefined && subDelay !== null ? subDelay : (i + 1) * 0.15
          return (
            <img
              key={`sub-detach-${i}`}
              src={sub}
              alt=""
              className={`dessert-layer dessert-sub dessert-sub-${type}`}
              style={{
                animationDelay: `${delay}s`,
                ...(subPivot && { transformOrigin: subPivot.includes(' ') ? subPivot : `center ${subPivot}` }),
              }}
              draggable={false}
            />
          )
        })}
      </div>

      {/* 그림자 */}
      {!isThumb && <div className="dessert-shadow-el" />}
    </div>
  )
}
