import Sentences from './shared/Sentences'
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dessertResults, stages, allCards, resultCards } from '../data/desserts'
import { getCardImage, getDessertThumb } from '../assets/imageMap'
import { InkButton } from './shared/InkButton'
import BackButton from './shared/BackButton'
import { ArtBackdrop } from './shared/ArtStage'
import { bookmarkBg } from '../assets/screenImages'
import { PaperGrain, Divider, Sparkle } from './shared/Decorations'
import { RoundButton, DessertCard, ComboCards, CardLightbox } from './shared/BookUi'

const allDesserts = Object.values(dessertResults).sort((a, b) => a.id - b.id)

const cardOf = Object.fromEntries(allCards.map((c) => [c.id, c]))
// 카드 도감 줄 = 책갈피 하나(진행 순서), 칸 = 카드마다 뒷면(선택지) → 앞면(재료)
const CARD_ROWS = stages.map((s) => ({
  id: s.id, bookmark: s.bookmark,
  tiles: s.cards.flatMap((c) => [{ side: 'back', card: cardOf[c.id] }, { side: 'front', card: cardOf[c.id] }]),
}))

const TABS = [
  { id: 'dessert', label: '디저트 도감', count: `${allDesserts.length}종` },
  { id: 'card',    label: '카드 도감',   count: `${allCards.length}장 · 앞뒤` },
]

/**
 * 디저트 도감 + 카드 도감 (2026-11-05 대표 재구성: 두 탭, 도형 아이콘 가운데 정렬, 설명 가운데 정렬,
 * 설명 아래 조합 + 고른 카드 4장, 디저트·카드 모두 누르면 크게).
 * 전시용: 처음부터 전부 열람 가능 (2026-08-21 잠금 시스템 제거).
 */
