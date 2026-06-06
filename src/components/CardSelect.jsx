import { useState } from 'react'
import { motion } from 'framer-motion'
import StarParticles from './shared/StarParticles'
import { getCardImage } from '../assets/imageMap'
import {
  PaperGrain,
  Sparkle,
  MaskingTape,
} from './shared/Decorations'

/* accent 색 정적 매핑 (Tailwind 정적 클래스 보장) */
const accentMap = {
  honey: { text: 'text-honey', bg: 'bg-honey', border: 'border-honey', soft: 'bg-honey-soft/40' },
  sage:  { text: 'text-sage',  bg: 'bg-sage',  border: 'border-sage',  soft: 'bg-sage-soft/40' },
  jam:   { text: 'text-jam',   bg: 'bg-jam',   border: 'border-jam',   soft: 'bg-jam-soft/40' },
}

export default function CardSelect({ stage, onSelect, dark = false, accent = 'honey' }) {
  const [selectedId, setSelectedId] = useState(null)
  const [flippedId, setFlippedId] = useState(null)

  const a = accentMap[accent] || accentMap.honey
  const stageNum = String(stage.id).padStart(2, '0')

  const handlePick = (card) => {
    if (selectedId) return
    setSelectedId(card.id)
    setTimeout(() => setFlippedId(card.id), 500)
    setTimeout(() => onSelect(card.id), 1800)
  }

  return (
    <div className="w-full max-w-xl mx-auto relative z-10">
      {/* ── 질문 패널 (양피지 메모 톤) ── */}
      <motion.div
        initial={{ opacity: 0, y: -16, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 110, damping: 14 }}
        className="relative mx-auto mb-10 max-w-md"
      >
        <MaskingTape className="absolute -top-2.5 left-8" width={70} rotate={-9} tone="honey" />
        <MaskingTape className="absolute -top-2.5 right-8" width={70} rotate={8} tone="jam" />

        <div className={`relative bg-[#FBF3E3] rounded-md px-6 py-4
                         border border-paper-edge
                         shadow-[0_14px_28px_-14px_rgba(58,36,24,0.55)]`}>
          <PaperGrain />
          <div className="relative flex items-center gap-2 mb-1.5">
            <Sparkle className={`w-3 h-3 ${a.text}`} />
            <span className={`font-script text-base ${a.text}`}>
              Chapter {stageNum}
            </span>
            <div className="flex-1 h-px bg-ink/15" />
            <span className="font-display text-[10px] text-ink/45 tracking-[0.25em]">
              {stage.element.toUpperCase()}
            </span>
          </div>
          <p className="relative font-display text-ink text-sm md:text-base leading-relaxed">
            {stage.title}
          </p>
        </div>
      </motion.div>

      {/* ── 카드 2장 ── */}
      <div className="flex justify-center gap-6 md:gap-12">
        {stage.cards.map((card, i) => {
          const isSelected = selectedId === card.id
          const isOther    = selectedId && !isSelected
          const isFlipped  = flippedId === card.id
          const backImg    = getCardImage(card.backImage)

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isOther ? 0.25 : 1,
                y: 0,
                scale: isOther ? 0.86 : 1,
                rotate: isOther ? (i === 0 ? -6 : 6) : 0,
              }}
              transition={{ delay: 0.25 + i * 0.15, type: 'spring' }}
              className="relative flex flex-col items-center"
            >
              <button
                className={`perspective w-40 md:w-48 aspect-[3/4] cursor-pointer
                           ${isSelected && !isFlipped ? 'card-glow' : ''}`}
                onClick={() => handlePick(card)}
                disabled={!!selectedId}
                aria-label={card.label}
              >
                <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>

                  {/* ── 뒷면 (선택 전 보이는 면) — 완성형 카드 이미지 ── */}
                  <div className="card-face bg-[#F3E2C2] relative
                                  shadow-[0_18px_30px_-16px_rgba(58,36,24,0.55)]">
                    {backImg ? (
                      <img src={backImg} alt={card.label}
                           className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3
                                      bg-[#FBF3E3]">
                        <span className="text-4xl">{card.emoji}</span>
                        <span className="font-display text-sm font-bold text-ink text-center">
                          {card.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── 앞면 (선택 후 뒤집힘) — 같은 카드 이미지 + 선택 강조 ── */}
                  <div className="card-face card-face-front bg-[#F3E2C2] relative ring-2 ring-jam/40
                                  shadow-[0_22px_36px_-18px_rgba(58,36,24,0.65)]">
                    {backImg ? (
                      <img src={backImg} alt={card.label}
                           className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FCF5E6]">
                        <span className="text-6xl">{card.emoji}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 별 파티클 */}
                <StarParticles active={isSelected} count={18} />
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* 항상 마운트해 높이를 고정 — 선택 시 사라지면서 레이아웃이 밀리지 않게 opacity만 변경 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedId ? 0 : 1 }}
        transition={selectedId ? { duration: 0.35 } : { delay: 0.9 }}
        aria-hidden={!!selectedId}
        className={`mt-10 text-center font-script text-base select-none pointer-events-none
                    ${dark ? 'text-cream/70' : 'text-jam/85'}`}
      >
        마음에 드는 카드를 탭해주세요
      </motion.p>
    </div>
  )
}
