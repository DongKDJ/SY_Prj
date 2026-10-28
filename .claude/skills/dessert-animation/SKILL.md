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
  **번호 순서는 같은 슬롯 안에서만 유효** — 렌더는 behind(접시 뒤) → 접시 → 백 → under → 메인 → group → detach 순이라
  `subDetach` 서브는 번호가 낮아도 group 서브를 항상 덮는다. detach 서브 위에 얹힌 장식은 그것도 detach로 뺄 것.
  슬롯 플래그는 **z 순서만** 정한다 — 움직임은 `subOn`(얹힌 대상)이 정한다.
  파일만 바꾸지 말고 **실제 DOM 순서를 확인** — 스크린샷 또는 `dessert-wrap` 안 `<img>` src 나열

## dessertLayerConfig.js 설정 옵션

**원칙: 모든 파츠는 뿌리(닿는 면)가 고정된다** (2026-10-28 사용자 지시). 축 = 접점, 얹힌 파츠는 받치는 파츠의 움직임을 물려받는다.

```js
{
  bounce: 'soft',                // 메인 타입 — 'bounce' | 'wobble' | 'soft' | 'crisp' (전부 접점 축 scale, translate 금지)
  mainPivots: ['49% 80%', ...],  // 메인별 바닥 접점 'x% y%' = 바운스 축. 한 덩어리 메인 여러 장이면 같은 값
  backPivot: '39% 58%',          // 백 레이어 접점 (백은 첫 메인을 따른다)
  subs: ['type', ...],           // 서브별 애니메이션 타입
  subPivots: ['x% y%', ...],     // 서브별 접점(뿌리) — 닿거나 꽂힌 자리. 공중 장식만 제 중심
  subOn: ['main', ...],          // 얹힌 대상: 'plate' | 'main' | 'main2' | 'sub1'~ | 'air'(공중 장식)
  subDelays: [0.1, ...],         // 서브별 딜레이 초 (null=자동 스태거)
  subDetach / subBehind / subUnderMain: [true, ...],  // z 순서 플래그
}
```

- 렌더 = `AnimatedDessert.jsx` `Moving` — 얹힌 대상의 움직임 고리(같은 클래스·축·딜레이)를 바깥부터 겹겹이 감싸서 프레임 단위로 같이 움직인다.
- 접점 찾기: 레이어 알파의 맨 아래 띠 = 접점, 그 띠와 겹치는 아래층 = 얹힌 대상. 자동 계산 후 그림으로 확인(공중 장식·꽂힌 웨하스처럼 판단이 필요한 것만 손으로).
- 검증: 16종 동시 마운트 → 여러 시점 스크린샷 → 프레임 차이 히트맵. 접점·접시 쪽이 어두우면(안 움직임) 고정된 것.

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
| `crisp` | 접점 고정, 숨 쉬듯 1% — 바삭한 구움과자·유리잔 (옛 float = 통째로 떠오름은 폐기) |
| (썸네일) | 도감 그리드는 메인 타입 대신 `dessert-soft-sm` (16종 동시라 가장 얌전하게) |

## 애니메이션 원칙
- 음식이므로 과한 움직임 금지
- 메인 바운스: scaleY 기반, 제 바닥 접점(mainPivots) 앵커 — 캔버스 아래 끝이 아니다
- 서브: 뿌리 고정 — 접점 축, rotate 기반 찰랑거림 권장 (skewX보다 자연스러움). translate(hover·drift)는 공중 장식에만
- 늘어남→원상복귀는 ease-out으로 느리게 (자연스러운 탄성)
- 접시·테이블에 놓인 서브는 `subOn: 'plate'` — 디저트 바운스를 따르지 않는다


## 튜닝

디저트별 진행 = `TUNING_TODO.md`.

1. `main`에서 직접 작업 (브랜치 분리 없음)
2. `npm run dev` → http://localhost:5173/SY_Prj/ 에서 프리뷰
3. 도감(DessertBook)에서 해당 디저트 클릭하여 크게 보면서 레이어 이미지 확인 (Read tool로 각 서브 확인)
4. `dessertLayerConfig.js`에 해당 디저트 설정 추가
5. 필요시 `src/index.css`에 새 애니메이션 타입 추가
6. 사용자와 실시간으로 수치 조정 반복
