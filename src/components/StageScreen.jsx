import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IngredientStack from './shared/IngredientStack'
import { getCardImage } from '../assets/imageMap'
import CardSelect from './CardSelect'
import { stages } from '../data/desserts'
import { InkButton } from './shared/InkButton'
import {
  PaperGrain,
  Divider,
  Sparkle,
  Floret,
  WheatSprig,
  CornerOrnament,
  MaskingTape,
} from './shared/Decorations'

/* 시간대별 톤 — 종이 페이지의 빛 변화 */
const timeStyles = {
  morning: {
    bg:    'from-[#FBF3E3] via-[#F5DDB8] to-[#E8C49E]',
    accentText: 'text-honey',
    accentBg:   'bg-honey',
    accentBorder: 'border-honey',
    accentDivider: 'text-honey/80',
    inkClass: 'text-ink',
    softInk:  'text-ink/65',
    cornerInk: 'text-ink/40',
    dark: false,
    icon: '☀',
    label: '아침의 페이지',
  },
  noon: {
    bg:    'from-[#FCF5E6] via-[#F0E0BE] to-[#D8CFA0]',
    accentText: 'text-sage',
    accentBg:   'bg-sage',
    accentBorder: 'border-sage',
    accentDivider: 'text-sage/80',
    inkClass: 'text-ink',
    softInk:  'text-ink/65',
    cornerInk: 'text-ink/40',
    dark: false,
    icon: '◐',
    label: '정오의 페이지',
  },
  evening: {
    bg:    'from-[#E8C8A0] via-[#D4A07A] to-[#A87858]',
    accentText: 'text-jam',
    accentBg:   'bg-jam',
    accentBorder: 'border-jam',
    accentDivider: 'text-jam/80',
    inkClass: 'text-ink',
    softInk:  'text-ink/65',
    cornerInk: 'text-ink/40',
    dark: false,
    icon: '◑',
    label: '저녁의 페이지',
  },
  night: {
    bg:    'from-[#1F1410] via-[#2C1810] to-[#0F0805]',
    accentText: 'text-honey',
    accentBg:   'bg-honey',
    accentBorder: 'border-honey',
    accentDivider: 'text-honey/80',
    inkClass: 'text-cream',
    softInk:  'text-cream/55',
    cornerInk: 'text-cream/40',
    dark: true,
    icon: '☾',
    label: '밤의 페이지',
  },
}

