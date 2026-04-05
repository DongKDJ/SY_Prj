import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IngredientStack from './shared/IngredientStack'
import CardSelect from './CardSelect'
import { stages, foxDialogs } from '../data/desserts'

const timeStyles = {
  morning: {
    bg: 'from-morning via-cream to-cream-dark',
    treeBg: 'bg-[#6B8F5E]',
    skyColor: 'bg-[#87CEEB]/30',
    label: '오전 (밝음) 정원',
    dark: false,
  },
  noon: {
    bg: 'from-noon via-cream to-cream-dark',
    treeBg: 'bg-[#5A7D4E]',
    skyColor: 'bg-[#FFE4B5]/30',
    label: '정오 (밝음) 정원',
    dark: false,
  },
  evening: {
    bg: 'from-[#C4956A]/40 via-[#D4A574]/20 to-cream-dark',
    treeBg: 'bg-[#4A6741]',
    skyColor: 'bg-[#E8A87C]/30',
    label: '저녁 정원',
    dark: false,
  },
  night: {
    bg: 'from-[#1A0F0A] via-[#2C1810] to-[#1A0F0A]',
    treeBg: 'bg-[#2A3A25]',
    skyColor: 'bg-[#1A1A3A]/30',
    label: '밤 정원',
    dark: true,
  },
}

