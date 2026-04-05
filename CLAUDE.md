# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"여우씨의 디저트 레시피" - 4단계 카드 선택으로 16가지 디저트 결과를 보여주는 인터랙티브 성격 테스트 웹앱.

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS 4 (via @tailwindcss/vite plugin)
- Framer Motion (page transitions, card animations)
- Howler.js (sound effects - not yet implemented)
- Pretendard font (Korean typography)

## Commands

- `npm run dev` — 개발 서버 (localhost:5173)
- `npm run build` — 프로덕션 빌드 (dist/)
- `npm run preview` — 빌드 결과 미리보기
- `npm run lint` — ESLint

## Architecture

Screen flow managed by `useGameState` hook:
`title → intro → dialog → stage1 → stage2 → stage3 → stage4 → resultTransition → result → dessertBook`

Key data in `src/data/desserts.js`: stages (4 questions), dessertResults (16 combinations keyed by card IDs), foxDialogs.

## File Permission Rules

- 읽기/쓰기가 허용된 파일 확장자: `.jsx`, `.js`, `.css`, `.html`, `.json`, `.md`
- 이미지 파일(.png, .svg 등)은 읽기 전용으로 참조만 가능
- 이미지 파일의 수정/삭제는 사용자의 명시적 허락 필요

## Image Assets

All image placeholders in `src/assets/images/`. Replace PNG files with same filenames:
- `character/` — fox-half.png, fox-full.png, fox-blink-1~5.png
- `cards/` — card-stage{1-4}-{id}.png, ingredient-{name}.png
- `desserts/` — dessert-01.png through dessert-16.png
- `backgrounds/` — morning.png, noon.png, evening.png, night.png, dawn.png

## Color Palette

Warm cream + brown cabin theme defined in `src/index.css` @theme block.
