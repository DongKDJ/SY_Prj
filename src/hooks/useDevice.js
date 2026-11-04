import { useEffect } from 'react'

/**
 * 기기 편의 (2026-11-05 대표 — 전시용 필수 기능)
 *  · useWakeLock    — 사이트가 보이는 동안 화면이 꺼지지 않게(전시 PC 절전·화면 보호기 방지). 지원 안 하면 조용히 넘어간다.
 *  · useAndroidBack — 폰의 시스템 뒤로 가기를 앱 안 '이전으로' 버튼처럼. 화면에 이전 버튼이 없으면(타이틀) 원래대로 사이트를 나간다.
 * 둘 다 기존 흐름에 손대지 않는 덧붙임이다.
 */
export function useWakeLock() {
  useEffect(() => {
    if (!('wakeLock' in navigator)) return
    let lock = null
    const acquire = async () => {
      if (document.visibilityState !== 'visible' || lock) return
      try {
        lock = await navigator.wakeLock.request('screen')
        lock.addEventListener('release', () => { lock = null })
      } catch { /* 배터리 절약 모드 등 — 못 잡으면 그만 */ }
    }
    acquire()
    document.addEventListener('visibilitychange', acquire)
    return () => {
      document.removeEventListener('visibilitychange', acquire)
      lock?.release().catch(() => {})
    }
  }, [])
}

const BACK_SEL = 'button[aria-label="이전으로"]'

export function useAndroidBack() {
  useEffect(() => {
    // 들어오자마자 발판 하나를 쌓아 두고, 뒤로 가기가 그 발판을 걷어 갈 때마다 '이전으로'를 대신 눌러 준다
    const push = () => { try { history.pushState({ sy: 1 }, '') } catch { /* 무시 */ } }
    if (!history.state?.sy) push()
    const onPop = () => {
      const btn = document.querySelector(BACK_SEL)
      if (btn) {
        btn.click()
        push() // 다음 뒤로 가기도 받을 수 있게 발판 복구
      }
      // 이전 버튼이 없는 화면(타이틀)에서는 발판이 걷힌 채로 두어 한 번 더 누르면 사이트를 나간다
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
}
