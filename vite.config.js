import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import webpImages from './vite.webp.js'
import offlineServiceWorker from './vite.sw.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), webpImages(), offlineServiceWorker()],
  base: '/SY_Prj/',
  build: {
    // 짧은 효과음(블립 등 4KB 미만)이 JS 안에 base64로 박히지 않게 — 소리는 전부 파일로(오프라인 저장본·측정이 같은 경로를 보게)
    assetsInlineLimit: (file) => (/\.(mp3|ogg|m4a|wav)$/.test(file) ? false : undefined),
  },
})
