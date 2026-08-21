import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dessertResults } from '../data/desserts'
import AnimatedDessert from './shared/AnimatedDessert'
import { InkButton } from './shared/InkButton'
import { PaperGrain, Divider } from './shared/Decorations'

const allDesserts = Object.values(dessertResults).sort((a, b) => a.id - b.id)

// 전시용: 도감은 처음부터 16종 전부 열람 가능 (2026-08-21 잠금 시스템 제거)
export default function DessertBook({ currentResult, onRestart, onExit }) {
  const [detailDessert, setDetailDessert] = useState(null)

  const navigateDetail = (dir) => {
    if (!detailDessert) return
    const idx = allDesserts.findIndex(d => d.id === detailDessert.id)
    let next = idx + dir
    if (next < 0) next = allDesserts.length - 1
    if (next >= allDesserts.length) next = 0
    setDetailDessert(allDesserts[next])
  }

  return (
    <div className="min-h-[100dvh] relative
                    bg-gradient-to-b from-[#F5DDB8] via-[#EFE0BE] to-[#E2C89C]">
      <PaperGrain />
      <div className="page-vignette" />

      <AnimatePresence mode="wait">
        {!detailDessert ? (
          /* ===== 그리드 뷰 ===== */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-[100dvh] flex flex-col"
          >
            <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-10 flex flex-col">
              {/* 헤더 */}
              <div className="relative flex items-center justify-between gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onExit}
                  aria-label="결과로 돌아가기"
                  className="w-9 h-9 rounded-full bg-ink/10 flex items-center justify-center
                             text-ink/70 cursor-pointer hover:bg-ink/20 transition-colors"
                >
                  ✕
                </motion.button>
                <div className="text-center">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
                    디저트 도감
                  </h2>
                  <p className="font-script text-sm text-jam">recipe collection</p>
                </div>
                <span className="font-display text-xs md:text-sm text-ink/55 tracking-wider
                                 min-w-9 text-right">
                  {allDesserts.length}종
                </span>
              </div>

              <Divider variant="wave" className="w-full h-3 text-ink/30 my-5" />

              {/* 카드 그리드 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 items-start">
                {allDesserts.map(d => (
                  <motion.button
                    key={d.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDetailDessert(d)}
                    className="aspect-[3/4] rounded-xl border overflow-hidden
                               flex flex-col relative
                               border-paper-edge bg-[#FBF3E3] shadow-md cursor-pointer"
                  >
                    <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#F3E2C2]">
                      <AnimatedDessert
                        dessertId={d.id}
                        image={d.image}
                        name={d.name}
                        variant="thumb"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="px-1.5 py-1.5 text-center border-t border-paper-edge bg-[#FBF3E3]">
                      <p className="font-display text-[10px] md:text-xs text-ink/80 font-semibold truncate">
                        {d.combo}
                      </p>
                    </div>
                    {currentResult?.id === d.id && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-jam rounded-full
                                      flex items-center justify-center shadow">
                        <span className="text-[9px] text-cream">★</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-center items-start gap-5 mt-9">
                <InkButton size="sm" tone="honey" arrow={false} onClick={onRestart}>
                  다시하기
                </InkButton>
                <InkButton size="sm" onClick={onExit}>
                  돌아가기
                </InkButton>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ===== 상세 뷰 ===== */
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-[100dvh] flex flex-col"
          >
            <div className="w-full max-w-3xl mx-auto px-4 py-6 flex-1 flex flex-col">
              {/* 그리드로 닫기 */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDetailDessert(null)}
                  aria-label="도감으로"
                  className="w-9 h-9 rounded-full bg-ink/10 flex items-center justify-center
                             text-ink/70 cursor-pointer hover:bg-ink/20 transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              {/* 메인: 화살표 + 카드 + 패널 */}
              <div className="flex-1 flex items-center gap-1 md:gap-3">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateDetail(-1)}
                  aria-label="이전"
                  className="flex-shrink-0 text-ink/45 text-2xl md:text-3xl
                             cursor-pointer hover:text-ink transition-colors px-1 md:px-2"
                >
                  ◀
                </motion.button>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={detailDessert.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col md:flex-row gap-5 md:gap-6
                               items-center max-w-2xl mx-auto"
                  >
                    {/* 카드 이미지 */}
                    <div className="w-48 md:w-60 flex-shrink-0">
                      <div className="bg-[#FBF3E3] rounded-2xl border border-paper-edge
                                      shadow-xl overflow-hidden aspect-[3/4]
                                      flex items-center justify-center p-2">
                        <AnimatedDessert
                          dessertId={detailDessert.id}
                          image={detailDessert.image}
                          name={detailDessert.name}
                          variant="card"
                          className="w-full h-full"
                        />
                      </div>
                    </div>

                    {/* 정보 패널 (종이 노트) */}
                    <div className="flex-1 w-full">
                      <div className="relative bg-[#FBF3E3] rounded-2xl border border-paper-edge
                                      shadow-lg p-5 md:p-6 overflow-hidden">
                        <PaperGrain />
                        <h3 className="relative font-display text-xl md:text-2xl font-bold
                                       text-ink text-center leading-tight">
                          {detailDessert.name}
                        </h3>
                        <div className="flex justify-center my-3">
                          <Divider className="w-24 h-3 text-jam/60" />
                        </div>
                        <p className="relative font-display font-semibold text-ink text-center
                                      text-sm md:text-base">
                          {detailDessert.personality}
                        </p>
                        <p className="relative font-display text-sm text-ink/80 leading-relaxed mt-4">
                          &ldquo;{detailDessert.description}&rdquo;
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateDetail(1)}
                  aria-label="다음"
                  className="flex-shrink-0 text-ink/45 text-2xl md:text-3xl
                             cursor-pointer hover:text-ink transition-colors px-1 md:px-2"
                >
                  ▶
                </motion.button>
              </div>

              {/* 하단 버튼 */}
              <div className="flex justify-center items-start gap-5 pt-2">
                <InkButton size="sm" tone="honey" arrow={false} onClick={onRestart}>
                  다시하기
                </InkButton>
                <InkButton size="sm" onClick={onExit}>
                  돌아가기
                </InkButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
