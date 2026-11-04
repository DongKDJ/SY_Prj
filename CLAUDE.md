# CLAUDE.md

"여우씨의 디저트 레시피" — 4단계 카드 선택으로 16가지 디저트 결과를 보여주는 인터랙티브 성격 테스트 웹앱.

## 스택·명령

- React 19 + Vite 8 · Tailwind CSS 4(@tailwindcss/vite) · Framer Motion · Pretendard / Gowun Batang(`.font-display`) / Caveat(`.font-script`)
- 소리 = 배경음악·버튼 클릭음·카드 뒤집힘·책갈피 넘김·카드 결과(spell)·최종 결과(fanfare)·여우 대사 블립 효과음(2026-11-04 대표 지시로 무음 고정 해제). `lib/sound.js`, 음원 `src/assets/audio/{bgm,click,flip-1,flip-2,page-1~3,spell,fanfare,blip-1~8}.mp3`(page·blip = 대표 지정 한 파일을 조각내 무작위)(Pixabay Content License — 음원 파일만 따로 배포 금지). 배경음악은 열리자마자 시도하고 브라우저가 막으면 첫 터치에서 시작. 음원은 파일 자체를 -18 LUFS(ASWG-R001 휴대기기)로 평탄화해 두었다 — 교체하면 다시 잴 것(`sound.js` 주석). 오른쪽 아래 소리 끄기 버튼(`SoundToggle`). 소리 없는 버튼은 `data-sfx="none"`.
- `npm run dev`(http://localhost:5173/SY_Prj/) · `npm run build`(dist/) · `npm run preview` · `npm run lint`

## 구조

- 화면 흐름 = `useGameState`: `title → dialog → stage1~4 → resultTransition → result → dessertBook`. 뒤로 가기 = `prevScreen` + `BACK_TO` 맵. 결과 펼친 책·디저트 북(디저트 도감 | 카드 도감 두 탭)은 `shared/BookUi.jsx`(금테 카드·조합+고른 카드 4장·확대 보기 `CardLightbox`·도형 아이콘 버튼) 공용 — 카드·디저트는 어디서든 누르면 크게, 바깥 탭·Esc·이전으로 닫힘. 영어 손글씨 캡션은 2026-11-05 전부 제거(새로 넣지 말 것). 도장 = `images/ui/stamp-soyo.png`를 `.stamp-ink` 마스크로(파일 무수정). 곁가지 `result → photo`(`PhotoScreen`): 전체화면 카메라 거울 + 금장 테두리 + 디저트 장식 + 스티커 트레이(`data/stickers.js`), 찰칵 → UI 숨김 → 카운트다운 → 합성(`lib/composePhoto.js`). 저장 = 아이폰·아이패드 공유 시트, 그 외 다운로드. `?kiosk=1`(전시 PC)은 저장 + 미러샷 안내를 함께 — 전시 PC 다운로드 폴더에 쌓인다. 닫기는 펼친 책 페이지로(`App` `resultPhase`). 카메라는 https에서만 켜진다.
- 데이터 = `src/data/desserts.js`(stages 4문항 · dessertResults 16조합(카드 ID 키) · foxDialogs).
- 이미지 = `src/assets/images/` — `character/`(여우씨 레이어) · `cards/` · `desserts/`(+`layers/`) · `screens/`(원화 레이어). 같은 파일명으로 교체.
- 오프라인 = 배포본만 서비스 워커(`vite.sw.js`가 빌드 때 `sw.js` 생성, 등록은 `main.jsx`): 화면은 인터넷 먼저·끊기면 저장본, 해시 파일은 저장본 먼저. `?kiosk=1`은 페이지가 `precache.json` 목록을 하나씩 요청해 전체(약 33MB)를 미리 저장 → 전시장 와이파이가 끊겨도 열린다. 미리 저장을 워커 안 긴 작업으로 돌리지 말 것(새 판 워커가 못 넘겨받아 새로고침이 걸린다).
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
