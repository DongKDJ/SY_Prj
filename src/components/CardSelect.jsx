import { useState } from 'react'
import { motion } from 'framer-motion'
import StarParticles from './shared/StarParticles'
import { getCardImage } from '../assets/imageMap'

export default function CardSelect({ stage, onSelect, dark = false }) {
  const [selectedId, setSelectedId] = useState(null)
  const [flippedId, setFlippedId] = useState(null)

  const textColor = dark ? 'text-cream' : 'text-brown'

  const handlePick = (card) => {
    if (selectedId) return
    setSelectedId(card.id)
    setTimeout(() => setFlippedId(card.id), 500)
    setTimeout(() => onSelect(card.id), 1800)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* 질문 배너 */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' }}
        className={`${dark ? 'bg-cream/15 backdrop-blur-sm' : 'bg-cabin/80'}
                   text-cream rounded-2xl px-6 py-4 text-center mb-10`}
      >
        <p className="text-xs opacity-60 mb-1">{stage.bookmark} — {stage.element}</p>
        <p className="font-semibold text-sm md:text-base">{stage.title}</p>
      </motion.div>

      {/* 카드 2장 */}
      <div className="flex justify-center gap-5 md:gap-10">
        {stage.cards.map((card, i) => {
          const isSelected = selectedId === card.id
          const isOther = selectedId && !isSelected
          const isFlipped = flippedId === card.id
          const backImg = getCardImage(card.backImage)

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isOther ? 0.2 : 1,
                y: 0,
                scale: isOther ? 0.85 : 1,
              }}
              transition={{ delay: 0.2 + i * 0.15, type: 'spring' }}
              className="relative"
            >
              <button
                className={`perspective w-36 h-52 md:w-44 md:h-64 cursor-pointer
                           ${isSelected && !isFlipped ? 'card-glow' : ''}`}
                onClick={() => handlePick(card)}
                disabled={!!selectedId}
              >
                <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
                  {/* 뒷면 (처음 보이는 면) — 설명 카드 */}
                  <div className="card-face bg-card border-2 border-cabin/20
                                  flex flex-col items-center justify-center p-2 shadow-lg">
                    <div className="w-full h-full rounded-xl overflow-hidden
                                    flex flex-col items-center justify-center relative">
                      {backImg ? (
                        <img src={backImg} alt={card.label}
                             className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-cream-dark flex flex-col
                                        items-center justify-center gap-2 p-2">
                          <span className="text-3xl">{card.emoji}</span>
                          <span className="text-sm font-bold text-brown">{card.label}</span>
                          <p className="text-[11px] text-brown-light/70 text-center leading-snug px-1">
                            {card.brief}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 앞면 (뒤집힌 후) — 재료 카드 */}
                  <div className="card-face card-face-front bg-card border-2 border-cabin
                                  flex flex-col items-center justify-center p-2 shadow-xl">
                    <div className="w-full h-full rounded-xl overflow-hidden
                                    flex flex-col items-center justify-center">
                      {backImg ? (
                        /* 앞면도 같은 카드 이미지 사용 — 나중에 frontImage로 분리 가능 */
                        <img src={backImg} alt={card.ingredient}
                             className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-cream flex flex-col
                                        items-center justify-center gap-3">
                          <span className="text-5xl">{card.ingredientEmoji}</span>
                          <span className="text-base font-bold text-brown">{card.ingredient}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 별 파티클 */}
                <StarParticles active={isSelected} count={15} />
              </button>

              {/* 카드 라벨 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isOther ? 0.3 : 0.7 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`text-center text-xs mt-3 ${textColor}`}
              >
                {card.label}
              </motion.p>
            </motion.div>
          )
        })}
      </div>

      {!selectedId && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.8 }}
          className={`text-center text-xs ${textColor} mt-8`}
        >
          카드를 탭하여 선택하세요
        </motion.p>
      )}
    </div>
  )
}