// Phase: 'bookmark' → 'cards' → 'enlarged'
export default function StageScreen({ stageIndex, selections, onSelect, onComplete }) {
  const [phase, setPhase] = useState('bookmark')
  const [selectedCardId, setSelectedCardId] = useState(null)
  const proceedRef = useRef(false)

  const stage = stages[stageIndex]
  const style = timeStyles[stage.timeOfDay]
  const stageNum = String(stage.id).padStart(2, '0')

  const handleCardSelected = (cardId) => {
    setSelectedCardId(cardId)
    setPhase('enlarged')
  }

  const handleProceed = () => {
    if (proceedRef.current) return
    proceedRef.current = true
    onSelect(stageIndex, selectedCardId)
    onComplete()
  }

  return (
    <div className={`min-h-[100dvh] w-full relative overflow-hidden
                     bg-gradient-to-b ${style.bg}`}>
      <PaperGrain />
      <div className="page-vignette" />

      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════
            Phase 1: 챕터 인트로 (책갈피)
            ═══════════════════════════════════ */}
        {phase === 'bookmark' && (
          <motion.div
            key="bookmark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-[100dvh] relative flex flex-col"
          >
            {/* 4 코너 장식 */}
            <CornerOrnament corner="tl" className={`absolute top-4 left-4 w-10 h-10 ${style.cornerInk}`} />
            <CornerOrnament corner="tr" className={`absolute top-4 right-4 w-10 h-10 ${style.cornerInk}`} />
            <CornerOrnament corner="bl" className={`absolute bottom-4 left-4 w-10 h-10 ${style.cornerInk}`} />
            <CornerOrnament corner="br" className={`absolute bottom-4 right-4 w-10 h-10 ${style.cornerInk}`} />

            {/* 좌상단: 시간대 라벨 */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-12 left-12 flex items-center gap-2 z-10"
            >
              <span className={`text-xl ${style.accentText}`}>
                {style.icon}
              </span>
              <span className={`font-script text-lg ${style.accentText}`}>
                {style.label}
              </span>
            </motion.div>

            {/* 우상단: 진행도 */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-12 right-12 flex items-center gap-2 z-10"
            >
              {[0, 1, 2, 3].map(i => (
                <span
                  key={i}
                  className={`inline-block transition-all ${
                    i < stageIndex
                      ? `w-3 h-3 rounded-full ${style.accentBg}`
                      : i === stageIndex
                        ? `w-6 h-3 rounded-full ${style.accentBg}`
                        : `w-3 h-3 rounded-full border ${style.dark ? 'border-cream/30' : 'border-ink/30'}`
                  }`}
                />
              ))}
            </motion.div>

            {/* 중앙: 챕터 정보 */}
            <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-center max-w-xl relative"
              >
                {/* 양옆 밀이삭 */}
                <WheatSprig className={`absolute -left-10 md:-left-20 top-8 w-10 md:w-14 h-auto ${style.dark ? 'text-sage/40' : 'text-sage/60'}`} />
                <WheatSprig flip className={`absolute -right-10 md:-right-20 top-8 w-10 md:w-14 h-auto ${style.dark ? 'text-sage/40' : 'text-sage/60'}`} />

                {/* 챕터 라벨 */}
                <p className={`font-script text-2xl ${style.accentText} mb-2`}>
                  Chapter {stageNum}
                </p>

                {/* 큰 단계 숫자 */}
                <p className={`font-display font-bold text-[5rem] md:text-[7rem] leading-none
                               ${style.inkClass} relative inline-block`}>
                  {stageNum}
                  <Sparkle className={`absolute -top-2 -right-6 w-6 h-6 ${style.accentText}`} />
                </p>

                {/* 책갈피 이름 */}
                <p className={`font-display text-xl md:text-2xl font-bold ${style.inkClass} mt-3`}>
                  {stage.bookmark}
                </p>

                {/* 디바이더 */}
                <div className="flex justify-center my-5">
                  <Divider className={`w-36 h-3 ${style.accentDivider}`} />
                </div>

                {/* 타이틀 (질문) */}
                <p className={`font-display italic text-base md:text-lg ${style.softInk}
                                leading-relaxed px-4`}>
                  {stage.title}
                </p>

                {/* 카테고리 + 엘리먼트 */}
                <div className="flex justify-center items-center gap-3 mt-5 flex-wrap">
                  <span className={`font-display text-xs tracking-[0.25em] px-3 py-1
                                    border ${style.dark ? 'border-cream/30 text-cream/80' : 'border-ink/30 text-ink/80'}
                                    rounded-full`}>
                    {stage.category}
                  </span>
                  <span className="font-script text-base text-jam">×</span>
                  <span className={`font-display text-xs tracking-[0.25em] px-3 py-1
                                    bg-honey-soft/30 rounded-full ${style.inkClass}`}>
                    {stage.element}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* 누적된 이전 선택 카드들 (왼쪽 하단 핀업) */}
            {selections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-16 left-4 md:left-8 z-10"
              >
                <p className={`font-script text-sm mb-1 ${style.dark ? 'text-cream/70' : 'text-ink/70'}`}>
                  지금까지의 선택
                </p>
                <div className="scale-75 md:scale-90 origin-bottom-left">
                  <IngredientStack selections={selections} />
                </div>
              </motion.div>
            )}

            {/* 하단 안내 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 z-10 pointer-events-none"
            >
              <span className={`font-script text-xl ${style.accentText}`}>
                turn the page
              </span>
              <span className={`font-display text-xs tracking-widest ${style.softInk}`}>
                탭하여 계속 →
              </span>
            </motion.div>

            {/* 전체 탭 */}
            <button
              onClick={() => setPhase('cards')}
              className="absolute inset-0 z-20 cursor-pointer"
              aria-label="다음 페이지"
            />
          </motion.div>
        )}

        {/* ═══════════════════════════════════
            Phase 2: 카드 선택
            ═══════════════════════════════════ */}
        {phase === 'cards' && (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 relative"
          >
            <CardSelect
              stage={stage}
              onSelect={handleCardSelected}
              dark={style.dark}
              accent={style.accent}
            />
          </motion.div>
        )}

        {/* ═══════════════════════════════════
            Phase 3: 확대 뷰 + 다음으로
            ═══════════════════════════════════ */}
        {phase === 'enlarged' && selectedCardId && (() => {
          const card = stage.cards.find(c => c.id === selectedCardId)
          const cardImg = getCardImage(card.backImage)
          return (
            <motion.div
              key="enlarged"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-[100dvh] flex flex-col items-center justify-center px-4 relative"
            >
              {/* 배경 오버레이 — 종이 위 부드러운 비네팅 */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/50" />
              <div className="absolute inset-0 backdrop-blur-md bg-ink/20" />

              <motion.div
                initial={{ scale: 0.6, opacity: 0, rotateZ: -3 }}
                animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                className="relative z-10 flex flex-col items-center max-w-md"
              >
                {/* 카드 — 빈티지 표본 카드 */}
                <div className="relative bg-[#FBF3E3] p-3 md:p-4 pb-12 md:pb-14
                                shadow-[0_30px_50px_-20px_rgba(0,0,0,0.6)]
                                border border-paper-edge">
                  <PaperGrain />

                  {/* 마스킹 테이프 */}
                  <MaskingTape className="absolute -top-3 left-8" width={80} rotate={-10} tone="honey" />
                  <MaskingTape className="absolute -top-3 right-8" width={80} rotate={8} tone="jam" />

                  <CornerOrnament corner="tl" className="absolute top-2 left-2 w-8 h-8 text-ink/40" />
                  <CornerOrnament corner="tr" className="absolute top-2 right-2 w-8 h-8 text-ink/40" />
                  <CornerOrnament corner="bl" className="absolute bottom-2 left-2 w-8 h-8 text-ink/40" />
                  <CornerOrnament corner="br" className="absolute bottom-2 right-2 w-8 h-8 text-ink/40" />

                  {/* 카드 헤더 */}
                  <div className="relative flex items-center justify-between mb-2 px-1">
                    <span className="font-script text-base text-jam">
                      Ingredient №{stageNum}
                    </span>
                    <span className="font-display text-[10px] text-ink/50 tracking-[0.25em]">
                      {stage.element.toUpperCase()}
                    </span>
                  </div>

                  {/* 카드 메인 이미지 */}
                  <div className="w-56 h-72 md:w-72 md:h-[22rem] bg-[#F3E2C2]
                                  overflow-hidden flex items-center justify-center relative">
                    {cardImg ? (
                      <img src={cardImg} alt={card.ingredient}
                           className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-7xl">{card.ingredientEmoji}</span>
                    )}
                    {/* 광택 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/15 pointer-events-none" />
                  </div>

                  {/* 카드 캡션 (폴라로이드 영역) */}
                  <div className="absolute bottom-3 left-0 right-0 text-center px-3">
                    <p className="font-display text-lg md:text-xl font-bold text-ink leading-tight">
                      {card.ingredient}
                    </p>
                    <p className="font-script text-base text-jam mt-0.5">
                      {card.brief}
                    </p>
                  </div>
                </div>

                {/* 설명 텍스트 */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-7 max-w-md text-center px-2"
                >
                  <Floret className="w-4 h-4 text-honey mx-auto mb-2" />
                  <p className="font-display italic text-sm md:text-base text-cream/95 leading-relaxed">
                    &ldquo;{card.description}&rdquo;
                  </p>
                </motion.div>

                {/* 다음으로 - 잉크 알약 버튼 */}
                <InkButton
                  onClick={handleProceed}
                  size="md"
                  sub="next page"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 140, damping: 14 }}
                  className="mt-8"
                  aria-label="다음으로"
                >
                  다음으로
                </InkButton>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
