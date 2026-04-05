import { useEffect, useRef, useCallback } from 'react'
import { createSpringState, stepSpring, applyImpulse } from './springEngine'
import { getRig } from './rigConfig'

/**
 * 스프링 물리 리깅 훅
 *
 * @param {number} dessertId — 디저트 번호
 * @param {{ main: React.RefObject, subs: React.RefObject[] }} layerRefs
 * @param {{ main: string, subs: string[] }} layers — 레이어 데이터 (개수 판별용)
 * @returns {{ onImpulse: () => void }}
 */
export default function useSpringRig(dessertId, layerRefs, layers) {
  const rafId = useRef(null)
  const lastTime = useRef(null)
  const springs = useRef(null)
  const rig = useRef(null)
  const impulseTimer = useRef(null)

  // 초기화
  useEffect(() => {
    const subCount = layers?.subs?.length ?? 0
    rig.current = getRig(dessertId, subCount)

    springs.current = {
      main: createSpringState(0),
      subs: Array.from({ length: subCount }, () => createSpringState(0)),
    }

    // transform-origin 설정
    if (layerRefs.main?.current) {
      layerRefs.main.current.style.transformOrigin =
        `${rig.current.main.pivotX} ${rig.current.main.pivotY}`
    }
    layerRefs.subs?.forEach((ref, i) => {
      if (ref?.current && rig.current.subs[i]) {
        ref.current.style.transformOrigin =
          `${rig.current.subs[i].pivotX} ${rig.current.subs[i].pivotY}`
      }
    })

    // 애니메이션 시작
    lastTime.current = performance.now()
    startLoop()

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      if (impulseTimer.current) clearTimeout(impulseTimer.current)
    }
  }, [dessertId, layers])

  function startLoop() {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    lastTime.current = performance.now()
    rafId.current = requestAnimationFrame(tick)
  }

  function tick(now) {
    if (!springs.current || !rig.current) return

    const dt = (now - (lastTime.current || now)) / 1000
    lastTime.current = now

    const rigData = rig.current
    const springData = springs.current

    // idle 타겟 업데이트 + 물리 계산: main
    const mainCfg = rigData.main
    springData.main.target =
      mainCfg.idleAmplitude * Math.sin(2 * Math.PI * (now + mainCfg.phaseOffset) / mainCfg.idlePeriod)
    stepSpring(springData.main, mainCfg, dt)

    // DOM 적용: main — skewX로 바닥 고정 + 위쪽만 찰랑
    if (layerRefs.main?.current) {
      const a = springData.main.angle
      const stretch = 1 + Math.abs(a) * 0.003 // 살짝 세로 늘어남
      layerRefs.main.current.style.transform =
        `skewX(${a.toFixed(3)}deg) scaleY(${stretch.toFixed(4)})`
    }

    // subs — skewX + 살짝 translateX로 따라 흔들림
    rigData.subs.forEach((subCfg, i) => {
      const subSpring = springData.subs[i]
      if (!subSpring) return

      subSpring.target =
        subCfg.idleAmplitude * Math.sin(2 * Math.PI * (now + subCfg.phaseOffset) / subCfg.idlePeriod)
      stepSpring(subSpring, subCfg, dt)

      const ref = layerRefs.subs?.[i]
      if (ref?.current) {
        const sa = subSpring.angle
        const drift = sa * 0.3 // 각도에 비례한 수평 이동
        ref.current.style.transform =
          `skewX(${sa.toFixed(3)}deg) translateX(${drift.toFixed(2)}%)`
      }
    })

    rafId.current = requestAnimationFrame(tick)
  }

  // 터치/클릭 임펄스
  const onImpulse = useCallback(() => {
    if (!springs.current || !rig.current) return

    // 디바운스 300ms
    if (impulseTimer.current) return
    impulseTimer.current = setTimeout(() => { impulseTimer.current = null }, 300)

    const dir = Math.random() > 0.5 ? 1 : -1
    const baseVelocity = 180 + Math.random() * 120 // deg/s

    // main
    applyImpulse(springs.current.main, dir * baseVelocity * rig.current.main.impulseScale)

    // subs — 각자 다른 방향/강도
    rig.current.subs.forEach((subCfg, i) => {
      const subDir = Math.random() > 0.4 ? dir : -dir
      applyImpulse(
        springs.current.subs[i],
        subDir * baseVelocity * subCfg.impulseScale * (0.8 + Math.random() * 0.4)
      )
    })
  }, [])

  return { onImpulse }
}
