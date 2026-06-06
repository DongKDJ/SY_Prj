import { motion } from 'framer-motion'

/**
 * 심플 알약형 버튼 — 종이 위에 잉크로 찍은 느낌.
 * 왁스 씰 도장을 대체한다. 레시피 노트 잔향(명조 라벨 + 손글씨 서브)은 옅게 유지.
 *
 * props:
 *  - children : 메인 라벨
 *  - sub      : 버튼 아래 손글씨 서브라벨 (선택)
 *  - size     : 'sm' | 'md' | 'lg'
 *  - tone     : 'ink' | 'jam' | 'sage' | 'honey' (기본 ink)
 *  - arrow    : 끝 화살표 표시 (기본 true)
 *  - 나머지(onClick, initial, animate, transition...)는 motion.button으로 전달
 */
const tones = {
  ink:   'bg-ink text-cream group-hover:bg-brown',
  jam:   'bg-jam text-cream group-hover:bg-jam-soft',
  sage:  'bg-sage text-cream group-hover:bg-sage-soft',
  honey: 'bg-honey text-ink group-hover:bg-honey-soft',
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
                    font-display font-bold ${sz}
                    shadow-[0_12px_26px_-14px_rgba(58,36,24,0.7)]
                    transition-colors duration-300`}
      >
        {children}
        {arrow && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        )}
      </span>
      {sub && (
        <span className="font-script text-base text-ink/45 mt-2 select-none">{sub}</span>
      )}
    </motion.button>
  )
}
