/**
 * 디저트별 서브 레이어 애니메이션 설정
 *
 * 타입: 'jelly' | 'sway' | 'pulse' | 'hover' | 'breathe'
 *   jelly   – scaleY + scaleX + skewX 탱글 (기본값)
 *   sway    – skewX 바닥고정 찰랑
 *   pulse   – opacity 반짝
 *   hover   – translateY 미세 부유
 *   breathe – scaleY만 부풀기
 *
 * pivotY: 바운스 그룹의 transform-origin Y값 (기본 'bottom')
 *         디저트 바닥이 접시에 닿는 위치를 %로 지정
 *
 * 배열 순서 = sub_XX_01, sub_XX_02, ...
 * 설정이 없는 디저트는 전부 jelly 기본 적용
 */
export const dessertLayerConfig = {
  1: {
    // 별밤 초코애플 푸딩
    // sub1: 사과슬라이스, sub2: 별크림, sub3: 블루베리, sub4: 민트잎, sub5: 사과슬라이스
    pivotY: 'bottom', // 바닥 고정, 위쪽만 바운스
    subs: ['sway-sm2', 'sync-sm', 'sync-fast', 'sway-xl', 'sway-xl'],
    subPivots: ['30% 30%', '33%', null, '42% 62%', '35% 72%'], // sub_02: 푸딩 윗면, sub_04: 민트잎 밑동, sub_05: 사과 밑동
    subDelays: [0.7, 0.1, 0.1, 1.2, 0.4],
    subDetach: [true, false, false, true, true], // true = 바운스 그룹 밖에서 독립 움직임
    subBehind: [true, false, false, false, false], // true = 접시보다 뒤에 렌더링
  },
  2: {
    // 구름사과 무스케이크
    // sub1: 작은 구름 2개 (오른쪽 위)
    bounce: 'wobble',
    pivotY: '85%',
    subs: ['drift-scale'],
    subPivots: [null],
    subDelays: [0.3],
    subDetach: [true],   // 구름은 독립 부유
    subBehind: [false],
  },
  3: {
    // 반짝이는 사과쿠키 — main 2장(사과 모양 쿠키 + 사각 스캘럽 쿠키), 접시·서브 없음
    // 바삭한 구움과자라 스쿼시가 들어가면 젤리처럼 보인다. 변형 대신 부유로 처리.
    bounce: 'float',
    pivotY: 'bottom',
  },
  4: {
    // 소복한 사과 타르트
    // sub1: 작은 흰 꽃, sub2: 잎사귀
    bounce: 'soft',      // 구운 타르트 — 형태 유지
    pivotY: 'bottom',
    subs: ['sway-sm2', 'sway-lg'],
    subPivots: ['29% 44%', '42% 31%'],
    subDelays: [0.2, 0.5],
    subDetach: [false, false],
    subBehind: [false, false],
  },
  5: {
    // 눈덩이 초코 사과 마쉬멜로우 — main 2개(글레이즈 덮인 사과 + 작은 사과)
    // sub1: 노란 반짝임, sub2: 작은 반짝임, sub3: 눈송이 무리
    bounce: 'soft',      // 마쉬멜로우 — 부드럽게 부풀기
    pivotY: 'bottom',
    subs: ['pulse', 'pulse', 'drift'],
    subPivots: ['26% 30%', '35% 32%', null],
    subDelays: [0.2, 0.9, 0.5],
    subDetach: [true, true, true],    // 반짝임·눈송이는 디저트 바운스와 무관하게
    subBehind: [false, false, false],
  },
  6: {
    // 사과 바람 판나코타 — main 2조각(하트형)
    // sub1: 씨앗, sub2: 잎, sub3: 잎, sub4: 씨앗
    bounce: 'wobble',    // 판나코타 = 젤라틴 질감
    pivotY: 'bottom',
    subs: ['sway-sm2', 'sway-lg', 'sway-lg', 'sway-sm2'],
    subPivots: ['34% 45%', '38% 42%', '69% 36%', '66% 37%'],
    subDelays: [0.15, 0.35, 0.2, 0.45],
    subDetach: [false, false, false, false],
    subBehind: [false, false, false, false],
  },
  7: {
    // 사과 초코 격자 파이
    // sub1: 크림 얹은 사과 가니시
    bounce: 'soft',      // 구운 파이 — 격자가 흔들리면 안 된다
    pivotY: 'bottom',
    subs: ['breathe'],
    subPivots: ['62% 49%'],
    subDelays: [0.25],
    subDetach: [false],
    subBehind: [false],
  },
  8: {
    // 따끈한 사과 슈가 팬케이크
    // sub1: 부채꼴 사과슬라이스(스택 위), sub2: 사과(스택 위), sub3: 크림 얹은 슬라이스(중단),
    // sub4: 사과+반쪽(테이블), sub5: 작은 사과(테이블), sub6: 민트잎(중단), sub7: 블루베리(테이블)
    // 4·5·7은 팬케이크가 아니라 테이블에 놓인 것이라 바운스 그룹 밖으로 뺀다.
    bounce: 'bounce',
    pivotY: 'bottom',
    subs: ['sway-sm2', 'sync-sm', 'sync-fast', 'sway-sm2', 'sway-sm2', 'sway-lg', 'sway-sm2'],
    subPivots: ['40% 38%', '58% 41%', '44% 50%', '27% 80%', '45% 83%', '60% 47%', '76% 75%'],
    subDelays: [0.1, 0.3, 0.2, 0.8, 1.0, 0.4, 0.6],
    subDetach: [false, false, false, true, true, false, true],
    subBehind: [false, false, false, false, false, false, false],
  },
  9: {
    // 고요한 딸기 초코 파르페 — 접시 없음, main = 유리잔
    // sub1: 생크림, sub2: 별과자, sub3: 트러플, sub4: 웨하스 스틱,
    // sub5: 고양이 얼굴 마카롱, sub6: 작은 알갱이, sub7: 딸기
    // 유리잔은 스쿼시하면 안 되므로 변형이 가장 적은 float.
    bounce: 'float',
    pivotY: 'bottom',
    subs: ['breathe-lg', 'sway-lg', 'sway-sm2', 'sway-lg', 'hover', 'pulse', 'sway-sm2'],
    subPivots: ['50% 36%', '58% 24%', '60% 31%', '32% 34%', null, null, '54% 36%'],
    subDelays: [0.1, 0.5, 0.3, 0.7, 0.2, 0.9, 0.4],
    subDetach: [false, false, false, false, false, false, false],
    subBehind: [false, false, false, false, false, false, false],
  },
  10: {
    // 새벽녘 딸기 젤리 롤 — back: 웨하스 스틱, main: 롤케이크
    // sub1: 과일 슬라이스, sub2: 딸기, sub3: 잎, sub4: 블루베리(테이블)
    bounce: 'bounce',
    pivotY: 'bottom',
    subs: ['sync-sm', 'sway-sm2', 'sway-lg', 'sway-sm2'],
    subPivots: ['41% 37%', '53% 34%', '60% 39%', '75% 87%'],
    subDelays: [0.15, 0.3, 0.45, 0.9],
    subDetach: [false, false, false, true],
    subBehind: [false, false, false, false],
  },
  11: {
    // 딸기 퐁당 오 쇼콜라
    // sub1: 크림 소스, sub2: 잎, sub3: 딸기+반쪽(접시), sub4: 블루베리(접시)
    bounce: 'soft',      // 겉은 구워진 케이크 — 흐르는 건 속
    pivotY: 'bottom',
    subs: ['breathe', 'sway-lg', 'sway-sm2', 'sway-sm2'],
    subPivots: ['35% 57%', '31% 25%', '56% 47%', '27% 73%'],
    subDelays: [0.1, 0.4, 0.6, 0.9],
    subDetach: [false, false, true, true],
    subBehind: [false, false, false, false],
  },
  12: {
    // 설원의 딸기 크럼블
    // sub1: 아이스크림 스쿱, sub2: 딸기, sub3: 잎, sub4: 캐러멜 조각(접시)
    bounce: 'soft',      // 크럼블 = 바삭한 구움
    pivotY: 'bottom',
    subs: ['breathe', 'sway-sm2', 'sway-lg', 'sway-sm2'],
    subPivots: ['49% 62%', '49% 33%', '42% 37%', '75% 80%'],
    subDelays: [0.2, 0.35, 0.5, 0.85],
    subDetach: [true, false, false, true],   // 스쿱은 크럼블과 별개
    subBehind: [false, false, false, false],
  },
  13: {
    // 딸기 초코 젤리 케이크
    // sub1: 크림 얹은 딸기, sub2: 잎, sub3: 딸기 두 알(접시 앞)
    bounce: 'wobble',    // 젤리 층 — 말랑
    pivotY: 'bottom',
    subs: ['sway-sm2', 'sway-lg', 'sway-sm2'],
    subPivots: ['56% 46%', '62% 40%', '58% 86%'],
    subDelays: [0.2, 0.45, 0.8],
    subDetach: [false, false, true],
    subBehind: [false, false, false],
  },
  14: {
    // 딸기 젤리 와플 — main 2장(젤리 바닥 + 와플)
    // sub1: 크림 스쿱, sub2: 딸기 슬라이스, sub3: 딸기, sub4: 잎, sub5: 잎 두 장
    bounce: 'wobble',    // 전체가 젤리 재질
    pivotY: 'bottom',
    subs: ['breathe', 'sway-sm2', 'sway-sm2', 'sway-lg', 'sway-lg'],
    subPivots: ['48% 52%', '61% 57%', '51% 57%', '43% 23%', '54% 62%'],
    subDelays: [0.15, 0.3, 0.45, 0.6, 0.75],
    subDetach: [false, false, false, false, false],
    subBehind: [false, false, false, false, false],
  },
  15: {
    // 스트로베리 팽 오 쇼콜라
    // sub1: 잎, sub2: 딸기, sub3: 블루베리(접시)
    bounce: 'soft',      // 결이 살아있는 페이스트리 — 변형 최소
    pivotY: 'bottom',
    subs: ['sway-lg', 'sway-sm2', 'sway-sm2'],
    subPivots: ['50% 46%', '50% 39%', '64% 79%'],
    subDelays: [0.25, 0.4, 0.8],
    subDetach: [false, false, true],
    subBehind: [false, false, false],
  },
  16: {
    // 포근한 딸기우유 케이크
    // sub1: 크림 얹은 딸기, sub2: 블루베리(접시)
    bounce: 'soft',
    pivotY: 'bottom',
    subs: ['sway-sm2', 'sway-sm2'],
    subPivots: ['58% 52%', '66% 80%'],
    subDelays: [0.25, 0.7],
    subDetach: [false, true],
    subBehind: [false, false],
  },
}
