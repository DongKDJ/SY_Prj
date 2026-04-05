import { motion } from 'framer-motion'
import { stages } from '../../data/desserts'

// 카드 배치: 탁자 중앙에 하나씩 놓이는 느낌
// 각 카드는 약간씩 다른 위치와 각도로 겹침
const cardLayouts = [
  // 1장 (2단계에서 보임)
  [
    { x: 0, y: 0, rotate: -5 },
  ],
  // 2장 (3단계에서 보임)
  [
    { x: -30, y: 10, rotate: -8 },
    { x: 30, y: -10, rotate: 12 },
  ],
  // 3장 (4단계에서 보임)
  [
    { x: -20, y: -15, rotate: -6 },
    { x: 25, y: 20, rotate: 14 },
    { x: 55, y: -8, rotate: -10 },
  ],
]

export default function IngredientStack({ selections }) {
  if (selections.length === 0) return null

  const selected = selections.map((cardId, stageIdx) => {
    const stage = stages[stageIdx]
    const card = stage.cards.find(c => c.id === cardId)
    return { ...card, stageLabel: `${stageIdx + 1}단계` }
  }).filter(Boolean)

  const layout = cardLayouts[Math.min(selected.length, 3) - 1]

  return (
    <div className="relative w-72 h-52 md:w-96 md:h-64">
      {selected.map((card, i) => {
        const pos = layout[i]
        return (
          <motion.div
            key={card.id}
            initial={{ scale: 0, rotate: 0, y: -60, opacity: 0 }}
            animate={{
              scale: 1,
              rotate: pos.rotate,
              x: pos.x,
              y: pos.y,
              opacity: 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 14,
              delay: 0.4 + i * 0.25,
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-24 h-34 md:w-28 md:h-40"
            style={{ zIndex: 10 + i }}
          >
            <div className="w-full h-full bg-card rounded-xl border-2 border-cabin/20
                            shadow-xl flex flex-col items-center justify-center
                            overflow-hidden">
              {/* 카드 상단 - 이미지 영역 (나중에 PNG 교체) */}
              <div className="flex-1 w-full bg-cream-dark/30 flex items-center justify-center">
                <span className="text-3xl md:text-4xl">{card.ingredientEmoji}</span>
              </div>
              {/* 카드 하단 - 라벨 */}
              <div className="w-full px-2 py-2 bg-white/70 text-center">
                <p className="text-[9px] text-cabin/70 font-semibold">{card.stageLabel}</p>
                <p className="text-xs md:text-sm font-bold text-brown leading-tight">{card.ingredient}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
