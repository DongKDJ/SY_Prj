/**
 * Storybook Recipe Journal — 손그림 SVG 장식 컴포넌트 모음
 *
 * 모두 currentColor를 사용하므로 text-* 클래스로 색을 지정.
 * 사용 예: <Divider className="text-jam w-32" />
 */

/* ── 다이아 + 점선 디바이더 ── */
export function Divider({ className = '', variant = 'diamond' }) {
  if (variant === 'wave') {
    return (
      <svg viewBox="0 0 120 12" className={className} fill="none" stroke="currentColor"
           strokeWidth="1.2" strokeLinecap="round">
        <path d="M2 6 Q 10 1, 18 6 T 34 6 T 50 6 T 66 6 T 82 6 T 98 6 T 118 6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 140 12" className={className} fill="none" stroke="currentColor"
         strokeWidth="1.1" strokeLinecap="round">
      <line x1="2" y1="6" x2="56" y2="6" strokeDasharray="2 4" />
      <g transform="translate(70 6)">
        <path d="M-8 0 L 0 -5 L 8 0 L 0 5 Z" fill="currentColor" stroke="none" />
        <circle cx="-14" cy="0" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="14"  cy="0" r="0.9" fill="currentColor" stroke="none" />
      </g>
      <line x1="84" y1="6" x2="138" y2="6" strokeDasharray="2 4" />
    </svg>
  )
}

/* ── 4꼭지 별 (sparkle) ── */
export function Sparkle({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 1 L13.5 10.5 L23 12 L13.5 13.5 L12 23 L10.5 13.5 L1 12 L10.5 10.5 Z" />
    </svg>
  )
}

/* ── 작은 꽃 (5장 꽃잎) ── */
export function Floret({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor">
      {[0, 72, 144, 216, 288].map(deg => (
        <ellipse key={deg} cx="16" cy="9" rx="3.4" ry="5.4"
                 transform={`rotate(${deg} 16 16)`} opacity="0.85" />
      ))}
      <circle cx="16" cy="16" r="2.4" fill="#FFF8F0" />
    </svg>
  )
}

/* ── 밀이삭 ── */
export function WheatSprig({ className = '', flip = false }) {
  return (
    <svg viewBox="0 0 60 110" className={className} fill="none"
         stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
         style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M30 105 Q 30 70, 30 10" />
      {[78, 64, 50, 36, 24].map((y, i) => (
        <g key={y}>
          <path d={`M30 ${y} Q ${20 - i} ${y - 4}, ${15 - i * 0.5} ${y - 10}`} />
          <path d={`M30 ${y} Q ${40 + i} ${y - 4}, ${45 + i * 0.5} ${y - 10}`} />
          <ellipse cx={15 - i * 0.5} cy={y - 10} rx="2.4" ry="4.2"
                   transform={`rotate(-20 ${15 - i * 0.5} ${y - 10})`} fill="currentColor" />
          <ellipse cx={45 + i * 0.5} cy={y - 10} rx="2.4" ry="4.2"
                   transform={`rotate(20 ${45 + i * 0.5} ${y - 10})`} fill="currentColor" />
        </g>
      ))}
      <ellipse cx="30" cy="14" rx="2.6" ry="5" fill="currentColor" />
    </svg>
  )
}

/* ── 코너 장식 (페이지 모서리) ── */
export function CornerOrnament({ className = '', corner = 'tl' }) {
  // tl/tr/bl/br
  const transforms = {
    tl: '',
    tr: 'scaleX(-1)',
    bl: 'scaleY(-1)',
    br: 'scale(-1,-1)',
  }
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none"
         stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
         style={{ transform: transforms[corner] }}>
      <path d="M8 8 L 8 28 M 8 8 L 28 8" />
      <path d="M 8 36 Q 14 30, 22 30" />
      <path d="M 36 8 Q 30 14, 30 22" />
      <circle cx="14" cy="14" r="1.6" fill="currentColor" />
      <path d="M22 22 L 26 22 M 24 20 L 24 24" strokeLinecap="round" />
    </svg>
  )
}

