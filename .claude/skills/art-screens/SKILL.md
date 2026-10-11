---
name: art-screens
description: "원화 화면·UI 아트 — 3840x2160 원화 레이어(ArtStage·ArtLayer·GoldFrame·ArtBandCrop), 타이틀 스푼·포크 둥실, 이전 버튼, 여우씨 레이어 캐릭터·깜빡임, Storybook 테마 장식 컴포넌트·색 톤·CSS 유틸리티. 원화 화면·타이틀·이전 버튼·여우씨·장식·색·폰트·CSS 유틸리티를 고치거나 새 화면 아트를 넣을 때 연다. 키워드: 원화, 타이틀, 책갈피, 대화 화면, 세로 화면, 이전 버튼, 여우씨, 깜빡임, 장식, 팔레트, 폰트, 앰비언트, 커서."
---

# 원화 화면·UI 아트

## 원화 화면 레이어 시스템

타이틀·대화(오프닝)·책갈피 3개 화면은 3840x2160 정렬 투명 PNG 레이어(원본: 작가 4K 원화, 무손실 복사 — 사용자 결정)로 구성.
- 임포트 정본: `src/assets/screenImages.js` (금장 5장·풀 4장·책갈피 타이틀 4장·재료 8장 등 매핑)
- 스테이지: `src/components/shared/ArtStage.jsx` — 16:9 cover 스테이지(세로 화면 = 중앙 크롭, 사용자 결정). `ArtLayer`(풀캔버스 레이어) · `GoldFrame`(금장) · `ArtBandCrop`(세로 화면용 가로 밴드 크롭: 타이틀 로고·책갈피 배너)
- 세로(QR 모바일) 보조: 로고·배너는 ArtBandCrop 밴드로, 대사는 하단 양피지 스트립으로 대체 (`portrait:` variant)
- 책갈피 페이지: 선택 누적 재료가 `ingredientLayers[cardId]` 풀캔버스 레이어로 책상 위에 쌓임 (원화에서 재료별 자리가 서로 다름 — 1단계 중앙 위 / 2단계 중앙 아래 / 3단계 오른쪽 / 4단계 왼쪽)
- 여우씨 배치 튜닝: `DialogScreen.jsx` 상단 `FOX` · `BUBBLE_TEXT` 상수 (스테이지 % 좌표)
- 앰비언트: `index.css`의 `art-zoom`(배경 켄번즈) · `art-sway`(풀) · `art-bob`(로고·말풍선·배너) — 진폭이 `--ambient`를 타서 reduced-motion 시 자동 정지
- 커스텀 커서: `index.css` 말미, `screens/cursor.png` 32x32, 핫스팟 (15,1) = 위 꼭짓점

## 타이틀 스푼·포크 둥실

원화 `title-bg.png`에 그려져 있던 좌우 스푼·포크를 떼어내 따로 띄운다. 작가 원본은 그대로 두고 파생 3장을 추가:
- `title-spoon.png` / `title-fork.png` — 실루엣만 남긴 컷아웃 (GrabCut + 색 정리, 스크래치패드 스크립트)
- `title-bg-patch.png` — 떼어낸 자리를 메운 배경 조각. **배경 바로 위에 깔아야** 원본 스푼이 비치지 않는다.
  **실루엣에 딱 붙여서(10px 여유) 팔 것** — 넓게 파면 그만큼 진짜 배경이 지워지고, 형태학 연산의 사각 경계가
  각진 얼룩으로 드러난다. 인페인트는 TELEA + 안쪽으로 갈수록 블러 (빛줄기 자국 제거)
