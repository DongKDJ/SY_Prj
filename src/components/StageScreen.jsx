import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCardImage } from '../assets/imageMap'
import CardSelect from './CardSelect'
import { stages } from '../data/desserts'
import { InkButton } from './shared/InkButton'
import { ArtStage, ArtLayer, ArtBandCrop, LoadingCover } from './shared/ArtStage'
import { bookmarkBg, grassLayers, bookmarkTitles, ingredientLayers, goldFrames } from '../assets/screenImages'
import { useImagesReady } from '../hooks/useImagesReady'
import {
  PaperGrain,
  Floret,
  CornerOrnament,
  MaskingTape,
  FloatingMotes,
} from './shared/Decorations'

/* 시간대별 톤 — 종이 페이지의 빛 변화 */
const timeStyles = {
  morning: {
    bg:    'from-[#FBF3E3] via-[#F5DDB8] to-[#E8C49E]',
    accent: 'honey',
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
    motes: ['honey', 'sage'],
  },
  noon: {
    bg:    'from-[#FCF5E6] via-[#F0E0BE] to-[#D8CFA0]',
    accent: 'sage',
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
    motes: ['sage', 'honey'],
  },
  evening: {
    bg:    'from-[#E8C8A0] via-[#D4A07A] to-[#A87858]',
    accent: 'jam',
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
    motes: ['jam', 'honey'],
  },
  night: {
    bg:    'from-[#1F1410] via-[#2C1810] to-[#0F0805]',
    accent: 'honey',
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
    motes: ['honey', 'jam'],
  },
}

// 로딩 게이트 대상 — 상주 배경·테두리·첫 배너. 재료 레이어는 제외(놓이는 팝인이 의도된 연출)
const STAGE_SRCS = [bookmarkBg, ...grassLayers, ...goldFrames, bookmarkTitles[1]]

