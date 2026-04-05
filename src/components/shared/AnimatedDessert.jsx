import { useRef, createRef, useMemo } from 'react'
import { getDessertImage, getDessertLayers } from '../../assets/imageMap'
import useSpringRig from '../../physics/useSpringRig'

/**
 * 디저트 애니메이션 컴포넌트 — 스프링 물리 리깅
 *
 * 우선순위:
 *   1. 레이어 이미지 → 스프링 물리 (접시 고정 + 파트별 독립 흔들림 + 터치 반응)
 *   2. 단일 이미지 → 간단한 CSS 흔들림
 *   3. 이미지 없음 → 이모지
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

  if (layers) {
    return (
      <SpringDessert
        dessertId={dessertId}
        layers={layers}
        name={name}
        variant={variant}
        className={className}
      />
    )
  }

  if (fallbackImage) {
    return (
      <div className={`dessert-stage ${className}`}>
        <div className="dessert-wrap">
          <div className="dessert-bounce">
            <img src={fallbackImage} alt={name} className="dessert-layer" draggable={false} />
          </div>
        </div>
        {variant !== 'thumb' && <div className="dessert-shadow-el" />}
      </div>
    )
  }

  const emojiSize = variant === 'thumb' ? 'text-4xl md:text-5xl' : 'text-7xl md:text-8xl'
  return <span className={emojiSize}>🍰</span>
}

/**
 * 스프링 물리 기반 레이어 디저트
 */
function SpringDessert({ dessertId, layers, name, variant, className }) {
  const mainRef = useRef(null)
  const subRefs = useMemo(
    () => layers.subs.map(() => createRef()),
    [layers.subs.length]
  )

  const layerRefs = useMemo(
    () => ({ main: mainRef, subs: subRefs }),
    [subRefs]
  )

  const { onImpulse } = useSpringRig(dessertId, layerRefs, layers)

  return (
    <div className={`dessert-stage ${className}`}>
      <div
        className="dessert-wrap cursor-pointer"
        onClick={onImpulse}
      >
        {/* 접시 — 완전 정적 */}
        {layers.plate && (
          <img src={layers.plate} alt="" className="dessert-layer" draggable={false} />
        )}

        {/* 메인 본체 — 스프링 물리 */}
        <img
          ref={mainRef}
          src={layers.main}
          alt={name}
          className="dessert-layer dessert-layer-spring"
          draggable={false}
        />

        {/* 서브 레이어 — 각각 독립 스프링 */}
        {layers.subs.map((sub, i) => (
          <img
            key={i}
            ref={subRefs[i]}
            src={sub}
            alt=""
            className="dessert-layer dessert-layer-spring"
            draggable={false}
          />
        ))}
      </div>

      {variant !== 'thumb' && <div className="dessert-shadow-el" />}
    </div>
  )
}
