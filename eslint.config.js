import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // .claude/: Claude Code 워크트리·설정 폴더 — 린트 대상 아님 (디렉토리 무시는 trailing slash 필요)
  globalIgnores(['dist', '.claude/']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // 코어 no-unused-vars는 JSX 사용(<motion.div> 등)을 참조로 세지 않음 — react 플러그인이 마킹
      'react/jsx-uses-vars': 'error',
    },
  },
])
