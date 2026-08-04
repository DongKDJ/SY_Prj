import { useEffect, useRef, useState } from 'react'

/**
 * 전시장 키오스크 모드
 *
 * URL에 `?kiosk=1` 이 붙었을 때만 켜진다. 전시 기기만 그 주소로 띄우면 되고,
 * QR로 들어온 관람객 폰과 심사용 링크는 같은 빌드를 그대로 쓰면서 아무 영향도 받지 않는다.
 * (빌드를 나누지 않는 이유 = 배포·관리 지점을 하나로 유지하기 위해)
 */
export function readKioskFlag() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('kiosk') === '1'
}

const IDLE_MS     = 90_000  // 무조작 90초 → 복귀 안내 시작
const COUNTDOWN_S = 10      // 안내 10초 뒤 처음으로
const CURSOR_MS   = 5_000   // 마우스 5초 정지 → 커서 숨김

const ACTIVITY = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart']

/**
 * @param enabled 키오스크 모드 여부
 * @param armed   유휴 복귀를 걸어둘지 (타이틀 화면에서는 되돌릴 게 없으므로 false)
 * @param onReset 복귀 동작
 * @returns 카운트다운 잔여 초 (진행 중이 아니면 null)
 */
export function useKioskIdle({ enabled, armed, onReset }) {
  const [countdown, setCountdown] = useState(null)

  // ref로 받아두는 이유: onReset이 매 렌더 새 함수여도 유휴 시계가 리셋되지 않게
  const onResetRef = useRef(onReset)
  useEffect(() => { onResetRef.current = onReset }, [onReset])

  useEffect(() => {
    if (!enabled || !armed) return

    let idleTimer
    let tickTimer

    const startCountdown = () => {
      let left = COUNTDOWN_S
      setCountdown(left)
      tickTimer = setInterval(() => {
        left -= 1
        if (left > 0) {
          setCountdown(left)
          return
        }
        clearInterval(tickTimer)
        tickTimer = undefined
        setCountdown(null)
        onResetRef.current()
      }, 1000)
    }

    // 어떤 조작이든 들어오면 카운트다운을 물리고 유휴 시계를 다시 건다
    const bump = () => {
      if (tickTimer) {
        clearInterval(tickTimer)
        tickTimer = undefined
        setCountdown(null)
      }
      clearTimeout(idleTimer)
      idleTimer = setTimeout(startCountdown, IDLE_MS)
    }

    ACTIVITY.forEach(e => window.addEventListener(e, bump, { passive: true }))
    bump()

    return () => {
      ACTIVITY.forEach(e => window.removeEventListener(e, bump))
      clearTimeout(idleTimer)
      clearInterval(tickTimer)
      setCountdown(null) // 화면이 바뀌어 무장 해제될 때 진행 중이던 안내를 걷는다
    }
  }, [enabled, armed])

  return countdown
}

/**
 * 키오스크 입력 잠금 — 스크롤·더블탭 확대·길게눌러 메뉴·이미지 드래그를 막고
 * 마우스가 멈추면 커서를 감춘다. 관람객 폰에는 적용되지 않는다.
 */
export function useKioskLock(enabled) {
  useEffect(() => {
    if (!enabled) return

    const root = document.documentElement
    root.classList.add('kiosk-mode')

    // 확대 차단은 키오스크에서만 — 폰 관람객의 핀치 줌은 접근성이라 건드리지 않는다
    const viewport = document.querySelector('meta[name="viewport"]')
    const prevViewport = viewport?.getAttribute('content')
    viewport?.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    )

    const blockMenu = e => e.preventDefault()
    document.addEventListener('contextmenu', blockMenu)

    let cursorTimer
    const showCursor = () => {
      root.classList.remove('kiosk-hide-cursor')
      clearTimeout(cursorTimer)
      cursorTimer = setTimeout(() => root.classList.add('kiosk-hide-cursor'), CURSOR_MS)
    }
    window.addEventListener('pointermove', showCursor, { passive: true })
    showCursor()

    return () => {
      root.classList.remove('kiosk-mode', 'kiosk-hide-cursor')
      if (prevViewport) viewport?.setAttribute('content', prevViewport)
      document.removeEventListener('contextmenu', blockMenu)
      window.removeEventListener('pointermove', showCursor)
      clearTimeout(cursorTimer)
    }
  }, [enabled])
}
