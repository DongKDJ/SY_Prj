---
name: dessert-animation
description: "디저트 레이어 애니메이션 — dessertLayerConfig.js 옵션, 레이어 이미지 규칙·렌더 순서, 애니메이션 타입표, 작가 수정본 반영법, 튜닝 플로우. 디저트 레이어 이미지를 넣거나 레이어 순서·애니메이션을 고칠 때 연다. 키워드: 디저트, 레이어, 바운스, 서브, 튜닝, AnimatedDessert, subDetach, subUnderMain, 레이어 순서."
---

# 디저트 애니메이션 시스템

## 핵심 파일
- `src/data/dessertLayerConfig.js` — 디저트별 애니메이션 설정 (튜닝 작업 시 주로 편집)
- `src/components/shared/AnimatedDessert.jsx` — 레이어 렌더링 컴포넌트
- `src/assets/imageMap.js` — 이미지 import 및 `getDessertLayers()` (레이어 파일 자동 감지)
- `src/index.css` — 애니메이션 keyframes 정의 (dessert-boing, dessert-sub-* 등)
- 프리뷰 경로: `DessertBook.jsx`(도감 그리드·상세 펼침)와 `ResultScreen.jsx`가 AnimatedDessert 렌더 — 전용 DessertPreview 페이지는 없음 (옛 preview 브랜치에만 존재, main 미병합)

## 레이어 이미지 규칙 (`src/assets/images/desserts/layers/`)
- `plate_{NN}.png` — 접시 (정적, 선택)
- `back_{NN}.png` — 백 레이어 (선택)
- `main_{NN}.png` 또는 `main_{NN}_01.png~02.png` — 메인 (필수, 복수 가능)
- `sub_{NN}_01.png~10.png` — 서브 장식 (선택)
- 레이어 순서 (뒤→앞): 접시 > 백 > (subUnderMain 서브) > 메인 > 서브, 같은 종류 내 숫자 높을수록 앞
- **작가 수정본 반영법** (드롭 폴더 `Image/디저트 레이어 순서/수정)<디저트명>_분리/` — 파일명 끝 번호가 곧 뒤→앞 순서.
  옛 드롭 폴더 `여우짱 레시피/디저트_레이아웃_분리/수정)…` 도 같은 규칙):
  서브끼리의 순서 문제면 `sub_NN_XX` 번호를 그 순서로 다시 매기고(config 배열도 같이 치환),
  서브가 메인보다 뒤여야 하면 `subUnderMain`.
  **번호 순서는 같은 슬롯 안에서만 유효** — 렌더는 behind(접시 뒤) → 접시 → [바운스 그룹: 백 → under → 메인 → group] → detach 순이라
  `subDetach` 서브는 번호가 낮아도 그룹 안 서브를 항상 덮는다. detach 서브 위에 얹힌 장식은 그것도 detach로 뺄 것.
  파일만 바꾸지 말고 **실제 DOM 순서를 확인** — 스크린샷 또는 `dessert-wrap` 안 `<img>` src 나열

## dessertLayerConfig.js 설정 옵션
```js
{
  bounce: 'bounce',           // 메인 바운스 타입 (기본 'bounce', 'wobble', 'soft', 'float' 등)
  pivotY: 'bottom',           // 바운스 그룹 피봇 Y (기본 'bottom', '%'값 가능)
  subs: ['type', ...],        // 서브별 애니메이션 타입
  subPivots: ['x% y%', ...],  // 서브별 피봇 (null=기본, 단일값='center {v}', 2값=그대로)
  subDelays: [0.1, ...],      // 서브별 딜레이 초 (null=자동 스태거)
  subDetach: [true, ...],     // true=바운스 그룹 밖 독립 움직임
  subBehind: [true, ...],     // true=접시보다 뒤에 렌더링
  subUnderMain: [true, ...],  // true=접시 위·메인 뒤 (바운스 그룹 안)
}
```

## 사용 가능한 애니메이션 타입
| 타입 | 설명 | 변형 |
|------|------|------|
| `jelly` | scaleY+scaleX+skewX 탱글 (기본) | — |
| `sway` | skewX 바닥고정 찰랑 (±0.6°) | `sway-sm`, `sway-lg`, `sway-xl`, `sway-sm2` |
| `sync` | 메인 바운스 동기화 | `sync-sm` (0.8배), `sync-fast` (0.8배) |
| `hover` | translateY 미세 부유 | `hover-lg` (1.3배) |
| `breathe` | scaleY 부풀기 | `breathe-lg` (1.3배) |
| `pulse` | opacity 반짝 | — |
| `twinkle` | 반짝임 — 피봇(반짝임 중심)에서 opacity·scale·rotate | — |
| `drift` | translateX 좌우 이동 | — |
| `drift-scale` | 좌우 이동 + 균일 크기 변화 | — |

## 메인 바운스 타입 (`bounce` 옵션)
| 타입 | 설명 |
|------|------|
| `bounce` | 기본 2단 바운스 (scaleY 기반, 강→약) |
| `wobble` | scaleX↔scaleY 교차 변형 (말랑 젤리) |
| `soft` | scaleY만 부드럽게 부풀기 (무스/구름용) |
| `float` | translateY + 미세 scaleY (구름 부유) |

## 애니메이션 원칙
- 음식이므로 과한 움직임 금지
- 메인 바운스: scaleY 기반, bottom 앵커, 2단 바운스 (강→약)
- 서브: 바닥 고정 원칙, rotate 기반 찰랑거림 권장 (skewX보다 자연스러움)
- 늘어남→원상복귀는 ease-out으로 느리게 (자연스러운 탄성)
- detach된 서브는 메인 바운스와 독립적으로 움직임


## 튜닝

디저트별 진행 = `TUNING_TODO.md`.

1. `main`에서 직접 작업 (브랜치 분리 없음)
2. `npm run dev` → http://localhost:5173/SY_Prj/ 에서 프리뷰
3. 도감(DessertBook)에서 해당 디저트 클릭하여 크게 보면서 레이어 이미지 확인 (Read tool로 각 서브 확인)
4. `dessertLayerConfig.js`에 해당 디저트 설정 추가
5. 필요시 `src/index.css`에 새 애니메이션 타입 추가
6. 사용자와 실시간으로 수치 조정 반복
