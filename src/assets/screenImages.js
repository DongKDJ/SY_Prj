// 원화 화면 레이어 (2026-08-21 서연 원화)
// 전부 3840x2160 정렬 투명 PNG — ArtStage 안에 겹치면 좌표가 서로 맞는다.
import titleBg from './images/screens/title-bg.png'
import titleLogo from './images/screens/title-logo.png'
import gold1 from './images/screens/gold-1.png'
import gold2 from './images/screens/gold-2.png'
import gold3 from './images/screens/gold-3.png'
import gold4 from './images/screens/gold-4.png'
import gold5 from './images/screens/gold-5.png'
import openingBg from './images/screens/opening-bg.png'
import openingBubble from './images/screens/opening-bubble.png'
import openingObject from './images/screens/opening-object.png'
import bookmarkBg from './images/screens/bookmark-bg.png'
import grass1 from './images/screens/grass-1.png'
import grass2 from './images/screens/grass-2.png'
import grass3 from './images/screens/grass-3.png'
import grass4 from './images/screens/grass-4.png'
import bookmarkTitle1 from './images/screens/bookmark-title-1.png'
import bookmarkTitle2 from './images/screens/bookmark-title-2.png'
import bookmarkTitle3 from './images/screens/bookmark-title-3.png'
import bookmarkTitle4 from './images/screens/bookmark-title-4.png'
import ingEarth from './images/screens/ing-earth.png'
import ingSky from './images/screens/ing-sky.png'
import ingScale from './images/screens/ing-scale.png'
import ingSpatula from './images/screens/ing-spatula.png'
import ingGelatin from './images/screens/ing-gelatin.png'
import ingFlour from './images/screens/ing-flour.png'
import ingSugar from './images/screens/ing-sugar.png'
import ingChoco from './images/screens/ing-choco.png'

export { titleBg, titleLogo, openingBg, openingBubble, openingObject, bookmarkBg }

// 금장 프레임 (1=좌상 2=상중앙 3=우상 4=좌하 5=우하 — 세 화면 공통 동일 원본)
export const goldFrames = [gold1, gold2, gold3, gold4, gold5]

// 책갈피 페이지 풀·잎 장식 (1=좌상 2=우상 3=좌하 4=우하)
export const grassLayers = [grass1, grass2, grass3, grass4]

// "N번째 책갈피" 배너 — stage.id 로 조회
export const bookmarkTitles = {
  1: bookmarkTitle1,
  2: bookmarkTitle2,
  3: bookmarkTitle3,
  4: bookmarkTitle4,
}

// 책상 위 재료 — 카드 id 로 조회. 원화에서 서로 다른 자리에 그려져 있어 누적해도 겹치지 않는다.
export const ingredientLayers = {
  earth: ingEarth,     // 딸기
  sky: ingSky,         // 사과
  scale: ingScale,     // 계량컵
  spatula: ingSpatula, // 주걱
  gelatin: ingGelatin, // 젤라틴
  flour: ingFlour,     // 밀가루
  sugar: ingSugar,     // 슈가파우더
  choco: ingChoco,     // 초콜릿 칩
}
