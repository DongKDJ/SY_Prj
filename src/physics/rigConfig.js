/**
 * 디저트별 리깅 파라미터 설정
 *
 * pivotX/Y  — CSS transform-origin (회전 기준점)
 * stiffness — 스프링 강성 (높을수록 빠르게 복원)
 * damping   — 감쇠 (높을수록 빨리 멈춤)
 * mass      — 질량 (높을수록 느리게 반응)
 * idleAmplitude — idle 상태 흔들림 각도 (deg)
 * idlePeriod    — idle 한 주기 시간 (ms)
 * impulseScale  — 터치 충격 배율
 * phaseOffset   — idle 사이클 오프셋 (ms) — 서브 레이어용
 */

const defaultMain = {
  pivotX: '50%',
  pivotY: '100%',        // 바닥 고정
  stiffness: 40,
  damping: 6,
  mass: 1.2,
  idleAmplitude: 1.8,    // 살짝 흔들림
  idlePeriod: 2400,
  impulseScale: 1.0,
  phaseOffset: 0,
}

const defaultSub = {
  pivotX: '50%',
  pivotY: '85%',         // 약간 위쪽 기준
  stiffness: 65,
  damping: 4.5,
  mass: 0.5,
  idleAmplitude: 2.5,
  idlePeriod: 2000,
  impulseScale: 1.6,
  phaseOffset: 0,
}

// 기본 서브 4개 (phaseOffset으로 각각 다른 타이밍)
function makeDefaultSubs(count = 4) {
  return Array.from({ length: count }, (_, i) => ({
    ...defaultSub,
    phaseOffset: i * 350,
    idlePeriod: 1800 + i * 250,
    stiffness: 55 + i * 12,
    mass: 0.4 + i * 0.15,
  }))
}

const defaultRig = {
  main: defaultMain,
  subs: makeDefaultSubs(),
}

/**
 * 디저트별 커스텀 리깅 (해당 디저트만 오버라이드)
 */
const dessertRigs = {
  7: {
    main: { ...defaultMain, stiffness: 35, idleAmplitude: 2.0, idlePeriod: 2600 },
    subs: [
      // sub7_01: 크림 — 부드럽게 출렁
      { ...defaultSub, pivotX: '45%', pivotY: '70%', stiffness: 30, damping: 3.5, mass: 0.7, idleAmplitude: 3.0, idlePeriod: 2200, impulseScale: 2.0, phaseOffset: 0 },
      // sub7_02: 블루베리 — 통통 튀는
      { ...defaultSub, pivotX: '55%', pivotY: '60%', stiffness: 90, damping: 5, mass: 0.3, idleAmplitude: 2.0, idlePeriod: 1600, impulseScale: 2.2, phaseOffset: 500 },
      // sub7_03: 사과 조각 — 꽂힌 느낌
      { ...defaultSub, pivotX: '35%', pivotY: '80%', stiffness: 50, damping: 4, mass: 0.5, idleAmplitude: 2.5, idlePeriod: 1900, impulseScale: 1.8, phaseOffset: 900 },
    ],
  },
}

/**
 * 디저트 리깅 데이터 조회
 * @param {number} dessertId
 * @param {number} subCount — 실제 서브 레이어 개수
 */
export function getRig(dessertId, subCount = 0) {
  const custom = dessertRigs[dessertId]
  if (custom) {
    return {
      main: custom.main,
      subs: custom.subs.slice(0, subCount),
    }
  }
  return {
    main: defaultRig.main,
    subs: defaultRig.subs.slice(0, subCount),
  }
}
