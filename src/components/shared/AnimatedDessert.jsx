import { getDessertImage, getDessertLayers } from '../../assets/imageMap'
import { dessertLayerConfig } from '../../data/dessertLayerConfig'
import { useImagesReady } from '../../hooks/useImagesReady'

/* "x% y%" 그대로, 한 값이면 세로값으로 */
const toOrigin = (v) => (v ? (v.includes(' ') ? v : `center ${v}`) : undefined)

/* 움직임 사슬을 바깥(받치는 대상)부터 안쪽(자기)까지 겹겹이 감싼다.
   고리마다 같은 클래스·축·딜레이를 쓰므로 얹힌 파츠는 받치는 파츠와 프레임 단위로 같이 움직인다. */
function Moving({ chain, children }) {
  return chain.reduceRight(
    (inner, link) => (
      <div
        className={`dessert-part ${link.cls}`}
        style={{
          transformOrigin: link.origin,
          animationDelay: link.delay ? `${link.delay}s` : undefined,
        }}
      >
        {inner}
      </div>
    ),
    children,
  )
}

/**
 * 디저트 애니메이션 컴포넌트 — 모든 파츠는 뿌리(닿는 면)가 고정된다.
 *
 * 메인은 제 바닥 접점(mainPivots)을 축으로, 서브는 제 접점(subPivots)을 축으로 움직이고,
 * 얹힌 대상(subOn)의 움직임을 그대로 물려받는다 — 케이크 위 딸기는 케이크와, 크림에 꽂힌 웨하스는 크림과.
 * 접시는 정적, 접시에 놓인 서브는 접시 기준.
 *
 * 레이어 순서 (뒤→앞): behind 서브 > 접시 > 백 > under 서브 > 메인 > 서브 > detach 서브
 * 같은 종류 내에서는 숫자가 높을수록 앞에 렌더링
 */
export default function AnimatedDessert({
  dessertId,
  image,
  name = '',
  variant = 'full',
  className = '',
}) {
  const layers = getDessertLayers(dessertId)
  const fallbackImage = getDessertImage(image)
  const config = dessertLayerConfig[dessertId]
  const isThumb = variant === 'thumb'
  const bounceType = config?.bounce || 'bounce'
  // 도감 썸네일은 한 화면에 16종이 동시에 움직이므로 메인을 가장 얌전한 바운스로
  const bounceClass = isThumb ? 'dessert-soft-sm' : `dessert-${bounceType}`
  /* 도감 그리드(썸네일 16종 × 레이어 다수)는 lazy가 이득이지만,
     결과 화면 히어로는 리빌 순간에 레이어가 늦게 뜨면 연출이 무너지므로 eager */
  const loadingMode = isThumb ? 'lazy' : 'eager'

  /* 레이어가 낱장으로 뜨면 접시 없이 장식만 떠 있는 순간이 생긴다 — 다 받은 뒤 한 번에 페이드인 */
  const { ready } = useImagesReady(
    layers
      ? [layers.plate, layers.back, ...layers.mains, ...layers.subs].filter(Boolean)
      : [fallbackImage].filter(Boolean),
  )
  const revealStyle = { opacity: ready ? 1 : 0, transition: 'opacity 0.45s ease-out' }

  const layerImg = (src, alt = '') => (
    <img src={src} alt={alt} className="dessert-layer" loading={loadingMode} draggable={false} />
  )

  /* ── 레이어 없음: 단일 이미지에도 바운스 적용 ── */
  if (!layers) {
    if (fallbackImage) {
      return (
        <div className={`dessert-stage ${className}`}>
          <div className="dessert-wrap" style={revealStyle}>
            <div className={bounceClass}>{layerImg(fallbackImage, name)}</div>
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

  /* ── 움직임 사슬 ── */
  const mainPivots = config?.mainPivots || []
  const mainLink = (i) => ({
    cls: bounceClass,
    origin: toOrigin(mainPivots[i] || mainPivots[0]) || 'center bottom',
  })
  const subLink = (i) => {
    const subDelay = config?.subDelays?.[i]
    return {
      cls: `dessert-sub dessert-sub-${config?.subs?.[i] || 'jelly'}`,
      origin: toOrigin(config?.subPivots?.[i]),
      delay: subDelay !== undefined && subDelay !== null ? subDelay : (i + 1) * 0.15,
    }
  }
  // 얹힌 대상 — 지정이 없으면 detach·behind는 접시, 나머지는 첫 메인
  const subOn = (i) =>
    config?.subOn?.[i]
      || (config?.subDetach?.[i] || config?.subBehind?.[i] ? 'plate' : 'main')
  const subChain = (i, seen = []) => {
    const on = subOn(i)
    let base = []
    if (on === 'main') base = [mainLink(0)]
    else if (/^main\d+$/.test(on)) base = [mainLink(parseInt(on.slice(4), 10) - 1)]
    else if (/^sub\d+$/.test(on)) {
      const j = parseInt(on.slice(3), 10) - 1
      if (j !== i && !seen.includes(j)) base = subChain(j, [...seen, i])
    }
    // 'plate' · 'air' — 디저트 움직임을 물려받지 않는다
    return [...base, subLink(i)]
  }

  /* 서브가 들어갈 z 자리 — 원화 레이어 순서를 그대로 따른다 */
  const subSlot = (i) =>
    config?.subBehind?.[i] ? 'behind'
      : config?.subUnderMain?.[i] ? 'under'
        : config?.subDetach?.[i] ? 'detach' : 'group'
  const subsIn = (slot) =>
    layers.subs.map((sub, i) =>
      subSlot(i) === slot && (
        <Moving key={`sub-${slot}-${i}`} chain={subChain(i)}>{layerImg(sub)}</Moving>
      ),
    )

  /* ── 레이어 애니메이션 렌더링 ── */
  return (
    <div className={`dessert-stage ${className}`}>
      <div className="dessert-wrap" style={revealStyle}>
        {subsIn('behind')}

        {/* 접시 – 항상 정적 */}
        {layers.plate && layerImg(layers.plate)}

        {/* 백 – 첫 메인 위에서 제 접점 축으로 미세 바운스 */}
        {layers.back && (
          <Moving chain={[mainLink(0), { cls: 'dessert-back', origin: toOrigin(config?.backPivot) }]}>
            {layerImg(layers.back)}
          </Moving>
        )}

        {subsIn('under')}

        {/* 메인 (복수 가능, 숫자 높을수록 앞) — 각자 제 바닥 접점 축 */}
        {layers.mains.map((main, i) => (
          <Moving key={`main-${i}`} chain={[mainLink(i)]}>
            {layerImg(main, i === 0 ? name : '')}
          </Moving>
        ))}

        {subsIn('group')}
        {subsIn('detach')}
      </div>

      {/* 그림자 */}
      {!isThumb && <div className="dessert-shadow-el" />}
    </div>
  )
}