/* ── 왁스 씰 (도장) ── */
export function WaxSeal({
  children, className = '', size = 96, rotate = -4,
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <radialGradient id="wax" cx="40%" cy="35%" r="65%">
            <stop offset="0%"  stopColor="#C4495A" />
            <stop offset="55%" stopColor="#8B2E3F" />
            <stop offset="100%" stopColor="#5C1A28" />
          </radialGradient>
          <filter id="wax-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" />
            <feOffset dx="0" dy="2" />
            <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* 왁스의 불규칙한 외곽 */}
        <path
          d="M50 6 C 64 4, 78 14, 86 26 C 96 32, 96 48, 90 60
             C 94 72, 84 86, 70 90 C 60 96, 44 94, 32 88
             C 18 90, 8 76, 8 62 C 2 50, 8 36, 18 28
             C 24 14, 38 8, 50 6 Z"
          fill="url(#wax)"
          filter="url(#wax-shadow)"
        />
        {/* 광택 */}
        <ellipse cx="38" cy="30" rx="14" ry="7" fill="rgba(255,255,255,0.22)" />
      </svg>
      <div className="relative z-10 text-center text-cream font-display font-bold
                      leading-tight drop-shadow-sm select-none">
        {children}
      </div>
    </div>
  )
}

/* ── 마스킹 테이프 ── */
export function MaskingTape({
  className = '', width = 90, rotate = -6, tone = 'honey',
}) {
  const palette = {
    honey: 'rgba(212,162,76,0.55)',
    sage:  'rgba(122,138,111,0.45)',
    jam:   'rgba(184,88,112,0.45)',
    cream: 'rgba(255,248,240,0.7)',
  }
  return (
    <div
      className={`tape-settle ${className}`}
      style={{
        width,
        height: 22,
        background: palette[tone] || palette.honey,
        backgroundImage:
          `repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 10px)`,
        '--rot': `${rotate}deg`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 1px 2px rgba(58,36,24,0.18)',
      }}
    />
  )
}

/* ── 페이지 종이 결 ── */
export function PaperGrain({ className = '' }) {
  return <div className={`paper-grain ${className}`} aria-hidden />
}

/* ── 떠있는 작은 별/꽃잎 (배경 장식용) ── */
export function FloatingMotes({ count = 14, palette = ['jam', 'honey', 'sage'] }) {
  const shapes = ['star', 'floret', 'dot']
  // 결정적 난수
  const rand = (n) => {
    const x = Math.sin(n * 99.123) * 10000
    return x - Math.floor(x)
  }
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const shape = shapes[i % shapes.length]
        const color = palette[i % palette.length]
        const size = 8 + rand(i + 1) * 14
        const left = rand(i + 7) * 100
        const top  = rand(i + 11) * 100
        const dur  = 4 + rand(i + 3) * 4
        const delay = -rand(i + 5) * dur
        const dx = (rand(i + 17) - 0.5) * 24
        const dy = (rand(i + 19) - 0.5) * 24
        const dr = (rand(i + 23) - 0.5) * 40
        return (
          <span
            key={i}
            className={`absolute text-${color}/30 drift-float`}
            style={{
              left:  `${left}%`,
              top:   `${top}%`,
              width: size,
              height: size,
              '--dur':  `${dur}s`,
              '--dx':   `${dx}px`,
              '--dy':   `${dy}px`,
              '--dr':   `${dr}deg`,
              animationDelay: `${delay}s`,
            }}
          >
            {shape === 'star'   && <Sparkle  className="w-full h-full" />}
            {shape === 'floret' && <Floret   className="w-full h-full" />}
            {shape === 'dot'    && (
              <span className="block w-1.5 h-1.5 rounded-full bg-current mt-1 ml-1" />
            )}
          </span>
        )
      })}
    </div>
  )
}
