/**
 * 문장·쉼표마다 줄을 바꿔 보여 준다 (2026-11-04 대표 "문장 중앙에서 줄 바뀌는 게 어색함",
 * 같은 날 "한 문장이라도 쉼표가 있으면 거기서 줄을 바꿔 달라").
 * 한 마디가 화면 폭보다 길 때만 그 안에서 띄어쓰기 자리로 접히고(word-break: keep-all, index.css),
 * 접힐 때 줄 길이를 고르게(text-wrap: balance) 맞춘다.
 * quote: 첫 마디 앞·마지막 마디 뒤에 큰따옴표.
 */
export default function Sentences({ text, quote = false }) {
  const parts = String(text ?? '').split(/(?<=[.!?,…])\s+/).filter(Boolean)
  return parts.map((s, i) => (
    <span key={i} className="block text-balance">
      {quote && i === 0 ? '“' : ''}
      {s}
      {quote && i === parts.length - 1 ? '”' : ''}
    </span>
  ))
}