- 셋 다 `art-zoom` 컨테이너 **안**에 넣을 것 — 배경만 켄번즈 줌이 걸리면 메운 자리와 어긋난다
- 흔들림은 `.art-drift` (index.css). 현재 유효 진폭 translateY 47px + rotate 0.96deg (캔버스 기준)
- 진폭을 키워도 원본이 새지는 않지만(patch가 실루엣을 통째로 덮으므로) **움직인 만큼 메운 배경이 드러난다** — 진폭 = 노출 폭. `--drift-amp`가 `min(--ambient, 0.6)`인 것도 `?ambient=strong`에서 그 폭이 커지지 않게 하기 위함

## 이전 버튼

타이틀을 뺀 전 화면 좌하단에 원화 사과 버튼(`src/components/shared/BackButton.jsx`, `images/ui/back-button.png`).
- 자리·크기 모두 작가 지정: 3840x2160 캔버스에 놓아준 위치(좌하단)와 크기(385px = 폭의 10% → `w-[clamp(104px,10vw,208px)]`)
- **세로 화면에서만 좌상단** (`portrait:top-4`) — 대화 화면의 하단 대사 스트립과 겹쳐서. 원화 좌표를 그대로 쓰면 세로에서는 화면 밖으로 잘려나간다
- `fixed` — 도감처럼 화면보다 긴 페이지에서 `absolute`는 버튼을 문서 맨 아래로 밀어낸다
- 화면 간 이동은 `useGameState`의 `prevScreen` + `BACK_TO` 맵. 결과 → 오븐은 건너뛰고 stage4로 (되돌아가도 곧장 다시 구워지는 자동 화면이라)
- 화면 안에 페이즈가 있으면 페이즈부터 되짚는다: StageScreen(확대→카드→책갈피), ResultScreen(펼친 책→메달리온), DessertBook(상세→그리드)
- 뒤로 와서 스테이지가 바뀌면 책갈피를 건너뛰고 카드 선택 페이즈로 (StageScreen의 `goingBack`)
- z-50 고정 — 화면 전체가 탭 영역인 화면(대화·책갈피·결과 메달리온)의 탭 버튼보다 위여야 클릭이 먹는다. **버튼 안에 버튼을 넣을 수 없으므로 항상 형제로 배치**

## 여우씨 레이어 캐릭터

`src/assets/foxLayers.js`가 `import.meta.glob`으로 `images/character/fox-*.png`를 자동 인식하고 `Character.jsx`가 렌더한다. 레이어마다 있으면 렌더, 없으면 스킵 (body는 필수):
- `fox-body.png` — 몸체 (눈 뜬 상태, 손 빠진 상태)
- `fox-blink-01.png` ~ `fox-blink-04.png` — 4프레임 깜빡임 (눈 뜸 → 반쯤 감김 → 감김 → 반쯤 뜸)
- `fox-hand.png` — 분리된 손 (`.fox-hand-sway` 애니메이션 자동 적용)

모든 레이어는 같은 캔버스 크기의 투명 PNG여야 좌표가 맞음.

깜빡임 타이밍: 2~4.5초 랜덤 간격, 1프레임 80ms → 2프레임 120ms → 3프레임 80ms → 0프레임 복귀.
손 까딱: `index.css` `.fox-hand-sway` / `@keyframes fox-hand-sway-kf` (대부분 정지 → translateY 두 번 까딱, 주기·진폭은 거기서).

## 색·폰트·장식

Warm cream + brown cabin theme defined in `src/index.css` @theme block.
액센트: `jam`(라즈베리), `honey`(황금), `sage`(세이지 그린), `ink`(진갈색), `paper`/`paper-edge`(양피지).

### 폰트 (`src/main.jsx`에서 npm 패키지로 셀프호스팅 — CDN 미사용)
- **Display:** Gowun Batang (`@fontsource/gowun-batang`) — 한글 명조 (`.font-display`)
- **Script:** Caveat (`@fontsource/caveat`) — 영문 손글씨, 라벨/캡션용 (`.font-script`)
- **Body:** Pretendard Variable (`pretendard` dynamic-subset)

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
- `.art-zoom` / `.art-sway` / `.art-bob` — 원화 화면 앰비언트
