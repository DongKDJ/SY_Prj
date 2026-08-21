# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"여우씨의 디저트 레시피" - 4단계 카드 선택으로 16가지 디저트 결과를 보여주는 인터랙티브 성격 테스트 웹앱.

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS 4 (via @tailwindcss/vite plugin)
- Framer Motion (page transitions, card animations)
- Pretendard font (Korean typography)
- 사운드 없음 — 2026-07-11 스코프 아웃 결정 (howler 의존성 제거, 무음 유지)

## Commands

- `npm run dev` — 개발 서버 (localhost:5173)
- `npm run build` — 프로덕션 빌드 (dist/)
- `npm run preview` — 빌드 결과 미리보기
- `npm run lint` — ESLint

## Architecture

Screen flow managed by `useGameState` hook:
`title → dialog → stage1 → stage2 → stage3 → stage4 → resultTransition → result → dessertBook`
(intro 속표지 프롤로그는 2026-08-21 원화 적용과 함께 제거 — IntroScreen.jsx 삭제)

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
- `screens/` — 원화 화면 레이어 (아래 "원화 화면 레이어 시스템" 참조)

### 원화 화면 레이어 시스템 (2026-08-21 적용)

타이틀·대화(오프닝)·책갈피 3개 화면은 3840x2160 정렬 투명 PNG 레이어(원본: 작가 4K 원화, 무손실 복사 — 사용자 결정)로 구성.
- 임포트 정본: `src/assets/screenImages.js` (금장 5장·풀 4장·책갈피 타이틀 4장·재료 8장 등 매핑)
- 스테이지: `src/components/shared/ArtStage.jsx` — 16:9 cover 스테이지(세로 화면 = 중앙 크롭, 사용자 결정). `ArtLayer`(풀캔버스 레이어) · `GoldFrame`(금장) · `ArtBandCrop`(세로 화면용 가로 밴드 크롭: 타이틀 로고·책갈피 배너)
- 세로(QR 모바일) 보조: 로고·배너는 ArtBandCrop 밴드로, 대사는 하단 양피지 스트립으로 대체 (`portrait:` variant)
- 책갈피 페이지: 선택 누적 재료가 `ingredientLayers[cardId]` 풀캔버스 레이어로 책상 위에 쌓임 (원화에서 재료별 자리가 서로 다름 — 1단계 중앙 위 / 2단계 중앙 아래 / 3단계 오른쪽 / 4단계 왼쪽)
- 여우씨 배치 튜닝: `DialogScreen.jsx` 상단 `FOX` · `BUBBLE_TEXT` 상수 (스테이지 % 좌표)
- 앰비언트: `index.css`의 `art-zoom`(배경 켄번즈) · `art-sway`(풀) · `art-bob`(로고·말풍선·배너) — 진폭이 `--ambient`를 타서 reduced-motion 시 자동 정지
- 커스텀 커서: `index.css` 말미, `screens/cursor.png` 32x32, 핫스팟 (15,1) = 위 꼭짓점

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
Storybook 테마 작업 후 확장된 액센트: `jam`(라즈베리), `honey`(황금), `sage`(세이지 그린), `ink`(진갈색), `paper`/`paper-edge`(양피지).

## Storybook Recipe Journal Theme

**2026-06-07 `main`에 병합 완료 — 이후 main에서 직접 진행.** 컨셉: **동화책 + 낡은 레시피 노트**.

### 브랜치
- **`main`** 단일 — 현재 작업 + 배포 브랜치 (옛 작업 브랜치 전부 병합·폐기, 분기 안 함)
- 배포: `main` 푸시 → GitHub Actions 자동 배포 (정본: 프로젝트 메모리 `deploy-mechanism`)

### 폰트 (index.html에 Google Fonts 추가됨)
- **Display:** Gowun Batang — 한글 명조, 손글씨 느낌 살짝 (`.font-display`)
- **Script:** Caveat — 영문 손글씨, 라벨/캡션용 (`.font-script`)
- **Body:** Pretendard (기존 유지)

### 공통 장식 컴포넌트
`src/components/shared/Decorations.jsx`:
- `<PaperGrain />` — 종이 결 노이즈 오버레이 (absolute inset-0, 반드시 부모 relative)
- `<Divider variant="diamond|wave" />` — 손그림 디바이더
- `<Sparkle />`, `<Floret />`, `<WheatSprig flip />` — 작은 장식 SVG
- `<CornerOrnament corner="tl|tr|bl|br" />` — 페이지 코너 장식
- `<WaxSeal size rotate>` — 왁스 씰 도장 (children에 텍스트)
- `<MaskingTape width rotate tone="honey|jam|sage|cream" />` — 마스킹 테이프
- `<FloatingMotes count palette />` — 떠있는 작은 별/꽃잎 배경 장식

