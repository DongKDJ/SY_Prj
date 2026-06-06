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
}
