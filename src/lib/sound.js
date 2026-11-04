/**
 * 소리 (2026-11-04 대표 지시 — 그 전까지는 무음 고정이었다)
 *  · 배경음악 bgm   — 첫 터치에서 시작해 반복(브라우저는 터치 전 자동재생을 막는다). 화면을 떠나면 멈추고 돌아오면 이어서.
 *  · 클릭음 click   — 버튼을 누를 때(App이 문서 전체에서 받는다). data-sfx="none" 버튼은 제외(카드 = 뒤집힘 소리가 대신).
 *  · 카드 뒤집힘 flip-1 / flip-2 — 둘 중 하나 무작위.
 * 음원 = src/assets/audio/{bgm,click,flip-1,flip-2}.mp3 (Pixabay Content License — 앱에 넣어 쓰기 허용, 출처 표기 불필요,
 * 음원 파일만 따로 나눠 주기는 금지). 파일이 없으면 그 소리만 조용히 빠진다(빌드는 그대로).
 * 끄기 상태는 기기에 기억(localStorage).
 */
const files = import.meta.glob('../assets/audio/*.{mp3,ogg,m4a,wav}', { eager: true, query: '?url', import: 'default' })
const url = (name) => Object.entries(files).find(([p]) => p.split('/').pop().replace(/\.\w+$/, '') === name)?.[1]

const BGM_VOLUME = 0.3
const SFX_VOLUME = 0.6
const KEY = 'sy-sound-muted'

let muted = false
try { muted = localStorage.getItem(KEY) === '1' } catch { /* 저장소를 못 쓰면 켜진 채로 */ }
let bgm = null
let wanted = false // 첫 터치 이후 배경음악을 틀어야 하는 상태
const subs = new Set()

export const hasSound = () => !!(url('bgm') || url('click') || url('flip-1') || url('flip-2'))
export const isMuted = () => muted
export function subscribe(fn) {
  subs.add(fn)
  return () => subs.delete(fn)
}

function syncBgm() {
  if (!bgm) return
  if (wanted && !muted && document.visibilityState === 'visible') bgm.play().catch(() => {})
  else bgm.pause()
}

export function setMuted(v) {
  muted = v
  try { localStorage.setItem(KEY, v ? '1' : '0') } catch { /* 무시 */ }
  syncBgm()
  subs.forEach((fn) => fn())
}

/** 첫 터치에서 부른다 — 여러 번 불러도 한 번만 */
export function startBgm() {
  if (wanted) return
  wanted = true
  const src = url('bgm')
  if (!src) return
  bgm = new Audio(src)
  bgm.loop = true
  bgm.volume = BGM_VOLUME
  syncBgm()
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', syncBgm)
}

// 효과음은 미리 받아 두고 재생할 때마다 복제 — 연달아 눌러도 겹쳐 나온다
const preloaded = {}
for (const name of ['click', 'flip-1', 'flip-2']) {
  const src = url(name)
  if (src && typeof Audio !== 'undefined') {
    const a = new Audio(src)
    a.preload = 'auto'
    preloaded[name] = a
  }
}

/** 'click' | 'flip' */
export function play(kind) {
  if (muted) return
  let name = kind
  if (kind === 'flip') {
    const pool = ['flip-1', 'flip-2'].filter((n) => preloaded[n])
    if (!pool.length) return
    name = pool[Math.floor(Math.random() * pool.length)]
  }
  const base = preloaded[name]
  if (!base) return
  const a = base.cloneNode()
  a.volume = SFX_VOLUME
  a.play().catch(() => {})
}
