/**
 * 문장·쉼표마다 줄을 바꿔 보여 준다 (2026-11-04 대표 "문장 중앙에서 줄 바뀌는 게 어색함",
 * 같은 날 "한 문장이라도 쉼표가 있으면 거기서 줄을 바꿔 달라").
 * 한 마디가 화면 폭보다 길 때만 그 안에서 띄어쓰기 자리로 접히고(word-break: keep-all, index.css),
 * 접힐 때 줄 길이를 고르게(text-wrap: balance) 맞춘다.
 * quote: 첫 마디 앞·마지막 마디 뒤에 큰따옴표.
 */
export default function Sentences({ text, quote = false }) {
  // 세 글자 이하 조각("앗," 같은 감탄)은 혼자 한 줄이 되면 어색해서 다음 조각에 붙인다
  // 뒤돌아보기(?<=) 정규식은 사파리 16.3 이하가 파일 전체를 못 읽어 앱이 하얗게 멈춘다(2026-11-09 아이맥) — 구분 문자를 끼워 넣고 자른다
  const parts = String(text ?? '').replace(/([.!?,…])\s+/g, '$1\u0000').split('\u0000').filter(Boolean)
    .reduce((acc, s) => { if (acc.length && acc[acc.length - 1].length <= 3) acc[acc.length - 1] += ' ' + s; else acc.push(s); return acc }, [])
  return parts.map((s, i) => (
    <span key={i} className="block text-balance">
      {quote && i === 0 ? '“' : ''}
      {s}
      {quote && i === parts.length - 1 ? '”' : ''}
    </span>
  ))
}