// Phase: 'bookmark' → 'cards' → 'enlarged'
export default function StageScreen({ stageIndex, selections, onSelect, onComplete }) {
  const [phase, setPhase] = useState('bookmark')
  const [selectedCardId, setSelectedCardId] = useState(null)

  const stage = stages[stageIndex]
  const style = timeStyles[stage.timeOfDay]
  const textColor = style.dark ? 'text-cream' : 'text-brown'
  const subtextColor = style.dark ? 'text-cream/60' : 'text-brown-light/60'

  const handleCardSelected = (cardId) => {
    setSelectedCardId(cardId)
    setPhase('enlarged')
  }

  const handleProceed = () => {
    onSelect(stageIndex, selectedCardId)
    onComplete()
  }

  return (
    <div className={`min-h-[100dvh] bg-gradient-to-b ${style.bg} relative overflow-hidden`}>

      <AnimatePresence mode="wait">
        {/* ===== Phase 1: 책갈피 인트로 ===== */}
        {phase === 'bookmark' && (
          <motion.div
            key="bookmark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-[100dvh] flex flex-col relative"
          >
            {/* 나무 판떼기 (상단) */}
            <div className="h-6 bg-gradient-to-b from-[#5C4033] to-[#6B5035] shadow-md z-10 relative">
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4A3020]" />
            </div>

            {/* 배경 영역 - 산/숲 실루엣 */}
            <div className="flex-1 relative overflow-hidden">
              {/* 기하학적 산 실루엣 */}
              <div className="absolute inset-0">
                {/* 뒤쪽 산 */}
                <div className="absolute bottom-[30%] left-[-10%] w-[60%] h-[70%]
                                bg-cabin-dark/15 rotate-[-8deg] origin-bottom-left" />
                <div className="absolute bottom-[30%] right-[-15%] w-[55%] h-[80%]
                                bg-cabin-dark/10 rotate-[5deg] origin-bottom-right" />
                {/* 앞쪽 산 */}
                <div className="absolute bottom-[30%] left-[10%] w-[45%] h-[55%]
                                bg-cabin-dark/20 rotate-[-12deg] origin-bottom-left" />
                <div className="absolute bottom-[30%] right-[5%] w-[50%] h-[60%]
                                bg-cabin-dark/18 rotate-[8deg] origin-bottom-right" />
                {/* 가운데 삼각형 */}
                <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[40%] h-[50%]
                                bg-cabin-dark/12 rotate-[2deg]" />
              </div>

              {/* 시간대 라벨 */}
              <div className="absolute top-4 right-4 text-right z-10">
                <p className={`text-sm font-semibold ${textColor}`}>바깥: {style.label}</p>
              </div>

              {/* 햇살/달빛 표시 */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                <p className={`text-xs ${subtextColor}`}>
                  {style.dark ? '달빛.. 은은' : '햇살..'}
                </p>
              </div>

              {/* 펼쳐진 레시피북 placeholder */}
              <div className="absolute bottom-[32%] left-[8%] z-10">
                <p className={`text-xs ${subtextColor} mb-1`}>펼쳐진 레시피북 이미지</p>
                <div className="w-20 h-14 bg-card/30 rounded-lg border border-cabin/10 flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
              </div>

              {/* 책갈피 리본 */}
              <div className="absolute bottom-[38%] left-1/2 -translate-x-1/2 z-20
                              flex flex-col items-center">
                <div className="w-6 h-10 bg-cabin/40 rounded-b-sm" />
                <span className={`text-xs ${subtextColor} mt-1`}>책갈피</span>
              </div>

              {/* 메인 타이틀 배너 */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 60 }}
                className="absolute bottom-[18%] left-0 right-0 z-20 px-4"
              >
                <div className={`${style.dark ? 'bg-cream/15 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'}
                                rounded-2xl px-6 py-5 shadow-lg max-w-lg mx-auto`}>
                  <h2 className={`text-2xl md:text-3xl font-bold ${textColor} text-center`}>
                    {stage.bookmark} ({stage.id}단계)
                  </h2>
                  <p className="text-cabin text-sm text-right mt-1 font-semibold">
                    :{stage.category}
                  </p>
                </div>
              </motion.div>

              {/* 누적 카드 — 배경 중앙, 탁자 위에 흩어진 카드들 */}
              {selections.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute top-[20%] left-1/2 -translate-x-1/2 z-15"
                >
                  <IngredientStack selections={selections} />
                </motion.div>
              )}
            </div>

            {/* 나무 판떼기 (하단) */}
            <div className="h-6 bg-gradient-to-t from-[#5C4033] to-[#6B5035] shadow-md z-10 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#4A3020]" />
            </div>

            {/* 화면 탭하면 다음으로 */}
            <button
              onClick={() => setPhase('cards')}
              className="absolute inset-0 z-30 cursor-pointer"
            />

            {/* 하단 안내 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-10 left-0 right-0 text-center z-40 pointer-events-none"
            >
              <span className={`text-xs ${subtextColor} bg-black/10 px-4 py-1.5 rounded-full`}>
                탭하여 계속
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* ===== Phase 2: 카드 선택 ===== */}
        {phase === 'cards' && (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8"
          >
            <CardSelect
              stage={stage}
              onSelect={handleCardSelected}
              dark={style.dark}
            />
          </motion.div>
        )}

        {/* ===== Phase 3: 카드 확대 뷰 ===== */}
        {phase === 'enlarged' && selectedCardId && (
          <motion.div
            key="enlarged"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[100dvh] flex flex-col items-center justify-center px-4 relative"
          >
            {/* 어두운 배경 오버레이 */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {(() => {
              const card = stage.cards.find(c => c.id === selectedCardId)
              return (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  {/* 확대된 카드 */}
                  <div className="w-56 h-80 md:w-72 md:h-[26rem] bg-card rounded-3xl
                                  border-2 border-cabin/30 shadow-2xl overflow-hidden
                                  flex flex-col items-center justify-center card-glow">
                    {/* 카드 이미지 영역 (placeholder) */}
                    <div className="flex-1 w-full bg-cream-dark/50 flex items-center justify-center">
                      <span className="text-6xl md:text-7xl">{card.ingredientEmoji}</span>
                    </div>
                    {/* 이미지 타이틀 */}
                    <div className="w-full px-4 py-4 bg-white/80 text-center">
                      <p className="text-lg md:text-xl font-bold text-brown">
                        {card.ingredient}
                      </p>
                      <p className="text-xs text-brown-light/60 mt-1">
                        {card.brief}
                      </p>
                    </div>
                  </div>

                  {/* 설명 텍스트 */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 max-w-sm"
                  >
                    <p className="text-cream/90 text-sm text-center leading-relaxed italic">
                      "{card.description}"
                    </p>
                  </motion.div>

                  {/* 다음으로 화살표 */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProceed}
                    className="mt-8 flex items-center gap-2 bg-cabin text-cream
                               px-8 py-3 rounded-full font-semibold shadow-lg
                               cursor-pointer hover:bg-cabin-dark transition-colors"
                  >
                    다음으로
                    <span className="text-lg">→</span>
                  </motion.button>
                </motion.div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
