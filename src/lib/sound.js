/**
 * 소리 (2026-11-04 대표 지시 — 그 전까지는 무음 고정이었다)
 *  · 배경음악 bgm   — 열리자마자 시도, 브라우저가 막으면 첫 터치에서 시작해 반복. 화면을 떠나면 멈추고 돌아오면 이어서.
 *  · 클릭음 click   — 버튼을 누를 때(App이 문서 전체에서 받는다). data-sfx="none" 버튼은 제외(카드 = 뒤집힘 소리가 대신).
 *  · 카드 뒤집힘 flip-1 / flip-2 — 둘 중 하나 무작위.
 *  · 책갈피 넘김 page-1~3 — 종이 넘기는 소리 한 파일(대표 지정)을 세 조각으로 잘라 무작위.
 *  · 카드 결과 spell — 고른 카드가 크게 펼쳐질 때. · 최종 결과 fanfare — 디저트가 처음 공개될 때.
 *  · 여우 대사 blip-1~8 — 타자기로 글자가 찍힐 때마다 한 번씩(글자·숫자만, 빈칸·문장부호는 조용히) 팝 소리 한 파일을 잘라 무작위.
 *    2026-11-05 대표 "글자에 싱크 맞게": 글자마다 짧게(0.06초) 끊어 내고, 효과음은 Web Audio로 지연 없이 낸다(typeBlip · TYPE_MS).
 * 음원 = src/assets/audio/{bgm,click,flip-1,flip-2,page-1~3}.mp3 (Pixabay Content License — 앱에 넣어 쓰기 허용, 출처 표기 불필요,
 * 음원 파일만 따로 나눠 주기는 금지). 파일이 없으면 그 소리만 조용히 빠진다(빌드는 그대로).
 * 끄기 상태는 기기에 기억(localStorage).
 */
const files = import.meta.glob('../assets/audio/*.{mp3,ogg,m4a,wav}', { eager: true, query: '?url', import: 'default' })
const url = (name) => Object.entries(files).find(([p]) => p.split('/').pop().replace(/\.\w+$/, '') === name)?.[1]

// 음량 = 파일 자체를 평탄화해 두었다(2026-11-04, ffmpeg loudnorm 2패스 → ebur128로 재측정).
// 기준 = 게임 오디오 업계 권장치 ASWG-R001 휴대기기 -18 LUFS(±2), 최대 -1 dBTP.
//   bgm · flip-1 · flip-2 · page-2 · page-3 = -18.4 LUFS, page-1 = -19.1(최대치 -1 dBTP에 걸려 더 못 올림). click은 0.1초짜리라 LUFS를 잴 수 없어(400ms 창) 짧은 창 RMS로 뒤집힘보다 3dB 아래.
// 여기서는 배경음악만 내린다 — 0.6(-4.4dB → 약 -22.8 LUFS). 2026-11-05 대표가 귀로 듣고 "살짝 작게"(0.85 → 0.6, 3dB 더).
// 기준 범위(-18±2)보다 조금 아래지만 효과음 밑에 깔리는 음악이라 대표 판단을 따른다.
// 음원을 바꾸면 원본에서 다시 평탄화할 것(원본 = SY_Prj\사운드\, 측정·변환 명령은 커밋 메시지).
const VOLUME = { bgm: 0.6, ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`blip-${i + 1}`, 0.85])) } // 그 외 효과음은 1. 블립은 -6dBFS 피크 파일 — 2026-11-05 대표 "좀 더 크게"(0.5 → 0.85, 약 +4.6dB)
// 무작위로 고르는 묶음
const POOLS = {
  flip: ['flip-1', 'flip-2'],
  page: ['page-1', 'page-2', 'page-3'],
  blip: Array.from({ length: 8 }, (_, i) => `blip-${i + 1}`),
}
const KEY = 'sy-sound-muted'

let muted = false
try { muted = localStorage.getItem(KEY) === '1' } catch { /* 저장소를 못 쓰면 켜진 채로 */ }
let bgm = null
let wanted = false // 첫 터치 이후 배경음악을 틀어야 하는 상태
const subs = new Set()

