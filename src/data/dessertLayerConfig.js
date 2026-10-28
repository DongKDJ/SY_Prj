/**
 * 디저트별 레이어 애니메이션 설정 — 원칙: 모든 파츠는 뿌리(닿는 면)가 고정된다.
 *
 * bounce: 메인 움직임 'bounce' | 'soft' | 'wobble' | 'crisp' (전부 바닥 접점 축 scale — 떠오르는 translate 없음)
 * mainPivots: 메인 레이어별 바닥 접점 'x% y%' = 바운스 축. 원화에서 그 메인이 접시(바닥)에 닿는 자리.
 *             여러 메인이 한 덩어리면 같은 값(14 와플), 따로 놓인 것이면 각자(3·5·6).
 * backPivot: 백 레이어 접점 (백은 첫 메인을 따른다)
 *
 * subs: 서브별 움직임 타입 (index.css .dessert-sub-*)
 * subPivots: 서브별 접점(뿌리) — 접시·케이크 윗면·크림에 닿거나 꽂힌 자리. 공중 장식은 제 중심.
 * subOn: 서브가 얹힌 대상 — 'plate'(접시·테이블, 디저트와 따로) | 'main' | 'main2'(두 번째 메인) |
 *        'sub1'~(그 서브 위) | 'air'(공중 장식). 얹힌 대상의 움직임을 그대로 물려받고 그 위에 제 움직임을 더한다.
 * subDelays: 서브별 딜레이 초
 * subBehind / subUnderMain / subDetach: z 순서만 정한다 — behind(접시 뒤) > under(메인 뒤) > 메인 > (기본) > detach(맨 앞)
 *
 * 배열 순서 = sub_XX_01, sub_XX_02, ...
 */
