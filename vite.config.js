import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import webpImages from './vite.webp.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), webpImages()],
  base: '/SY_Prj/',
})
