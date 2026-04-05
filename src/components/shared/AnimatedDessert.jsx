import Lottie from 'lottie-react'
import { getDessertImage, getDessertLayers, getDessertLottie } from '../../assets/imageMap'

/**
 * 디저트 애니메이션 컴포넌트 (우선순위: Lottie > 레이어 CSS > 단일 이미지 CSS)
 *
 * 1순위: Lottie JSON이 있으면 → Lottie 플레이어 (리깅 애니메이션)
 * 2순위: 레이어 이미지가 있으면 → CSS 레이어 애니메이션
 * 3순위: 단일 이미지 → CSS 흔들림 애니메이션
 *
 * Lottie 파일 규칙 (src/assets/animations/desserts/):
 *   dessert_01.json ~ dessert_16.json
 *
 * After Effects 작업 흐름:
 *   1. 레이어 PNG(plate, main, sub1~4)를 AE로 가져오기
 *   2. 각 파트에 Puppet Pin / 트랜스폼 키프레임으로 리깅
 *   3. Bodymovin(LottieFiles) 플러그인으로 JSON 내보내기
 *   4. dessert_NN.json으로 저장하여 위 폴더에 넣기
 */
export default function AnimatedDessert({
  dessertId,
  image,
  name = '',
  variant = 'full',
  className = '',
  imgClassName = 'w-full h-full object-contain',
}) {
  const lottieData = getDessertLottie(dessertId)
  const layers = getDessertLayers(dessertId)
  const fallbackImage = getDessertImage(image)
  const isThumb = variant === 'thumb'
  const bounceClass = isThumb ? 'dessert-float-sm' : 'dessert-bounce'

  /* ── 1순위: Lottie 리깅 애니메이션 ── */
  if (lottieData) {
    return (
      <div className={`dessert-stage ${className}`}>
        <Lottie
          animationData={lottieData}
          loop
          autoplay
          className="w-full h-full"
        />
      </div>
    )
  }

  /* ── 2순위: CSS 레이어 애니메이션 ── */
  if (layers) {
    return (
      <div className={`dessert-stage ${className}`}>
        <div className="dessert-wrap">
          {layers.plate && (
            <img src={layers.plate} alt="" className="dessert-layer" draggable={false} />
          )}
          <div className={bounceClass}>
            {layers.main && (
              <img src={layers.main} alt={name} className="dessert-layer" draggable={false} />
            )}
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
        {!isThumb && <div className="dessert-shadow-el" />}
      </div>
    )
  }

  /* ── 3순위: 단일 이미지 + CSS 애니메이션 ── */
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

  /* ── 이미지 없음: 이모지 ── */
  const emojiSize = isThumb ? 'text-4xl md:text-5xl' : 'text-7xl md:text-8xl'
  return <span className={emojiSize}>🍰</span>
}
