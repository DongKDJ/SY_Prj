import { motion } from 'framer-motion'

/**
 * 원화 결 알약 버튼 — 금장 테두리(원화 금장 프레임과 같은 금색) + 파스텔 속 + 원화 갈색 글씨.
 * 레시피 노트 잔향(명조 라벨 + 손글씨 서브)은 그대로.
 *
 * props:
 *  - children : 메인 라벨
 *  - sub      : 버튼 아래 손글씨 서브라벨 (선택)
 *  - size     : 'sm' | 'md' | 'lg'
 *  - tone     : 'ink'(버터, 주 버튼) | 'jam'(장밋빛) | 'sage' · 'honey'(민트, 보조) — 이름은 옛 토큰을 유지
 *  - arrow    : 끝 화살표 표시 (기본 true)
 *  - 나머지(onClick, initial, animate, transition...)는 motion.button으로 전달
 */
const tones = {
  ink:   'btn-art btn-art-butter',
  jam:   'btn-art btn-art-rose',
  sage:  'btn-art btn-art-mint',
  honey: 'btn-art btn-art-mint',
}

export function InkButton({
  children, sub, size = 'md', tone = 'ink', arrow = true, className = '', ...rest
}) {
  const sz = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-8 py-3.5 text-lg',
    lg: 'px-10 py-4 text-xl',
  }[size]
  const tn = tones[tone] || tones.ink

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`group inline-flex flex-col items-center cursor-pointer ${className}`}
      {...rest}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full ${tn}
                    font-display font-bold ${sz}`}
      >
        {children}
        {arrow && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        )}
      </span>
      {sub && (
        <span className="font-script text-base text-ink/60 mt-2 select-none
                         drop-shadow-[0_1px_3px_rgba(255,248,236,0.9)]">{sub}</span>
      )}
    </motion.button>
  )
}
