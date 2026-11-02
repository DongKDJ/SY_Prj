import foxBody from '../assets/images/character/fox-body.png'

/**
 * 포토부스 스티커 — 원화 파스텔 팔레트의 손그림 SVG(크림색 테두리 = 스티커 종이 느낌) + 여우씨.
 * 전부 <img>로 그리므로 화면과 캔버스 합성(composePhoto)이 같은 이미지를 쓴다.
 * SVG는 width/height를 적어야 <img>의 naturalWidth가 잡혀 캔버스에 그려진다.
 *
 * w: 사진 영역 폭 대비 스티커 폭(소수), tilt: 붙일 때 기울기 범위(도)
 */
const svg = (body, size = 100) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">${body}</svg>`,
  )}`

const EDGE = 'stroke="#FFF8EC" stroke-width="6" stroke-linejoin="round" paint-order="stroke"'

export const stickers = [
  {
    id: 'heart', label: '하트', w: 0.11, tilt: 14,
    src: svg(`<path d="M50 88 C 20 66, 6 48, 10 30 C 14 14, 34 10, 50 28 C 66 10, 86 14, 90 30 C 94 48, 80 66, 50 88 Z" fill="#E58FA0" ${EDGE}/>
      <ellipse cx="34" cy="32" rx="7" ry="4" fill="#FFF1F3" opacity="0.8"/>`),
  },
  {
    id: 'star', label: '별', w: 0.11, tilt: 18,
    src: svg(`<path d="M50 6 L62 36 L94 38 L69 58 L77 90 L50 72 L23 90 L31 58 L6 38 L38 36 Z" fill="#EFD38C" ${EDGE}/>
      <path d="M50 6 L62 36 L94 38 L69 58 L77 90 L50 72 L23 90 L31 58 L6 38 L38 36 Z" fill="none" stroke="#CFA24E" stroke-width="2"/>`),
  },
  {
    id: 'sparkle', label: '반짝', w: 0.09, tilt: 20,
    src: svg(`<path d="M50 4 L58 42 L96 50 L58 58 L50 96 L42 58 L4 50 L42 42 Z" fill="#FFF1BE" ${EDGE}/>
      <path d="M50 4 L58 42 L96 50 L58 58 L50 96 L42 58 L4 50 L42 42 Z" fill="none" stroke="#D6A64A" stroke-width="2"/>`),
  },
  {
    id: 'flower', label: '꽃', w: 0.11, tilt: 25,
    src: svg(`<g fill="#F4BCC8" ${EDGE}>
      <ellipse cx="50" cy="24" rx="13" ry="20"/><ellipse cx="50" cy="24" rx="13" ry="20" transform="rotate(72 50 50)"/>
      <ellipse cx="50" cy="24" rx="13" ry="20" transform="rotate(144 50 50)"/><ellipse cx="50" cy="24" rx="13" ry="20" transform="rotate(216 50 50)"/>
      <ellipse cx="50" cy="24" rx="13" ry="20" transform="rotate(288 50 50)"/></g>
      <circle cx="50" cy="50" r="11" fill="#EFD38C" stroke="#FFF8EC" stroke-width="3"/>`),
  },
  {
    id: 'cloud', label: '구름', w: 0.14, tilt: 6,
    src: svg(`<path d="M28 76 C 12 76, 8 58, 22 52 C 18 36, 40 28, 48 40 C 54 24, 82 28, 80 48 C 94 50, 94 76, 76 76 Z" fill="#DDF2FA" ${EDGE}/>
      <path d="M28 76 C 12 76, 8 58, 22 52 C 18 36, 40 28, 48 40 C 54 24, 82 28, 80 48 C 94 50, 94 76, 76 76 Z" fill="none" stroke="#8BCFE6" stroke-width="2"/>`),
  },
  {
    id: 'ribbon', label: '리본', w: 0.13, tilt: 12,
    src: svg(`<g fill="#E58FA0" ${EDGE}>
      <path d="M50 50 C 30 30, 6 30, 8 50 C 6 70, 30 70, 50 50 Z"/>
      <path d="M50 50 C 70 30, 94 30, 92 50 C 94 70, 70 70, 50 50 Z"/>
      <path d="M44 56 L 36 86 L 50 78 L 64 86 L 56 56 Z"/></g>
      <circle cx="50" cy="50" r="8" fill="#C2546A" stroke="#FFF8EC" stroke-width="3"/>`),
  },
  {
    id: 'crown', label: '왕관', w: 0.12, tilt: 8,
    src: svg(`<path d="M12 78 L 8 30 L 32 52 L 50 18 L 68 52 L 92 30 L 88 78 Z" fill="#F6DE8D" ${EDGE}/>
      <path d="M12 78 L 8 30 L 32 52 L 50 18 L 68 52 L 92 30 L 88 78 Z" fill="none" stroke="#B98A34" stroke-width="2"/>
      <circle cx="30" cy="66" r="4" fill="#E58FA0"/><circle cx="50" cy="64" r="4" fill="#8BCFE6"/><circle cx="70" cy="66" r="4" fill="#B5DBC0"/>`),
  },
  {
    id: 'strawberry', label: '딸기', w: 0.1, tilt: 20,
    src: svg(`<path d="M50 92 C 24 80, 14 56, 20 40 C 26 26, 44 24, 50 32 C 56 24, 74 26, 80 40 C 86 56, 76 80, 50 92 Z" fill="#E86A80" ${EDGE}/>
      <path d="M36 30 L 28 14 L 44 24 L 50 8 L 56 24 L 72 14 L 64 30 Z" fill="#6FA986" stroke="#FFF8EC" stroke-width="4" stroke-linejoin="round" paint-order="stroke"/>
      <g fill="#FFF1BE"><circle cx="38" cy="50" r="2.5"/><circle cx="54" cy="46" r="2.5"/><circle cx="46" cy="64" r="2.5"/><circle cx="62" cy="60" r="2.5"/><circle cx="52" cy="78" r="2.5"/></g>`),
  },
  {
    id: 'apple', label: '사과', w: 0.1, tilt: 20,
    src: svg(`<path d="M50 30 C 34 14, 8 24, 12 52 C 16 76, 34 92, 50 86 C 66 92, 84 76, 88 52 C 92 24, 66 14, 50 30 Z" fill="#F08C8C" ${EDGE}/>
      <path d="M50 30 C 52 20, 54 14, 60 8" fill="none" stroke="#A0724E" stroke-width="5" stroke-linecap="round"/>
      <path d="M56 22 C 64 10, 80 12, 78 22 C 70 30, 60 28, 56 22 Z" fill="#6FA986" stroke="#FFF8EC" stroke-width="3"/>
      <ellipse cx="32" cy="46" rx="8" ry="5" fill="#FFF1F3" opacity="0.7"/>`),
  },
  {
    id: 'bubble', label: '말풍선', w: 0.13, tilt: 6,
    src: svg(`<path d="M14 20 Q 14 10, 24 10 L 76 10 Q 86 10, 86 20 L 86 58 Q 86 68, 76 68 L 44 68 L 26 86 L 30 68 L 24 68 Q 14 68, 14 58 Z" fill="#FFFAEA" ${EDGE}/>
      <path d="M14 20 Q 14 10, 24 10 L 76 10 Q 86 10, 86 20 L 86 58 Q 86 68, 76 68 L 44 68 L 26 86 L 30 68 L 24 68 Q 14 68, 14 58 Z" fill="none" stroke="#CFA24E" stroke-width="2"/>
      <g fill="#C2546A"><circle cx="36" cy="40" r="5"/><circle cx="50" cy="40" r="5"/><circle cx="64" cy="40" r="5"/></g>`),
  },
  {
    id: 'fox', label: '여우씨', w: 0.26, tilt: 5, src: foxBody,
  },
]
