import { getDessertImage, getDessertLayers } from '../../assets/imageMap'

/**
 * 레이어 분리 디저트 애니메이션 컴포넌트
 *
 * 레이어 이미지가 있으면 → 접시(static) + 메인·서브(boing 애니메이션)
 * 레이어 이미지가 없으면 → 기존 단일 이미지 fallback
 *
 * 이미지 파일 규칙 (src/assets/images/desserts/layers/):
 *   plate_01.png       – 접시 (정적, 선택)
 *   main_01.png        – 디저트 본체 (필수, 바운스 대상)
 *   sub{N}_01.png      – 서브 장식 (선택, 추가 흔들림)
 *     예: sub1_01.png, sub1_02.png, sub1_03.png = 디저트1의 서브 레이어 3개
 *     파일명 규칙: sub{디저트번호}_{서브순번 01~04}.png
 *
 * @param {number}  dessertId    – 디저트 번호 (1–16)
 * @param {string}  image        – 단일 이미지 파일명 (fallback, e.g. 'dessert-01.png')
 * @param {string}  name         – alt 텍스트
 * @param {'full'|'card'|'thumb'} variant – 애니메이션 강도
 * @param {string}  className    – 외부 래퍼 클래스
 * @param {string}  imgClassName – fallback 단일 이미지 클래스
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

  /* ── 레이어 없음: 기존 단일 이미지 또는 이모지 ── */
  if (!layers) {
    if (fallbackImage) {
      return <img src={fallbackImage} alt={name} className={imgClassName} />
    }
    const emojiSize = variant === 'thumb'
      ? 'text-4xl md:text-5xl'
      : 'text-7xl md:text-8xl'
    return <span className={emojiSize}>🍰</span>
  }

  /* ── 레이어 애니메이션 렌더링 ── */
  const isThumb = variant === 'thumb'
  const bounceClass = isThumb ? 'dessert-float-sm' : 'dessert-bounce'

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

        {/* 바운스 그룹: 메인 + 서브 레이어 */}
        <div className={bounceClass}>
          {layers.main && (
            <img
              src={layers.main}
              alt={name}
              className="dessert-layer"
              draggable={false}
            />
          )}
          {layers.subs.map((sub, i) => (
            <img
              key={i}
              src={sub}
              alt=""
              className="dessert-layer dessert-sub"
              style={{ animationDelay: `${(i + 1) * 0.15}s` }}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* 그림자 – thumb에서는 숨김 */}
      {!isThumb && <div className="dessert-shadow-el" />}
    </div>
  )
}