export default function DessertBook({ currentResult, onRestart, onExit }) {
  const [tab, setTab] = useState('dessert')
  const [detailDessert, setDetailDessert] = useState(null)
  const [lightbox, setLightbox] = useState(null) // { card } | { dessert }
  const closeLightbox = useCallback(() => setLightbox(null), [])

  const navigateDetail = useCallback((dir) => {
    setDetailDessert((cur) => {
      if (!cur) return cur
      const idx = allDesserts.findIndex(d => d.id === cur.id)
      return allDesserts[(idx + dir + allDesserts.length) % allDesserts.length]
    })
  }, [])

  // 상세에서 키보드 ← → 로도 넘김 (확대 보기 중엔 제외)
  useEffect(() => {
    if (!detailDessert || lightbox) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') navigateDetail(-1)
      else if (e.key === 'ArrowRight') navigateDetail(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detailDessert, lightbox, navigateDetail])

  const footer = (
    <div className="flex justify-center items-start gap-5 pt-2">
      <InkButton size="sm" tone="honey" arrow={false} onClick={onRestart}>
        다시하기
      </InkButton>
      <InkButton size="sm" onClick={onExit}>
        돌아가기
      </InkButton>
    </div>
  )

  return (
    <div className="min-h-[100dvh] relative">
      {/* 책갈피 책상 원화(흐림) + 금장 테두리 — 결과 화면과 같은 배경 */}
      <ArtBackdrop src={bookmarkBg} veil="bg-cream/45" />

      <AnimatePresence mode="wait">
        {!detailDessert ? (
          /* ===== 도감 그리드 (디저트 / 카드 탭) ===== */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-[100dvh] flex flex-col"
          >
            <div className="w-full max-w-4xl mx-auto px-4 pt-[max(2rem,9dvh)] portrait:pt-[7.5rem] portrait:md:pt-[max(2rem,9dvh)] pb-10 flex flex-col">
              {/* 헤더: 닫기 · 탭 · 종 수 */}
              <div className="relative flex items-center justify-between gap-3">
                <RoundButton icon="close" size="sm" onClick={onExit} aria-label="결과로 돌아가기" />
                <div role="tablist" aria-label="도감 종류"
                     className="gold-rim rounded-full p-1 flex items-center gap-1
                                shadow-[0_10px_24px_-14px_rgba(94,70,50,0.6)]">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={tab === t.id}
                      onClick={() => setTab(t.id)}
                      className={`font-display font-bold text-base md:text-xl leading-none rounded-full
                                  px-5 md:px-8 py-2.5 md:py-3 cursor-pointer transition-colors
                                  ${tab === t.id
                                    ? 'bg-gradient-to-b from-[#FFFAEA] to-[#F5DE9C] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_14px_-8px_rgba(94,70,50,0.5)]'
                                    : 'text-ink/55 hover:text-ink'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <span className="font-display text-xs md:text-sm text-ink/70 tracking-wider min-w-9 text-right">
                  {TABS.find((t) => t.id === tab).count}
                </span>
              </div>

              <Divider variant="wave" className="w-full h-3 text-ink/35 my-5" />

              <AnimatePresence mode="wait">
                {tab === 'dessert' ? (
                  <motion.div
                    key="desserts"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 items-start"
                  >
                    {allDesserts.map(d => (
                      <motion.button
                        key={d.id}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setDetailDessert(d)}
                        aria-label={`${d.name} 자세히 보기`}
                        className="gold-rim aspect-[3/4] rounded-xl overflow-hidden flex flex-col relative
                                   shadow-[0_14px_24px_-16px_rgba(94,70,50,0.7)] cursor-pointer"
                      >
                        {/* 그리드는 512px 합성 썸네일 한 장(정지) — 레이어 스택 16개는 오래된 전시 PC에서 화면을 비운다. 움직임은 상세·결과에서 */}
                        <div className="flex-1 overflow-hidden flex items-center justify-center p-2
                                        bg-radial from-[#FFF8E8] to-[#F1DDB8]">
                          <img src={getDessertThumb(d.image)} alt={d.name} loading="lazy" draggable={false}
                               className="w-full h-full object-contain select-none" />
                        </div>
                        <div className="px-1.5 py-1.5 text-center border-t border-[#D6A64A]/40 bg-[#FBF3E3]">
                          <p className="font-display text-xs md:text-sm text-ink font-bold truncate">
                            {d.name}
                          </p>
                          <p className="font-display text-[0.625rem] md:text-[0.6875rem] text-ink/55 truncate">
                            {d.combo}
                          </p>
                        </div>
                        {currentResult?.id === d.id && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-jam rounded-full
                                          flex items-center justify-center shadow" aria-label="내 디저트">
                            <span className="text-[9px] text-cream leading-none">★</span>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-5 md:gap-6"
                  >
                    {CARD_ROWS.map((row) => (
                      <section key={row.id} className="flex flex-col gap-2 md:gap-3">
                        <h3 className="flex items-center justify-center gap-2 font-display text-sm md:text-base font-bold text-ink/85 tracking-wide">
                          <span className="w-8 h-px bg-ink/15" />
                          <Sparkle className="w-3 h-3 text-honey" />
                          {row.bookmark}
                          <Sparkle className="w-3 h-3 text-honey" />
                          <span className="w-8 h-px bg-ink/15" />
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch">
                          {[row.tiles.slice(0, 2), row.tiles.slice(2)].map((set, si) => (
                          <div key={si} className="contents">
                          {si === 1 && (
                            <div aria-hidden="true" className="border-t sm:border-t-0 sm:border-l border-dashed border-ink/25 sm:self-stretch sm:mx-0.5" />
                          )}
                          <div className="flex-1 grid grid-cols-2 gap-3 md:gap-4 items-start">
                          {set.map(({ side, card: c }) => (
                            <motion.button
                              key={`${c.id}-${side}`}
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setLightbox({ card: c, side })}
                              aria-label={side === 'back' ? `${c.label} 카드 뒷면 크게 보기` : `${c.ingredient} 카드 크게 보기`}
                              className="gold-rim rounded-xl overflow-hidden flex flex-col
                                         shadow-[0_14px_24px_-16px_rgba(94,70,50,0.7)] cursor-pointer"
                            >
                              <div className="aspect-[16/21] bg-radial from-[#FFF8E8] to-[#F1DDB8] p-2">
                                <img src={getCardImage(side === 'back' ? c.backImage : c.frontImage)}
                                     alt={side === 'back' ? c.label : c.ingredient} draggable={false}
                                     loading="lazy" className="w-full h-full object-contain select-none" />
                              </div>
                              <div className="px-1.5 py-1.5 text-center border-t border-[#D6A64A]/40 bg-[#FBF3E3]">
                                <p className="font-display text-xs md:text-sm text-ink font-bold truncate">
                                  {side === 'back' ? c.label : c.brief}
                                </p>
                                <p className="font-display text-[0.625rem] md:text-[0.6875rem] text-ink/55 truncate">
                                  {side === 'back' ? '선택지 · 뒷면' : `${c.ingredient} · 앞면`}
                                </p>
                              </div>
                            </motion.button>
                          ))}
                          </div>
                          </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-9">{footer}</div>
            </div>
          </motion.div>
        ) : (
          /* ===== 디저트 상세 ===== */
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-[100dvh] flex flex-col"
          >
            <div className="w-full max-w-4xl lg:max-w-5xl mx-auto px-4 pt-[max(1.5rem,8dvh)] portrait:pt-[8.5rem] portrait:md:pt-[max(1.5rem,8dvh)] pb-[max(1.5rem,6dvh)] flex-1 flex flex-col">
              <div className="flex justify-end">
                <RoundButton icon="close" size="sm" onClick={() => setDetailDessert(null)} aria-label="도감으로" />
              </div>

              {/* 메인: 화살표 + 카드 + 패널 */}
              <div className="flex-1 flex items-center gap-1 md:gap-3 py-4">
                <RoundButton icon="prev" onClick={() => navigateDetail(-1)} aria-label="이전" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={detailDessert.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col md:flex-row gap-5 md:gap-8 items-center max-w-3xl md:max-w-4xl mx-auto"
                  >
                    <DessertCard
                      dessert={detailDessert}
                      className="w-48 md:w-64 flex-shrink-0"
                      onClick={() => setLightbox({ dessert: detailDessert })}
                    />

                    {/* 정보 패널 (종이 노트) — 전부 가운데 정렬 */}
                    <div className="flex-1 w-full">
                      <div className="relative gold-rim rounded-2xl shadow-lg px-5 py-6 md:px-8 md:py-7 overflow-hidden
                                      flex flex-col items-center text-center">
                        <PaperGrain />
                        <h3 className="relative font-display text-xl md:text-3xl font-bold text-ink leading-tight">
                          {detailDessert.name}
                        </h3>
                        <Divider className="relative w-24 h-3 text-jam/60 my-3" />
                        <p className="relative font-display font-semibold text-ink text-sm md:text-base">
                          {detailDessert.personality}
                        </p>
                        <p className="relative font-display text-sm md:text-base text-ink/80 leading-relaxed mt-3">
                          <Sentences text={detailDessert.description} quote />
                        </p>
                        <div className="relative w-full border-t border-dashed border-ink/15 mt-5 pt-5">
                          <ComboCards
                            compact
                            combo={detailDessert.combo}
                            cards={resultCards(detailDessert)}
                            withBrief
                            onCard={(card) => setLightbox({ card })}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <RoundButton icon="next" onClick={() => navigateDetail(1)} aria-label="다음" />
              </div>

              {footer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardLightbox item={lightbox} onClose={closeLightbox} />

      {/* 확대 보기 → 닫기, 상세 → 도감 그리드, 그리드 → 결과 화면 */}
      <BackButton onClick={() => (lightbox ? closeLightbox() : detailDessert ? setDetailDessert(null) : onExit())} />
    </div>
  )
}
