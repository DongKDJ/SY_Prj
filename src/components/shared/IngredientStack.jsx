import { motion } from 'framer-motion'
import { stages } from '../../data/desserts'
import { getCardImage } from '../../assets/imageMap'
import { MaskingTape } from './Decorations'

/* 카드 위치 (단계 누적 별) */
const cardLayouts = [
  [{ x: 0,   y: 0,   rotate: -6, tape: 'honey' }],
  [
    { x: -32, y: 10,  rotate: -8, tape: 'honey' },
    { x: 32,  y: -10, rotate: 9,  tape: 'jam' },
  ],
  [
    { x: -42, y: -8,  rotate: -7, tape: 'honey' },
    { x: 12,  y: 14,  rotate: 5,  tape: 'sage' },
    { x: 56,  y: -16, rotate: -11, tape: 'jam' },
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
                       w-24 h-32 md:w-28 md:h-40"
            style={{ zIndex: 10 + i }}
          >
            {/* 폴라로이드 */}
            <div className="relative w-full h-full bg-[#FBF3E3] p-1.5 pb-7
                            shadow-[0_10px_18px_-10px_rgba(58,36,24,0.55)]
                            border border-paper-edge">
              <MaskingTape
                className="absolute -top-2 left-1/2 -translate-x-1/2"
                width={48} rotate={pos.rotate * -0.7} tone={pos.tape}
              />
              <div className="w-full h-full bg-[#F3E2C2] overflow-hidden
                              flex items-center justify-center">
                {cardImg ? (
                  <img src={cardImg} alt={card.ingredient}
                       className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl md:text-4xl">{card.ingredientEmoji}</span>
                )}
              </div>
              {/* 폴라로이드 캡션 */}
              <div className="absolute bottom-1 left-0 right-0 text-center px-1">
                <p className="font-script text-[10px] text-jam leading-none">
                  {card.stageLabel}
                </p>
                <p className="font-display text-[10px] md:text-xs text-ink font-bold leading-tight mt-0.5">
                  {card.ingredient}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