export const dessertLayerConfig = {
  1: {
    // 별밤 초코애플 푸딩
    // sub1: 사과슬라이스, sub2: 별크림, sub3: 블루베리, sub4: 민트잎, sub5: 사과슬라이스
    mainPivots: ['51% 73%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['sway-sm2', 'sync-sm', 'sync-fast', 'sway-xl', 'sway-xl'],
    subPivots: ['40% 29%', '38% 39%', '58% 37%', '43% 74%', '37% 74%'], // 서브별 접점(뿌리)
    subDelays: [0.7, 0.1, 0.1, 1.2, 0.4],
    subOn: ['sub2', 'main', 'main', 'plate', 'plate'],
    subDetach: [true, false, false, true, true],
    subBehind: [true, false, false, false, false], // sub1은 접시보다 뒤에 그려지지만 크림(sub2)에 꽂혀 함께 움직인다
  },
  2: {
    // 구름사과 무스케이크
    // sub1: 작은 구름 2개 (오른쪽 위)
    bounce: 'wobble',
    mainPivots: ['49% 70%'], // 메인별 바닥 접점 = 바운스 축
    backPivot: '39% 58%',
    subs: ['drift-scale'],
    subPivots: ['76% 40%'], // 서브별 접점(뿌리)
    subDelays: [0.3],
    subOn: ['air'],
    subDetach: [true],   // 구름은 공중에 떠 있다
    subBehind: [false],
  },
  3: {
    // 반짝이는 사과쿠키 — main 2장(사과 모양 쿠키 + 사각 스캘럽 쿠키), 접시·서브 없음
    // 바삭한 구움과자라 스쿼시가 들어가면 젤리처럼 보인다 — 바닥은 붙인 채 숨 쉬듯 아주 미세하게.
    bounce: 'crisp',
    mainPivots: ['69% 86%', '35% 74%'], // 메인별 바닥 접점 = 바운스 축
  },
  4: {
    // 소복한 사과 타르트
    // sub1: 작은 흰 꽃, sub2: 잎사귀
    bounce: 'soft',      // 구운 타르트 — 형태 유지
    mainPivots: ['52% 86%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['sway-sm2', 'sway-lg'],
    subPivots: ['28% 44%', '40% 31%'], // 서브별 접점(뿌리)
    subDelays: [0.2, 0.5],
    subOn: ['main', 'main'],
    subDetach: [false, false],
    subBehind: [false, false],
  },
  5: {
    // 눈덩이 초코 사과 마쉬멜로우 — main 2개(글레이즈 덮인 사과 + 작은 사과)
    // sub1: 노란 반짝임, sub2: 작은 반짝임, sub3: 눈송이 무리
    bounce: 'soft',      // 마쉬멜로우 — 부드럽게 부풀기
    mainPivots: ['46% 66%', '66% 79%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['twinkle', 'twinkle', 'drift'],
    subPivots: ['26% 30%', '35% 32%', null], // 서브별 접점(뿌리)
    subDelays: [0.2, 0.9, 0.5],
    subOn: ['air', 'air', 'air'],
    subDetach: [true, true, true],    // 반짝임·눈송이는 공중 장식
    subBehind: [false, false, false],
  },
  6: {
    // 사과 바람 판나코타 — main 2조각(하트형)
    // sub1: 씨앗, sub2: 잎, sub3: 잎, sub4: 씨앗
    bounce: 'wobble',    // 판나코타 = 젤라틴 질감
    mainPivots: ['66% 63%', '34% 72%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['sway-sm2', 'sway-lg', 'sway-lg', 'sway-sm2'],
    subPivots: ['32% 44%', '36% 42%', '68% 36%', '65% 37%'], // 서브별 접점(뿌리)
    subDelays: [0.15, 0.35, 0.2, 0.45],
    subOn: ['main2', 'main2', 'main', 'main'],
    subDetach: [false, false, false, false],
    subBehind: [false, false, false, false],
  },
  7: {
    // 사과 초코 격자 파이
    // sub1: 크림 얹은 사과 가니시
    bounce: 'soft',      // 구운 파이 — 격자가 흔들리면 안 된다
    mainPivots: ['49% 77%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['breathe'],
    subPivots: ['62% 48%'], // 서브별 접점(뿌리)
    subDelays: [0.25],
    subOn: ['main'],
    subDetach: [false],
    subBehind: [false],
  },
  8: {
    // 따끈한 사과 슈가 팬케이크
    // sub1: 사과(스택 위), sub2: 부채꼴 사과슬라이스(스택 위, 사과 앞), sub3: 크림 얹은 슬라이스(중단),
    // sub4: 사과+반쪽(테이블), sub5: 작은 사과(테이블), sub6: 민트잎(중단), sub7: 블루베리(테이블)
    // 4·5·7은 팬케이크가 아니라 테이블에 놓인 것이라 접시(plate) 기준.
    bounce: 'bounce',
    mainPivots: ['49% 80%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['sync-sm', 'sway-sm2', 'sync-fast', 'sway-sm2', 'sway-sm2', 'sway-lg', 'sway-sm2'],
    subPivots: ['58% 41%', '42% 37%', '50% 50%', '28% 79%', '44% 83%', '59% 47%', '73% 75%'], // 서브별 접점(뿌리)
    subDelays: [0.3, 0.1, 0.2, 0.8, 1.0, 0.4, 0.6],
    subOn: ['main', 'main', 'main', 'plate', 'plate', 'main', 'plate'],
    subDetach: [false, false, false, true, true, false, true],
    subBehind: [false, false, false, false, false, false, false],
  },
  9: {
    // 고요한 딸기 초코 파르페 — 접시 없음, main = 유리잔
    // sub1: 생크림, sub2: 트러플, sub3: 별과자, sub4: 웨하스 스틱(크림에 꽂힌 지점 축),
    // sub5: 블루베리 2알(곰 뒤), sub6: 곰 얼굴 아이스크림(크림 위에 앉아 있으므로 떠오르지 않고 부풀기), sub7: 딸기
    // 유리잔은 스쿼시하면 안 되므로 변형이 가장 적은 crisp (잔 받침은 바닥에 붙어 있다). 움직임은 위 토핑들이.
    bounce: 'crisp',
    mainPivots: ['50% 97%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['breathe-lg', 'sway-sm2', 'sway-lg', 'sway-lg', 'sway-sm2', 'breathe', 'sway-sm2'],
    subPivots: ['52% 36%', '59% 30%', '60% 24%', '42% 33%', '43% 34%', '44% 33%', '53% 36%'], // 서브별 접점(뿌리)
    subDelays: [0.1, 0.3, 0.5, 0.7, 0.9, 0.2, 0.4],
    subOn: ['main', 'sub1', 'sub1', 'sub1', 'sub1', 'sub1', 'sub1'],
    subDetach: [false, false, false, false, false, false, false],
    subBehind: [false, false, false, false, false, false, false],
  },
  10: {
    // 새벽녘 딸기 젤리 롤 — main: 롤케이크
    // sub1: 과일 슬라이스, sub2: 딸기, sub3: 잎, sub4: 블루베리(테이블),
    // sub5: 웨하스 스틱 — 원화에서 롤 앞에 꽂혀 있어 백이 아닌 서브, 롤에 꽂힌 지점을 축으로 찰랑
    bounce: 'bounce',
    mainPivots: ['50% 85%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['sync-sm', 'sway-sm2', 'sway-lg', 'sway-sm2', 'sway-sm2'],
    subPivots: ['47% 37%', '52% 34%', '59% 38%', '72% 87%', '32% 49%'], // 서브별 접점(뿌리)
    subDelays: [0.15, 0.3, 0.45, 0.9, 0],
    subOn: ['main', 'main', 'main', 'plate', 'main'],
    subDetach: [false, false, false, true, false],
    subBehind: [false, false, false, false, false],
  },
  11: {
    // 딸기 퐁당 오 쇼콜라
    // sub1: 아이스크림 스쿱, sub2: 잎, sub3: 딸기+반쪽(케이크 윗면 — 케이크와 함께 움직임), sub4: 블루베리(접시)
    // 원화 레이어 순서(2026-08-25 수정본): 접시 > 스쿱 > 잎 > 케이크 > 딸기 > 블루베리
    bounce: 'soft',      // 겉은 구워진 케이크 — 흐르는 건 속
    mainPivots: ['54% 79%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['breathe', 'sway-lg', 'sway-sm2', 'sway-sm2'],
    subPivots: ['32% 56%', '30% 24%', '62% 47%', '26% 72%'], // 서브별 접점(뿌리)
    subDelays: [0.1, 0.4, 0.6, 0.9],
    subOn: ['main', 'sub1', 'main', 'plate'],
    subDetach: [false, false, false, true],
    subBehind: [false, false, false, false],
    subUnderMain: [true, true, false, false], // 스쿱·잎은 케이크 뒤
  },
  12: {
    // 설원의 딸기 크럼블
    // 원화 레이어 순서(2026-08-25 수정본): 접시 > 크럼블 > 부스러기 > 스쿱 > 딸기 > 잎
    // — 서브 번호를 그 순서로 다시 매겼다 (구 sub4 부스러기가 sub1로)
    // sub1: 부스러기 조각(접시), sub2: 아이스크림 스쿱, sub3: 딸기, sub4: 잎
    // 딸기·잎은 스쿱 위에 얹힌 것 — 스쿱이 detach라 이 둘도 detach여야 스쿱보다 앞에 그려진다
    // (detach 서브는 바운스 그룹 뒤에 렌더되므로, 그룹 안에 두면 번호와 상관없이 스쿱에 덮인다. 2026-08-26 실측)
    bounce: 'soft',      // 크럼블 = 바삭한 구움
    mainPivots: ['49% 86%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['sway-sm2', 'breathe', 'sway-sm2', 'sway-lg'],
    subPivots: ['71% 79%', '43% 61%', '49% 32%', '45% 36%'], // 서브별 접점(뿌리)
    subDelays: [0.85, 0.2, 0.35, 0.5],
    subOn: ['plate', 'main', 'sub2', 'sub2'],
    subDetach: [true, true, true, true],     // z 순서용 — 스쿱은 크럼블 위에 얹혀 크럼블과 함께, 딸기·잎은 스쿱을 따른다
    subBehind: [false, false, false, false],
  },
  13: {
    // 딸기 초코 젤리 케이크
    // sub1: 크림 얹은 딸기, sub2: 잎, sub3: 딸기 두 알(접시 앞)
    bounce: 'wobble',    // 젤리 층 — 말랑
    mainPivots: ['47% 71%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['sway-sm2', 'sway-lg', 'sway-sm2'],
    subPivots: ['56% 46%', '61% 39%', '55% 85%'], // 서브별 접점(뿌리)
    subDelays: [0.2, 0.45, 0.8],
    subOn: ['main', 'sub1', 'plate'],
    subDetach: [false, false, true],
    subBehind: [false, false, false],
  },
  14: {
    // 딸기 젤리 와플 — main 2장(젤리 바닥 + 와플)
    // sub1: 크림 스쿱, sub2: 딸기 슬라이스, sub3: 딸기, sub4: 잎, sub5: 잎 두 장
    bounce: 'wobble',    // 전체가 젤리 재질
    mainPivots: ['50% 79%', '50% 79%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['breathe', 'sway-sm2', 'sway-sm2', 'sway-lg', 'sway-lg'],
    subPivots: ['46% 52%', '58% 57%', '49% 57%', '42% 22%', '49% 62%'], // 서브별 접점(뿌리)
    subDelays: [0.15, 0.3, 0.45, 0.6, 0.75],
    subOn: ['main', 'main', 'main', 'sub1', 'main'],
    subDetach: [false, false, false, false, false],
    subBehind: [false, false, false, false, false],
  },
  15: {
    // 스트로베리 팽 오 쇼콜라
    // sub1: 잎, sub2: 딸기, sub3: 블루베리(접시)
    bounce: 'soft',      // 결이 살아있는 페이스트리 — 변형 최소
    mainPivots: ['49% 76%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['sway-lg', 'sway-sm2', 'sway-sm2'],
    subPivots: ['52% 46%', '50% 38%', '61% 79%'], // 서브별 접점(뿌리)
    subDelays: [0.25, 0.4, 0.8],
    subOn: ['main', 'main', 'plate'],
    subDetach: [false, false, true],
    subBehind: [false, false, false],
  },
  16: {
    // 포근한 딸기우유 케이크
    // sub1: 크림 얹은 딸기, sub2: 블루베리(접시)
    bounce: 'soft',
    mainPivots: ['50% 80%'], // 메인별 바닥 접점 = 바운스 축
    subs: ['sway-sm2', 'sway-sm2'],
    subPivots: ['58% 51%', '60% 80%'], // 서브별 접점(뿌리)
    subDelays: [0.25, 0.7],
    subOn: ['main', 'plate'],
    subDetach: [false, true],
    subBehind: [false, false],
  },
}
