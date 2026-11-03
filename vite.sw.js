// 빌드 전용: 오프라인 대비 서비스 워커(sw.js)를 만든다 — 전시장 와이파이가 끊겨도 앱이 열리게.
// 의존성 없이 브라우저 기본 기능만 쓴다(Cache Storage + fetch 가로채기).
//
// · 화면(index.html): 인터넷 먼저 → 실패하면 저장본. 배포하면 다음 접속에 바로 새 판이 뜬다.
// · 그림·코드·폰트(assets/, 이름에 해시): 저장본 먼저 → 없으면 받아서 저장. 이름이 바뀌니 옛 판과 섞이지 않는다.
// · 관람객 폰은 실제로 본 파일만 저장(데이터 아끼기). 전시 PC(?kiosk=1)는 앱이 'warm'을 보내 전체(약 33MB)를 미리 저장.
// · 판(VERSION)이 바뀌면 옛 저장소는 지운다.
import { createHash } from 'node:crypto'

const swSource = (version, assets) => `/* 여우씨의 디저트 레시피 — 오프라인 대비 (빌드가 생성, 직접 고치지 말 것: vite.sw.js) */
const VERSION = ${JSON.stringify(version)}
const CACHE = 'sy-' + VERSION
const ASSETS = ${JSON.stringify(assets)}
const SHELL = ['./', './index.html', './favicon.svg']

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)))
})

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('sy-') && k !== CACHE) await caches.delete(k)
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (req.mode === 'navigate') {
    // 화면: 인터넷 먼저(새 배포 반영), 끊기면 저장된 index.html — ?kiosk=1 같은 주소 뒤 꼬리는 무시
    e.respondWith((async () => {
      try {
        const res = await fetch(req)
        const c = await caches.open(CACHE)
        c.put('./index.html', res.clone())
        return res
      } catch {
        return (await caches.match('./index.html', { ignoreVary: true })) || Response.error()
      }
    })())
    return
  }
  e.respondWith((async () => {
    // ignoreVary: 앱 본체 JS·CSS는 crossorigin 요청이라 Origin 헤더가 붙는다 — 미리 받을 때와 헤더가 달라
    // 서버의 Vary 때문에 저장본을 못 찾는 일이 있었다(2026-11-04 실측). 이름에 해시가 있어 무시해도 안전.
    const hit = await caches.match(req, { ignoreSearch: true, ignoreVary: true })
    if (hit) return hit
    const res = await fetch(req)
    if (res.ok && res.type === 'basic') (await caches.open(CACHE)).put(req, res.clone())
    return res
  })())
})

// 전시 PC: 전체 파일을 미리 저장 — 끝나면 'warm-done'(저장 수/전체 수)을 돌려준다
self.addEventListener('message', (e) => {
  if (e.data !== 'warm') return
  e.waitUntil((async () => {
    const c = await caches.open(CACHE)
    let ok = 0
    for (const a of ASSETS) {
      try {
        if (!(await c.match(a, { ignoreVary: true }))) {
          const res = await fetch(a)
          if (res.ok) await c.put(a, res)
        }
        ok++
      } catch { /* 하나 실패해도 나머지는 계속 */ }
    }
    e.source?.postMessage({ type: 'warm-done', ok, total: ASSETS.length })
  })())
})
`

export default function offlineServiceWorker() {
  return {
    name: 'sy-offline-sw',
    apply: 'build',
    generateBundle(_, bundle) {
      const assets = Object.keys(bundle).filter((f) => !f.endsWith('.html')).sort()
      const version = createHash('sha1').update(assets.join('\n')).digest('hex').slice(0, 10)
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: swSource(version, assets) })
    },
  }
}
