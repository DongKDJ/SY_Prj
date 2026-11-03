/**
 * 문장마다 줄을 바꿔 보여 준다 (2026-11-04 대표 "문장 중앙에서 줄 바뀌는 게 어색함").
 * 한 문장이 화면 폭보다 길면 그 문장 안에서만 접히고, 접힐 때 줄 길이를 고르게(text-wrap: balance) 맞춘다.
 * quote: 첫 문장 앞·마지막 문장 뒤에 큰따옴표.
 */
export default function Sentences({ text, quote = false }) {
  const parts = String(text ?? '').split(/(?<=[.!?])\s+/).filter(Boolean)
  return parts.map((s, i) => (
    <span key={i} className="block text-balance">
      {quote && i === 0 ? '“' : ''}
      {s}
      {quote && i === parts.length - 1 ? '”' : ''}
    </span>
  ))
}
