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
- `character/` — fox-body.png, fox-blink-01~04.png, fox-hand.png
- `cards/` — card-stage{1-4}-{id}.png, ingredient-{name}.png
- `desserts/` — dessert-01.png through dessert-16.png
- `backgrounds/` — morning.png, noon.png, evening.png, night.png, dawn.png

### Fox Character Layer System
`Character.jsx`가 동적 임포트로 자동 인식. 다음 파일이 모두 있으면 레이어 모드로 동작:
- `fox-body.png` — 몸체 (눈 뜬 상태, 손 빠진 상태)
- `fox-blink-01.png` ~ `fox-blink-04.png` — 4프레임 깜빡임 (눈 뜸 → 반쯤 감김 → 감김 → 반쯤 뜸)
- `fox-hand.png` — 분리된 손 (`.fox-hand-sway` 애니메이션 자동 적용)

모든 레이어는 같은 캔버스 크기의 투명 PNG여야 좌표가 맞음. 각 레이어는 존재하면 렌더링, 없으면 스킵 (body는 필수).

깜빡임 타이밍: 2~4.5초 랜덤 간격, 1프레임 80ms → 2프레임 120ms → 3프레임 80ms → 0프레임 복귀.
손 흔들림: `index.css` `@keyframes fox-hand-sway-kf` (3.2s loop, transform-origin 50% 35%).

## Color Palette

Warm cream + brown cabin theme defined in `src/index.css` @theme block.

## Dessert Animation System

### 브랜치 구조
- `review/bounce-animation` — 메인 작업 브랜치 (16종 이미지 + 레이어 적용 완료)
- `preview/dessert-animations` — 애니메이션 프리뷰 전용 (PREVIEW_MODE=true, App.jsx)

### 핵심 파일
- `src/data/dessertLayerConfig.js` — 디저트별 애니메이션 설정 (튜닝 작업 시 주로 편집)
- `src/components/shared/AnimatedDessert.jsx` — 레이어 렌더링 컴포넌트
- `src/assets/imageMap.js` — 이미지 import 및 `getDessertLayers()` (레이어 파일 자동 감지)
- `src/index.css` — 애니메이션 keyframes 정의 (dessert-boing, dessert-sub-* 등)
- `src/components/DessertPreview.jsx` — 16종 그리드 프리뷰 페이지

### 레이어 이미지 규칙 (`src/assets/images/desserts/layers/`)
- `plate_{NN}.png` — 접시 (정적, 선택)
- `back_{NN}.png` — 백 레이어 (선택)
- `main_{NN}.png` 또는 `main_{NN}_01.png~02.png` — 메인 (필수, 복수 가능)
- `sub_{NN}_01.png~10.png` — 서브 장식 (선택)
- 레이어 순서 (뒤→앞): 접시 > 백 > 메인 > 서브, 같은 종류 내 숫자 높을수록 앞

### dessertLayerConfig.js 설정 옵션
```js
{
  bounce: 'bounce',           // 메인 바운스 타입 (기본 'bounce', 'wobble', 'soft', 'float' 등)
  pivotY: 'bottom',           // 바운스 그룹 피봇 Y (기본 'bottom', '%'값 가능)
  subs: ['type', ...],        // 서브별 애니메이션 타입
  subPivots: ['x% y%', ...],  // 서브별 피봇 (null=기본, 단일값='center {v}', 2값=그대로)
  subDelays: [0.1, ...],      // 서브별 딜레이 초 (null=자동 스태거)
  subDetach: [true, ...],     // true=바운스 그룹 밖 독립 움직임
  subBehind: [true, ...],     // true=접시보다 뒤에 렌더링
}
```

### 사용 가능한 애니메이션 타입
| 타입 | 설명 | 변형 |
|------|------|------|
| `jelly` | scaleY+scaleX+skewX 탱글 (기본) | — |
| `sway` | skewX 바닥고정 찰랑 (±0.6°) | `sway-sm`, `sway-lg`, `sway-xl`, `sway-sm2` |
| `sync` | 메인 바운스 동기화 | `sync-sm` (0.8배), `sync-fast` (0.8배) |
| `hover` | translateY 미세 부유 | `hover-lg` (1.3배) |
| `breathe` | scaleY 부풀기 | `breathe-lg` (1.3배) |
| `pulse` | opacity 반짝 | — |
| `drift` | translateX 좌우 이동 | — |
| `drift-scale` | 좌우 이동 + 균일 크기 변화 | — |

### 메인 바운스 타입 (`bounce` 옵션)
| 타입 | 설명 |
|------|------|
| `bounce` | 기본 2단 바운스 (scaleY 기반, 강→약) |
| `wobble` | scaleX↔scaleY 교차 변형 (말랑 젤리) |
| `soft` | scaleY만 부드럽게 부풀기 (무스/구름용) |
| `float` | translateY + 미세 scaleY (구름 부유) |

### 애니메이션 원칙
- 음식이므로 과한 움직임 금지
- 메인 바운스: scaleY 기반, bottom 앵커, 2단 바운스 (강→약)
- 서브: 바닥 고정 원칙, rotate 기반 찰랑거림 권장 (skewX보다 자연스러움)
- 늘어남→원상복귀는 ease-out으로 느리게 (자연스러운 탄성)
- detach된 서브는 메인 바운스와 독립적으로 움직임

### 튜닝 진행 현황
- ✅ #01 별밤 초코애플 푸딩 — 완료
- 🔧 #02 구름사과 무스케이크 — 튜닝 중 (wobble+drift-scale, pivotY 85% 조정중)
- ⬜ #03 반짝이는 사과쿠키
- ⬜ #04 소복한 사과 타르트
- ⬜ #05 눈덩이 초코 사과 마쉬멜로우
- ⬜ #06 사과 바람 판나코타
- ⬜ #07 사과 초코 격자 파이
- ⬜ #08 따끈한 사과 슈가 팬케이크
- ⬜ #09 고요한 딸기 초코 파르페
- ⬜ #10 새벽녘 딸기 젤리 롤
- ⬜ #11 딸기 퐁당 오 쇼콜라
- ⬜ #12 설원의 딸기 크럼블
- ⬜ #13 완화! 딸기 초코 젤리 케이크
- ⬜ #14 딸기 젤리 와플
- ⬜ #15 스트로베리 팽 오 쇼콜라
- ⬜ #16 포근한 딸기우유 케이크

### 튜닝 작업 플로우
1. `preview/dessert-animations` 브랜치에서 작업
2. `npm run dev` → http://localhost:5173/SY_Prj/ 에서 프리뷰
3. 디저트 클릭하여 크게 보면서 레이어 이미지 확인 (Read tool로 각 서브 확인)
4. `dessertLayerConfig.js`에 해당 디저트 설정 추가
5. 필요시 `src/index.css`에 새 애니메이션 타입 추가
6. 사용자와 실시간으로 수치 조정 반복
