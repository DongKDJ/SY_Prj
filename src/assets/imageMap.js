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

// 디저트 이미지 (있는 것만)
import dessert01 from './images/desserts/dessert-01.png'
import dessert02 from './images/desserts/dessert-02.png'
import dessert03 from './images/desserts/dessert-03.png'
import dessert04 from './images/desserts/dessert-04.png'
import dessert05 from './images/desserts/dessert-05.png'
import dessert06 from './images/desserts/dessert-06.png'
import dessert07 from './images/desserts/dessert-07.png'

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
 * @returns {{ plate: string|null, main: string, subs: string[] } | null}
 *
 * 파일 규칙:
 *   plate_01.png  → 접시 (정적, 선택)
 *   main_01.png   → 디저트 본체 (필수)
 *   sub1_01.png ~ sub4_01.png → 서브 장식 (선택)
 */
export function getDessertLayers(dessertId) {
  const num = String(dessertId).padStart(2, '0')
  const main = getLayerImage(`main_${num}.png`)
  if (!main) return null // main 필수

  const plate = getLayerImage(`plate_${num}.png`)
  // sub 파일명: sub{디저트번호}_{서브순번}.png  (예: sub1_01.png, sub1_02.png)
  const subs = []
  for (let i = 1; i <= 4; i++) {
    const subNum = String(i).padStart(2, '0')
    const sub = getLayerImage(`sub${dessertId}_${subNum}.png`)
    if (sub) subs.push(sub)
  }
  return { plate, main, subs }
}

export function getCardImage(filename) {
  return cardImages[filename] || null
}
