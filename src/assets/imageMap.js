// 카드 이미지
import cardBack from './images/cards/card-back.png'
import cardStage1Sky from './images/cards/card-stage1-sky.png'
import cardStage1Earth from './images/cards/card-stage1-earth.png'
import cardStage2Scale from './images/cards/card-stage2-scale.png'
import cardStage2Spatula from './images/cards/card-stage2-spatula.png'
import cardStage3Gelatin from './images/cards/card-stage3-gelatin.png'
import cardStage3Flour from './images/cards/card-stage3-flour.png'
import cardStage4Sugar from './images/cards/card-stage4-sugar.png'
import cardStage4Choco from './images/cards/card-stage4-choco.png'

// 디저트 이미지 (16종 전체)
import dessert01 from './images/desserts/dessert-01.png'
import dessert02 from './images/desserts/dessert-02.png'
import dessert03 from './images/desserts/dessert-03.png'
import dessert04 from './images/desserts/dessert-04.png'
import dessert05 from './images/desserts/dessert-05.png'
import dessert06 from './images/desserts/dessert-06.png'
import dessert07 from './images/desserts/dessert-07.png'
import dessert08 from './images/desserts/dessert-08.png'
import dessert09 from './images/desserts/dessert-09.png'
import dessert10 from './images/desserts/dessert-10.png'
import dessert11 from './images/desserts/dessert-11.png'
import dessert12 from './images/desserts/dessert-12.png'
import dessert13 from './images/desserts/dessert-13.png'
import dessert14 from './images/desserts/dessert-14.png'
import dessert15 from './images/desserts/dessert-15.png'
import dessert16 from './images/desserts/dessert-16.png'

export { cardBack }

export const cardImages = {
  'card-stage1-sky.png': cardStage1Sky,
  'card-stage1-earth.png': cardStage1Earth,
  'card-stage2-scale.png': cardStage2Scale,
  'card-stage2-spatula.png': cardStage2Spatula,
  'card-stage3-gelatin.png': cardStage3Gelatin,
  'card-stage3-flour.png': cardStage3Flour,
  'card-stage4-sugar.png': cardStage4Sugar,
  'card-stage4-choco.png': cardStage4Choco,
}

export const dessertImages = {
  'dessert-01.png': dessert01,
  'dessert-02.png': dessert02,
  'dessert-03.png': dessert03,
  'dessert-04.png': dessert04,
  'dessert-05.png': dessert05,
  'dessert-06.png': dessert06,
  'dessert-07.png': dessert07,
  'dessert-08.png': dessert08,
  'dessert-09.png': dessert09,
  'dessert-10.png': dessert10,
  'dessert-11.png': dessert11,
  'dessert-12.png': dessert12,
  'dessert-13.png': dessert13,
  'dessert-14.png': dessert14,
  'dessert-15.png': dessert15,
  'dessert-16.png': dessert16,
}

export function getDessertImage(filename) {
  return dessertImages[filename] || null
}

// ── 레이어 분리 디저트 이미지 (동적 글로브 임포트) ──
// src/assets/images/desserts/layers/ 폴더에 이미지를 넣으면 자동 인식
const layerModules = import.meta.glob('./images/desserts/layers/*.png', { eager: true })

function getLayerImage(filename) {
  const key = `./images/desserts/layers/${filename}`
  return layerModules[key]?.default || null
}

/**
 * 디저트 레이어 이미지 조회
 * @param {number} dessertId – 디저트 번호 (1–16)
 * @returns {{ plate, back, mains: string[], subs: string[] } | null}
 *
 * 레이어 순서 (뒤→앞): 접시 > 백 > 메인 > 서브
 * 같은 종류 내에서는 숫자가 높을수록 앞에 렌더링
 *
 * 파일 규칙:
 *   plate_{NN}.png           → 접시 (정적, 선택)
 *   back_{NN}.png            → 백 레이어 (선택)
 *   main_{NN}.png            → 단일 메인 (필수)
 *   main_{NN}_01.png~02.png  → 복수 메인 (선택)
 *   sub_{NN}_01.png~10.png   → 서브 장식 (선택)
 */
export function getDessertLayers(dessertId) {
  const num = String(dessertId).padStart(2, '0')

  // 메인: 단일 또는 복수
  const singleMain = getLayerImage(`main_${num}.png`)
  const mains = []
  if (singleMain) {
    mains.push(singleMain)
  } else {
    for (let i = 1; i <= 4; i++) {
      const m = getLayerImage(`main_${num}_${String(i).padStart(2, '0')}.png`)
      if (m) mains.push(m)
    }
  }
  if (mains.length === 0) return null // main 필수

  const plate = getLayerImage(`plate_${num}.png`)
  const back = getLayerImage(`back_${num}.png`)

  const subs = []
  for (let i = 1; i <= 10; i++) {
    const sub = getLayerImage(`sub_${num}_${String(i).padStart(2, '0')}.png`)
    if (sub) subs.push(sub)
  }

  return { plate, back, mains, subs }
}

export function getCardImage(filename) {
  return cardImages[filename] || null
}