// Phase: 'bookmark' → 'cards' → 'enlarged'
export default function StageScreen({ stageIndex, selections, onSelect, onComplete }) {
  const [phase, setPhase] = useState('bookmark')
  const [selectedCardId, setSelectedCardId] = useState(null)
  const proceedRef = useRef(false)

  // 스테이지 4개가 한 마운트를 공유하므로(App.jsx pageKey='stages') 스테이지가 바뀌면
  // 렌더 단계에서 즉시 리셋 — 이전 스테이지의 enlarged 상태가 새 스테이지로 새어들지 않게.
  const [prevStageIndex, setPrevStageIndex] = useState(stageIndex)
  if (prevStageIndex !== stageIndex) {
    setPrevStageIndex(stageIndex)
    setPhase('bookmark')
    setSelectedCardId(null)
  }

  // 전환 잠금 해제는 렌더 밖에서 (ref는 렌더 중 접근 금지)
  useEffect(() => {
    proceedRef.current = false
  }, [stageIndex])

  const stage = stages[stageIndex]
  const style = timeStyles[stage.timeOfDay]
  const stageNum = String(stage.id).padStart(2, '0')

  // 확대 화면을 읽는 동안 다음 책갈피에 새로 등장할 레이어를 선로딩 (4K 디코드 끊김 방지)
  useEffect(() => {
    if (phase !== 'enlarged') return
    const next = stages[stageIndex + 1]
    const warm = [
      selectedCardId ? ingredientLayers[selectedCardId] : null,
      next ? bookmarkTitles[next.id] : null,
    ].filter(Boolean)
    warm.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [phase, stageIndex, selectedCardId])

  const handleCardSelected = (cardId) => {
    setSelectedCardId(cardId)
    setPhase('enlarged')
  }

  const handleProceed = () => {
    if (proceedRef.current) return
    proceedRef.current = true
    // 영구 래치 금지 — 전환이 무산되는 경로(퇴장 중 유령 클릭 등)가 있어도 버튼이 죽지 않게 재무장.
    // 이중 전진 자체는 useGameState의 700ms 락이 막는다.
    setTimeout(() => { proceedRef.current = false }, 1000)
    onSelect(stageIndex, selectedCardId)
    onComplete()
  }

  // 상주 배경이 준비된 뒤에 화면을 연다 (보통은 대화 화면의 선로딩으로 이미 준비돼 있다)
  const ready = useImagesReady(STAGE_SRCS)
  if (!ready) return <LoadingCover />

  return (
    <div className={`min-h-[100dvh] w-full relative overflow-hidden
                     bg-gradient-to-b ${style.bg}`}>
      <PaperGrain />
      <div className="page-vignette" />

      {/* 책갈피 원화 배경 — 페이즈·스테이지 전환과 무관하게 상주 (책상·풀·금장·누적 재료).
          다음 책갈피로 넘어가도 배경과 테두리는 "이미 있는" 상태이고, 배너 등만 새로 채워진다. */}
      <ArtStage>
        <ArtLayer src={bookmarkBg} className="art-zoom" />

        {/* 풀·잎 장식 — 딜레이를 어긋내 미세하게 흔들림 */}
        {grassLayers.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 art-sway"
            style={{ animationDelay: `${i * 1.1}s` }}
          >
            <ArtLayer src={src} />
          </div>
        ))}

        {/* 이전 선택 재료 — 책상 위 누적 (원화에 자리가 서로 다르게 그려져 있다) */}
        {selections.map((cardId, i) => (
          ingredientLayers[cardId] && (
            <motion.div
              key={cardId}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.18, type: 'spring', stiffness: 110, damping: 15 }}
              className="absolute inset-0"
            >
              <ArtLayer src={ingredientLayers[cardId]} />
            </motion.div>
          )
        ))}
      </ArtStage>

      {/* 3단계 내내 배경에 남아 페이지가 멈추지 않게 한다 (단계 전환에도 끊기지 않도록 AnimatePresence 바깥) */}
      <FloatingMotes count={12} palette={style.motes} />

      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════
            Phase 1: 챕터 인트로 (책갈피)
            ═══════════════════════════════════ */}
        {phase === 'bookmark' && (
          <motion.div
            key="bookmark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <ArtStage>
              {/* "N번째 책갈피" 배너 (세로 화면에서는 아래 밴드로 대체) — 배경·테두리는 상주 레이어가 담당 */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                className="absolute inset-0 portrait:hidden"
              >
                <div className="absolute inset-0 art-bob">
                  <ArtLayer src={bookmarkTitles[stage.id]} />
                </div>
              </motion.div>
            </ArtStage>

            {/* 세로 화면: 배너를 캔버스 밴드에서 잘라 화면 폭에 맞춰 표시 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="hidden portrait:block absolute top-[5%] left-1/2 -translate-x-1/2 w-[94vw] z-10"
            >
              <div className="art-bob">
                <ArtBandCrop src={bookmarkTitles[stage.id]} top={14} bottom={76} />
              </div>
            </motion.div>

            {/* 우상단: 진행도 */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-8 right-8 flex items-center gap-2 z-10"
            >
              {[0, 1, 2, 3].map(i => (
                <span
                  key={i}
                  className={`inline-block transition-all drop-shadow-[0_1px_3px_rgba(255,248,240,0.8)] ${
                    i < stageIndex
                      ? `w-3 h-3 rounded-full ${style.accentBg}`
                      : i === stageIndex
                        ? `w-6 h-3 rounded-full ${style.accentBg}`
                        : 'w-3 h-3 rounded-full border border-ink/40'
                  }`}
                />
              ))}
            </motion.div>

            {/* 하단 안내 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-10 pointer-events-none"
            >
              <span className="font-script text-xl text-jam drop-shadow-[0_1px_4px_rgba(255,248,240,0.9)]">
                turn the page
              </span>
              <span className="font-display text-xs tracking-widest text-ink/80
                               drop-shadow-[0_1px_4px_rgba(255,248,240,0.9)]">
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
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.5 }}
            className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 relative"
          >
            {/* 카드·질문이 배경 원화에 묻히지 않게 화면 중앙만 살짝 어둡게 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 58% 66% at 50% 52%, rgba(58,36,24,0.52), rgba(58,36,24,0.26) 55%, transparent 82%)',
              }}
            />
            <CardSelect
              stage={stage}
              onSelect={handleCardSelected}
              accent={style.accent}
            />
          </motion.div>
        )}

        {/* ═══════════════════════════════════
            Phase 3: 확대 뷰 + 다음으로
            ═══════════════════════════════════ */}
        {phase === 'enlarged' && selectedCardId && (() => {
          const card = stage.cards.find(c => c.id === selectedCardId)
          if (!card) return null // 스테이지 전환 직후의 일시 렌더 방어
          const cardImg = getCardImage(card.frontImage)
          return (
            <motion.div
              key="enlarged"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, pointerEvents: 'none' }}
              transition={{ duration: 0.4 }}
              className="min-h-[100dvh] flex flex-col items-center justify-center px-4 relative"
            >
              {/* 배경 흐림+어둡기 — backdrop-filter는 페이드 중 화면 모퉁이 깜빡임을 만들어서
                  실시간 블러 대신 미리 흐린 배경 사본을 페이드시킨다 */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={bookmarkBg}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="absolute -inset-[3%] w-[106%] h-[106%] object-cover select-none"
                  style={{ filter: 'blur(16px)' }}
                />
              </div>
              <div className="absolute inset-0 bg-ink/30" />
              <div className="absolute inset-0 bg-radial from-transparent to-black/50" />

              <motion.div
                initial={{ scale: 0.6, opacity: 0, rotateZ: -3 }}
                animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                className="relative z-10 flex flex-col items-center max-w-md"
              >
                {/* 카드 — 빈티지 표본 카드. 설명을 읽는 8~12초 동안 정지하지 않도록
                    위쪽 테이프를 지지점 삼아 아주 느리게 흔들린다. */}
                <div className="ambient-pinned relative bg-[#FBF3E3] p-3 md:p-4 pb-12 md:pb-14
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
