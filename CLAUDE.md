# CLAUDE.md

"여우씨의 디저트 레시피" — 4단계 카드 선택으로 16가지 디저트 결과를 보여주는 인터랙티브 성격 테스트 웹앱.

## 스택·명령

- React 19 + Vite 8 · Tailwind CSS 4(@tailwindcss/vite) · Framer Motion · Pretendard / Gowun Batang(`.font-display`) / Caveat(`.font-script`)
- 사운드 없음 — 무음 유지(고정)
- `npm run dev`(http://localhost:5173/SY_Prj/) · `npm run build`(dist/) · `npm run preview` · `npm run lint`

## 구조

- 화면 흐름 = `useGameState`: `title → dialog → stage1~4 → resultTransition → result → dessertBook`. 뒤로 가기 = `prevScreen` + `BACK_TO` 맵.
- 데이터 = `src/data/desserts.js`(stages 4문항 · dessertResults 16조합(카드 ID 키) · foxDialogs).
- 이미지 = `src/assets/images/` — `character/`(여우씨 레이어) · `cards/` · `desserts/`(+`layers/`) · `screens/`(원화 레이어). 같은 파일명으로 교체.
- 브랜치 = `main` 단일(분기 안 함). `main` push → GitHub Actions 자동 배포(정본: 메모리 `deploy-mechanism`).

## 스킬 — 그 영역을 건드릴 때 연다

| 하려는 일 | 스킬 |
|---|---|
| 디저트 레이어 애니메이션·튜닝·작가 수정본 반영 | `dessert-animation` |
| 원화 화면·타이틀·이전 버튼·여우씨 캐릭터·장식·색·CSS 유틸리티 | `art-screens` |

## 불변 규칙

1. 읽기/쓰기 허용 확장자 = `.jsx` `.js` `.css` `.html` `.json` `.md`. 이미지(.png·.svg 등)는 읽기 전용 — 수정·삭제는 사용자 명시 허락 후(고정).
2. ⚠️ Tailwind 클래스를 동적 보간(`text-${var}`)하지 말 것 — v4가 감지 못 한다. 정적 키 매핑만.
3. 원화 좌표·크기는 작가 지정값(3840x2160 캔버스 기준) — 임의로 옮기지 않는다. 세로 화면은 16:9 중앙 크롭(고정).
4. 음식이므로 과한 움직임 금지.
5. 레이어 순서를 고치면 파일만 보지 말고 실제 DOM 순서(`dessert-wrap` 안 `<img>` src)를 확인한다.
