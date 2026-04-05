/**
 * 경량 스프링 물리 엔진
 * Semi-implicit Euler 적분으로 감쇠 회전 스프링 시뮬레이션
 */

export function createSpringState(initialAngle = 0) {
  return { angle: initialAngle, velocity: 0, target: 0 }
}

/**
 * 스프링 상태를 1프레임 전진
 * @param {object} state - { angle, velocity, target }
 * @param {object} params - { stiffness, damping, mass }
 * @param {number} dt - 초 단위 경과 시간 (0.05 이하로 클램프 권장)
 */
export function stepSpring(state, params, dt) {
  const clampedDt = Math.min(dt, 0.05)
  const springForce = -params.stiffness * (state.angle - state.target)
  const dampingForce = -params.damping * state.velocity
  const acceleration = (springForce + dampingForce) / params.mass
  state.velocity += acceleration * clampedDt
  state.angle += state.velocity * clampedDt
  return state
}

/**
 * 충격량(임펄스) 적용 — 탭/클릭 시 호출
 * @param {object} state
 * @param {number} impulseVelocity - 각속도 (deg/s)
 */
export function applyImpulse(state, impulseVelocity) {
  state.velocity += impulseVelocity
}

/**
 * 스프링이 정지 상태에 가까운지 확인
 */
export function isSettled(state, threshold = 0.08) {
  return (
    Math.abs(state.angle - state.target) < threshold &&
    Math.abs(state.velocity) < threshold
  )
}
