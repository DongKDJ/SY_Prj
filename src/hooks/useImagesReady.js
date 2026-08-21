import { useEffect, useState } from 'react'

// 한 번 로드된 이미지는 세션 내 재방문 시 즉시 통과
const loadedSet = new Set()

/**
 * 이미지 전부가 로드된 뒤 true — 화면을 "완성된 상태로" 등장시키는 로딩 게이트용.
 * 실패한 이미지도 완료로 취급해 화면이 영영 안 열리는 일은 없다.
 * srcs는 화면별 상수 배열이어야 한다 (마운트 시 1회만 검사).
 */
export function useImagesReady(srcs) {
  const [ready, setReady] = useState(() => srcs.every(s => loadedSet.has(s)))

  useEffect(() => {
    const pending = srcs.filter(s => !loadedSet.has(s))
    if (pending.length === 0) {
      setReady(true)
      return
    }
    let cancelled = false
    let remaining = pending.length
    pending.forEach(src => {
      const img = new Image()
      let counted = false
      const done = () => {
        if (counted) return
        counted = true
        loadedSet.add(src)
        remaining -= 1
        if (!cancelled && remaining === 0) setReady(true)
      }
      img.onload = done
      img.onerror = done
      img.src = src
      if (img.complete) done() // 캐시 히트는 onload가 안 불릴 수 있다
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ready
}
