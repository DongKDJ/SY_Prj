import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import webpImages from './vite.webp.js'
import offlineServiceWorker from './vite.sw.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), webpImages(), offlineServiceWorker()],
  base: '/SY_Prj/',
})
