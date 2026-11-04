/** 손가락(터치) 기기인가 — 안내 글의 '터치/클릭' 낱말을 고른다 (2026-11-05 대표: PC에서는 '클릭'으로). */
export const isTouch = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0)

/** '터치' | '클릭' */
export const tapWord = () => (isTouch() ? '터치' : '클릭')
