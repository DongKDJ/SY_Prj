import { useCallback, useEffect, useState } from 'react'

/**
 * 카메라 스트림 — 사진 찍기 화면 전용.
 *
 * facingMode는 `ideal`로만 요청한다: 폰·태블릿은 요청한 쪽(기본 정면 = 거울)이 잡히고,
 * 방향 정보가 없는 아이맥·윈도우 웹캠은 그 하나로 조용히 떨어진다(`exact`면 실패).
 * 데스크톱 웹캠은 track.getSettings().facingMode를 비워 두는 일이 많아 비어 있으면 정면으로 본다.
 *
 * 반환 status: 'starting' | 'live' | 'error'
 * 반환 error : 'unsupported'(http 등 getUserMedia 없음) | 'denied' | 'notfound' | 'busy' | 'unknown'
 */
function classify(e) {
  switch (e?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'denied'
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'notfound'
    case 'NotReadableError':
    case 'AbortError':
      return 'busy'
    default:
      return 'unknown'
  }
}

const supported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia

export function useCamera(initialFacing = 'environment') {
  const [facing, setFacing] = useState(initialFacing)   // 요청한 방향
  const [attempt, setAttempt] = useState(0)             // retry()마다 +1 → 효과 재실행
  const [stream, setStream] = useState(null)
  const [actualFacing, setActualFacing] = useState('user')
  const [canFlip, setCanFlip] = useState(false)
  const [status, setStatus] = useState(supported ? 'starting' : 'error')
  const [error, setError] = useState(supported ? null : 'unsupported')

  useEffect(() => {
    if (!supported) return undefined
    let cancelled = false
    let current = null

    // 화면 방향에 맞는 영상을 요청 — 세로 폰에 가로 영상이 오면 화면에 맞추느라 가운데만 크게 잘려 '확대된 것처럼' 보인다
    const portrait = window.matchMedia?.('(orientation: portrait)').matches
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: facing },
          width: { ideal: portrait ? 1080 : 1920 },
          height: { ideal: portrait ? 1920 : 1080 },
        },
      })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach(t => t.stop())
          return undefined
        }
        current = s
        const settings = s.getVideoTracks()[0]?.getSettings?.() || {}
        setActualFacing(settings.facingMode === 'environment' ? 'environment' : 'user')
        setStream(s)
        setStatus('live')
        // 권한을 받은 뒤에야 장치 목록이 제대로 보인다 — 카메라가 둘 이상일 때만 전환 버튼
        return navigator.mediaDevices.enumerateDevices()
          .then((devices) => {
            if (!cancelled) setCanFlip(devices.filter(d => d.kind === 'videoinput').length > 1)
          })
          .catch(() => {})
      })
      .catch((e) => {
        if (cancelled) return
        setError(classify(e))
        setStatus('error')
      })

    return () => {
      cancelled = true
      current?.getTracks().forEach(t => t.stop())
    }
  }, [facing, attempt])

  // 다시 켜기 전 상태를 '켜는 중'으로 — 효과 안이 아니라 버튼 핸들러에서 바꾼다
  const restart = () => {
    setStream(null)
    setError(null)
    setStatus('starting')
  }

  const flip = useCallback(() => {
    restart()
    setFacing(f => (f === 'environment' ? 'user' : 'environment'))
  }, [])

  const retry = useCallback(() => {
    restart()
    setAttempt(n => n + 1)
  }, [])

  return {
    stream,
    status,
    error,
    canFlip,
    flip,
    retry,
    // 정면(셀피) 카메라는 거울처럼 좌우를 뒤집어 보여 준다. 후면은 그대로.
    mirrored: actualFacing !== 'environment',
  }
}
