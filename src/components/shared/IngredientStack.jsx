import { motion } from 'framer-motion'
import { stages } from '../../data/desserts'
import { getCardImage } from '../../assets/imageMap'

const cardLayouts = [
  [{ x: 0, y: 0, rotate: -5 }],
  [
    { x: -30, y: 10, rotate: -8 },
    { x: 30, y: -10, rotate: 12 },
  ],
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
        const cardImg = getCardImage(card.backImage)
        return (
          <motion.div
            key={card.id}
            initial={{ scale: 0, rotate: 0, y: -60, opacity: 0 }}
            animate={{ scale: 1, rotate: pos.rotate, x: pos.x, y: pos.y, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.4 + i * 0.25 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-24 h-34 md:w-28 md:h-40"
            style={{ zIndex: 10 + i }}
          >
            <div className="w-full h-full bg-card rounded-xl border-2 border-cabin/20
                            shadow-xl overflow-hidden flex flex-col">
              <div className="flex-1 w-full bg-cream-dark/30 flex items-center justify-center overflow-hidden">
                {cardImg ? (
                  <img src={cardImg} alt={card.ingredient} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl md:text-4xl">{card.ingredientEmoji}</span>
                )}
              </div>
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
