// 빌드 전용: src/assets/images 의 PNG 임포트를 WebP로 바꿔 내보낸다.
// 원본 PNG(작가 원화)는 그대로 두고 배포본만 가볍게 — dev 서버는 원본을 그대로 쓴다.
// 해상도는 원화 그대로(4K 전시 모니터 대비), 카드만 화면 표시 크기에 맞춰 1280 폭으로.
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const IMAGES_DIR = path.resolve('src/assets/images').replaceAll('\\', '/')
const CACHE_DIR = path.resolve('node_modules/.cache/webp')
const MIN_BYTES = 50_000 // 작은 UI 조각은 변환 이득보다 화질 위험이 크다
const maxWidthFor = (file) => (file.includes('/cards/') ? 1280 : null)

export default function webpImages() {
  return {
    name: 'sy-webp-images',
    apply: 'build',
    enforce: 'pre',
    async load(id) {
      const file = id.split('?')[0].replaceAll('\\', '/')
      if (id.includes('?') || !file.startsWith(IMAGES_DIR) || !file.endsWith('.png')) return null
      const src = readFileSync(file)
      if (src.length < MIN_BYTES) return null

      const maxWidth = maxWidthFor(file)
      const key = createHash('sha1').update(src).update(String(maxWidth)).digest('hex').slice(0, 12)
      const dir = path.join(CACHE_DIR, key)
      const out = path.join(dir, path.basename(file, '.png') + '.webp')
      if (!existsSync(out)) {
        mkdirSync(dir, { recursive: true })
        let img = sharp(src)
        if (maxWidth) img = img.resize({ width: maxWidth, withoutEnlargement: true })
        await img.webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(out)
      }
      return `export { default } from ${JSON.stringify(out.replaceAll('\\', '/'))}`
    },
  }
}
