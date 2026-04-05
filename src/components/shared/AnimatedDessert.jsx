import { getDessertImage, getDessertLayers } from '../../assets/imageMap'

/**
 * 디저트 애니메이션 컴포넌트
 *
 * 레이어 이미지가 있으면 → 접시(static) + 메인·서브(boing + 흔들림)
 * 레이어 이미지가 없으면 → 단일 이미지에도 바운스 애니메이션 적용
 *
 * 이미지 파일 규칙 (src/assets/images/desserts/layers/):
 *   plate_NN.png       – 접시 (정적, 선택)
 *   main_NN.png        – 디저트 본체 (필수, 바운스 대상)
 *   sub{N}_NN.png      – 서브 장식 (선택, 흔들림)
 *     파일명 규칙: sub{디저트번호}_{서브순번 01~04}.png
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
  const isThumb = variant === 'thumb'
  const bounceClass = isThumb ? 'dessert-float-sm' : 'dessert-bounce'

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
        {/* 접시 레이어 – 항상 정적 */}
        {layers.plate && (
          <img
            src={layers.plate}
            alt=""
            className="dessert-layer"
            draggable={false}
          />
        )}

        {/* 바운스 그룹: 메인 (접시에 붙은 느낌) */}
        <div className={bounceClass}>
          {layers.main && (
            <img
              src={layers.main}
              alt={name}
              className="dessert-layer"
              draggable={false}
            />
          )}
          {/* 서브 레이어: 개별 흔들림 (각기 다른 타이밍) */}
          {layers.subs.map((sub, i) => (
            <img
              key={i}
              src={sub}
              alt=""
              className="dessert-layer dessert-sub"
              style={{
                animationDelay: `${(i + 1) * 0.25}s`,
                animationDuration: `${1.8 + (i + 1) * 0.3}s`,
              }}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* 그림자 */}
      {!isThumb && <div className="dessert-shadow-el" />}
    </div>
  )
}
