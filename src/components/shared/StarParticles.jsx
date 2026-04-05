import { useEffect, useState } from 'react'

const STAR_CHARS = ['✦', '✧', '⭑', '★', '·']
const COLORS = [
  'text-yellow-300',
  'text-amber-300',
  'text-yellow-200',
  'text-orange-200',
  'text-white',
]

function createParticle(id) {
  const angle = Math.random() * Math.PI * 2
  const distance = 50 + Math.random() * 120
  return {
    id,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 10 + Math.random() * 20,
    delay: Math.random() * 0.6,
    duration: 0.8 + Math.random() * 0.8,
    char: STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

export default function StarParticles({ active, count = 18 }) {
  const [particles, setParticles] = useState([])
  const [wave, setWave] = useState(0)

  useEffect(() => {
    if (active) {
      // 첫 번째 파동
      setParticles(Array.from({ length: count }, (_, i) => createParticle(i)))
      // 두 번째 파동 (0.5초 후)
      const t = setTimeout(() => {
        setWave(1)
        setParticles(prev => [
          ...prev,
          ...Array.from({ length: Math.floor(count / 2) }, (_, i) =>
            createParticle(count + i)
          ),
        ])
      }, 500)
      return () => clearTimeout(t)
    } else {
      setParticles([])
      setWave(0)
    }
  }, [active, count])

  if (!active || particles.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
      {/* 중앙 글로우 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                      w-32 h-32 bg-yellow-200/30 rounded-full blur-2xl
                      animate-pulse" />

      {/* 별 파티클 */}
      {particles.map(p => (
        <span
          key={p.id}
          className={`star-particle absolute left-1/2 top-1/2 ${p.color}
                     drop-shadow-[0_0_6px_rgba(255,220,100,0.8)]`}
          style={{
            '--tx': `${p.x}px`,
            '--ty': `${p.y}px`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  )
}
