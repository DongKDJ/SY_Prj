import { useState } from 'react'
import { motion } from 'framer-motion'
import StarParticles from './shared/StarParticles'
import { getCardImage } from '../assets/imageMap'
import {
  PaperGrain,
  Divider,
  Sparkle,
  Floret,
  CornerOrnament,
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
  const ink = dark ? 'text-cream' : 'text-ink'
  const softInk = dark ? 'text-cream/65' : 'text-ink/65'
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
          const labelTone  = i === 0 ? '-rotate-2' : 'rotate-2'

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
                className={`perspective w-40 h-56 md:w-48 md:h-72 cursor-pointer
                           ${isSelected && !isFlipped ? 'card-glow' : ''}`}
                onClick={() => handlePick(card)}
                disabled={!!selectedId}
                aria-label={card.label}
              >
                <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>

                  {/* ── 뒷면 (선택 전 보이는 면) ── */}
                  <div className="card-face bg-[#FBF3E3] border border-paper-edge
                                  shadow-[0_18px_30px_-16px_rgba(58,36,24,0.55)]
                                  flex flex-col p-2.5 relative overflow-hidden">
                    <PaperGrain />
                    {/* 코너 장식 */}
                    <CornerOrnament corner="tl" className="absolute top-1 left-1 w-5 h-5 text-ink/40 z-10" />
                    <CornerOrnament corner="tr" className="absolute top-1 right-1 w-5 h-5 text-ink/40 z-10" />
                    <CornerOrnament corner="bl" className="absolute bottom-1 left-1 w-5 h-5 text-ink/40 z-10" />
                    <CornerOrnament corner="br" className="absolute bottom-1 right-1 w-5 h-5 text-ink/40 z-10" />

                    {/* 카드 상단 라벨 */}
                    <div className="relative flex items-center justify-between px-1.5 py-1
                                    border-b border-dashed border-ink/20 z-10">
                      <span className={`font-script text-xs ${a.text}`}>
                        №{stageNum}·{i + 1}
                      </span>
                      <span className="font-display text-[8px] text-ink/45 tracking-[0.25em]">
                        CARD
                      </span>
                    </div>

                    {/* 이미지 또는 emoji */}
                    <div className="flex-1 w-full bg-[#F3E2C2] my-1.5 overflow-hidden
                                    flex items-center justify-center relative">
                      {backImg ? (
                        <img src={backImg} alt={card.label}
                             className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 p-2">
                          <span className="text-4xl">{card.emoji}</span>
                          <span className="font-display text-sm font-bold text-ink">
                            {card.label}
                          </span>
                          <p className="font-display text-[10px] text-ink/65 text-center leading-snug px-2">
                            {card.brief}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 카드 하단 */}
                    <div className="relative flex items-center justify-center gap-1 pb-0.5 z-10">
                      <Floret className="w-2.5 h-2.5 text-honey/70" />
                      <span className={`font-script text-xs ${a.text}`}>
                        pick me?
                      </span>
                      <Floret className="w-2.5 h-2.5 text-honey/70" />
                    </div>
                  </div>

                  {/* ── 앞면 (뒤집힌 후, 재료 공개) ── */}
                  <div className="card-face card-face-front bg-[#FCF5E6]
                                  border-2 border-jam/50
                                  shadow-[0_22px_36px_-18px_rgba(58,36,24,0.65)]
                                  flex flex-col p-2.5 relative overflow-hidden">
                    <PaperGrain />
                    {/* 상단 도장 라벨 */}
                    <div className="relative flex items-center justify-between px-1.5 py-1 z-10">
                      <span className="font-script text-xs text-jam">
                        Ingredient
                      </span>
                      <span className="font-display text-[8px] text-jam/70 tracking-[0.25em]">
                        № {stageNum}
                      </span>
                    </div>
                    <Divider variant="wave" className="w-full h-2 text-jam/40 mb-1" />

                    {/* 메인 이미지 */}
                    <div className="flex-1 w-full bg-[#F3E2C2] overflow-hidden
                                    flex items-center justify-center relative">
                      {backImg ? (
                        <img src={backImg} alt={card.ingredient}
                             className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl">{card.ingredientEmoji}</span>
                      )}
                    </div>

                    {/* 캡션 */}
                    <div className="relative text-center pt-2 z-10">
                      <p className="font-display text-sm md:text-base font-bold text-ink leading-tight">
                        {card.ingredient}
                      </p>
                      <p className="font-script text-xs text-jam mt-0.5">
                        {card.brief}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 별 파티클 */}
                <StarParticles active={isSelected} count={18} />
              </button>

              {/* 카드 라벨 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isOther ? 0.35 : 1 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                className={`mt-3 font-display text-base md:text-lg font-bold ${ink}
                           ${labelTone} flex items-center gap-1.5`}
              >
                <span>{card.emoji}</span>
                <span>{card.label}</span>
              </motion.p>
            </motion.div>
          )
        })}
      </div>

      {!selectedId && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className={`mt-10 text-center font-script text-base ${dark ? 'text-cream/70' : 'text-jam/85'}`}
        >
          마음에 드는 카드를 탭해주세요
        </motion.p>
      )}
    </div>
  )
}
