// 여우씨 레이어 이미지 — Character.jsx 렌더와 화면 로딩 게이트가 함께 쓴다.
// images/character/ 에 파일이 있으면 자동 인식, 없으면 null (body는 필수).
const foxLayerModules = import.meta.glob('./images/character/fox-*.png', { eager: true })

function getFoxLayer(filename) {
  return foxLayerModules[`./images/character/${filename}`]?.default || null
}

export const bodySource = getFoxLayer('fox-body.png')
export const blinkSources = [
  getFoxLayer('fox-blink-01.png'),
  getFoxLayer('fox-blink-02.png'),
  getFoxLayer('fox-blink-03.png'),
  getFoxLayer('fox-blink-04.png'),
]
export const handSource = getFoxLayer('fox-hand.png')

export const foxLayerSources = [bodySource, ...blinkSources, handSource].filter(Boolean)