### 색 톤 사용 가이드 (정적 클래스만 사용 — Tailwind v4가 동적 보간을 못 잡음)
- 메인 액센트: `text-jam`, `text-honey`, `text-sage`
- 부드러운 변형: `text-jam-soft`, `text-honey-soft`, `text-sage-soft`
- 잉크 본문: `text-ink`, `text-ink/65` 식
- 종이 배경: `bg-paper`, `border-paper-edge`

> StageScreen에서 시간대별 액센트 매핑 사용 (`accentText`, `accentBg` 등 정적 키로). 절대 `text-${var}` 식 동적 보간 금지.

### CSS 유틸리티 (`src/index.css`)
- `.paper-grain` / `.page-vignette` — 종이 효과
- `.ink-bleed-in` — 잉크 번지듯 진입
- `.page-turn-in` — 페이지 넘김 (perspective rotateY)
- `.seal-stamp` — 왁스 도장 찍기 (overshoot scale + rotate)
- `.tape-settle` — 테이프 자리 잡기
- `.drift-float` — 작은 입자 부유 (CSS var --dur/--dx/--dy/--dr)
- `.script-shimmer` — 손글씨 opacity 반짝
- `.paper-lift` — hover 시 종이 살짝 들림
- `.scent-line` / `.oven-glow` — 향기 연기 잉크선 · 오븐 온기 펄스 (ResultTransition)
- `.art-zoom` / `.art-sway` / `.art-bob` — 원화 화면 앰비언트 (2026-08-21)

### 화면 적용 진행
- [x] TitleScreen — **원화 교체 (2026-08-21)**: 배경 + 뼈다귀 타이틀 명판 + 금장, 전체 탭으로 시작
- [x] DialogScreen — **원화 교체 (2026-08-21)**: 주방 배경 + 여우씨(레이어 캐릭터) + 잼병 + 구름 말풍선(대사 타이핑 내장)
- [x] StageScreen — **책갈피 페이즈 원화 교체 (2026-08-21)**: 책상 배경 + 풀 + "N번째 책갈피" 배너 + 선택 재료 누적. 카드 선택·확대 페이즈는 Storybook 톤 유지
- [x] CardSelect — 양피지 질문 패널 + 손그림 코너 장식 카드 (실물 카드 원화는 2026-07-13 적용)
- [x] ResultScreen — 메달리온 reveal + 펼친 책 양면 detail
- [x] DessertBook — 16종 도감 그리드 (Storybook 톤 재작성, 상세 펼침 뷰, 나가기=결과화면 복귀)
- ~~IntroScreen~~ — 속표지 프롤로그, 2026-08-21 흐름에서 제거 (파일 삭제, git 이력에 잔존)
- [x] ResultTransition — 오븐 페이지 (잉크 오븐 + 온기 글로우 + 여우 메모, 이모지 제거, 2026-07-11)

### 다음 세션 작업 시 주의
- 모든 작업은 `main`에서 직접 (브랜치 분리 안 함). 테마 화면은 전 화면 적용 완료 (2026-07-11)
- 새로운 색/유틸리티 추가 시 반드시 정적 클래스 — Tailwind v4 보간 미감지 주의

## Dessert Animation System

### 핵심 파일
- `src/data/dessertLayerConfig.js` — 디저트별 애니메이션 설정 (튜닝 작업 시 주로 편집)
- `src/components/shared/AnimatedDessert.jsx` — 레이어 렌더링 컴포넌트
- `src/assets/imageMap.js` — 이미지 import 및 `getDessertLayers()` (레이어 파일 자동 감지)
- `src/index.css` — 애니메이션 keyframes 정의 (dessert-boing, dessert-sub-* 등)
- 프리뷰 경로: `DessertBook.jsx`(도감 그리드·상세 펼침)와 `ResultScreen.jsx`가 AnimatedDessert 렌더 — 전용 DessertPreview 페이지는 없음 (옛 preview 브랜치에만 존재, main 미병합)

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
> 디저트별 16종 튜닝 체크리스트는 `TUNING_TODO.md`로 분리 (휘발성 진행 데이터, 2026-06-13). 현재 #01 완료 / #02 튜닝 중 / #03~16 대기.

### 튜닝 작업 플로우
1. `main`에서 직접 작업 (브랜치 분리 없음)
2. `npm run dev` → http://localhost:5173/SY_Prj/ 에서 프리뷰
3. 도감(DessertBook)에서 해당 디저트 클릭하여 크게 보면서 레이어 이미지 확인 (Read tool로 각 서브 확인)
4. `dessertLayerConfig.js`에 해당 디저트 설정 추가
5. 필요시 `src/index.css`에 새 애니메이션 타입 추가
6. 사용자와 실시간으로 수치 조정 반복