export const hasSound = () => Object.keys(files).length > 0
export const isMuted = () => muted
export const isPlaying = () => !!bgm && !bgm.paused // 배경음악이 실제로 나오는 중인가(자동재생이 막히면 false)
const notify = () => subs.forEach((fn) => fn())
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
  notify()
}

/**
 * 화면이 열리자마자 한 번, 그리고 터치·키 입력마다 부른다.
 * 브라우저가 자동재생을 허락하면(전시 PC 설정·자주 들른 사이트) 바로 나오고,
 * 막히면 조용히 기다렸다가 첫 터치에서 나온다. 이미 나오고 있으면 아무 일도 안 한다.
 */
export function startBgm() {
  if (!wanted) {
    wanted = true
    const src = url('bgm')
    if (src) {
      bgm = new Audio(src)
      bgm.loop = true
      bgm.volume = VOLUME.bgm
      bgm.addEventListener('play', notify)
      bgm.addEventListener('pause', notify)
    }
  }
  if (bgm?.paused) syncBgm()
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', syncBgm)
}

// 효과음은 미리 받아 두고 재생할 때마다 복제 — 연달아 눌러도 겹쳐 나온다 (Web Audio를 못 쓸 때의 예비 경로)
const SFX = ['click', 'spell', 'fanfare', ...Object.values(POOLS).flat()]
const preloaded = {}
for (const name of SFX) {
  const src = url(name)
  if (src && typeof Audio !== 'undefined') {
    const a = new Audio(src)
    a.preload = 'auto'
    preloaded[name] = a
  }
}

/* 효과음 본 경로 = Web Audio. <audio>를 복제해 틀면 누를 때마다 수십 ms씩 늦고 들쭉날쭉해서 글자·그림과 어긋난다.
   미리 풀어 둔 버퍼를 바로 내면 지연이 거의 없다. 컨텍스트는 사용자가 처음 누를 때 만든다(그 전에 만들면 브라우저가 막는다). */
let ctx = null
const buffers = {}
export function unlockAudio() {
  if (typeof window === 'undefined') return
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    try { ctx = new AC({ latencyHint: 'interactive' }) } catch { return }
    for (const name of SFX) {
      const src = url(name)
      if (!src) continue
      fetch(src).then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b))
        .then((buf) => { buffers[name] = buf }).catch(() => { /* 못 풀면 그 소리는 예비 경로로 */ })
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
}

// 대사 팝 한 번의 길이 — 글자 간격(TYPE_MS)보다 조금 길게 끊어 글자마다 또렷이 들리게
const BLIP_HOLD = 0.035
const BLIP_LEN = 0.06

/** 'click' | 'spell' | 'fanfare' | 'flip' | 'page' | 'blip' */
export function play(kind) {
  if (muted) return
  let name = kind
  if (POOLS[kind]) {
    const pool = POOLS[kind].filter((n) => preloaded[n])
    if (!pool.length) return
    name = pool[Math.floor(Math.random() * pool.length)]
  }
  const vol = VOLUME[name] ?? 1
  const buf = ctx && ctx.state === 'running' ? buffers[name] : null
  if (buf) {
    const src = ctx.createBufferSource()
    const gain = ctx.createGain()
    src.buffer = buf
    gain.gain.value = vol
    src.connect(gain).connect(ctx.destination)
    if (kind === 'blip') {
      const t = ctx.currentTime
      gain.gain.setValueAtTime(vol, t + BLIP_HOLD)
      gain.gain.linearRampToValueAtTime(0.0001, t + BLIP_LEN)
      src.start(t, 0, BLIP_LEN + 0.01)
    } else {
      src.start()
    }
    return
  }
  const base = preloaded[name]
  if (!base) return
  const a = base.cloneNode()
  a.volume = vol
  a.play().catch(() => {})
}

/** 타자기 한 글자 간격(ms) — 글자마다 팝이 하나씩 붙으므로 팝 길이(0.06초)와 맞춘 값 */
export const TYPE_MS = 50
/** 방금 찍힌 글자에 팝 — 글자·숫자일 때만(빈칸·문장부호는 조용히 넘어가 말의 리듬이 생긴다) */
export function typeBlip(ch) {
  if (ch && /[\p{L}\p{N}]/u.test(ch)) play('blip')
}
