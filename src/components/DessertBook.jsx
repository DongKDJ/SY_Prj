import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dessertResults } from '../data/desserts'
import { getDessertImage, cardBack } from '../assets/imageMap'

const allDesserts = Object.values(dessertResults).sort((a, b) => a.id - b.id)

// 4개씩 행으로 나누기
const rows = []
for (let i = 0; i < allDesserts.length; i += 4) {
  rows.push(allDesserts.slice(i, i + 4))
}

function getUnlocked() {
  try {
    const saved = localStorage.getItem('fox-dessert-unlocked')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function saveUnlocked(ids) {
  try { localStorage.setItem('fox-dessert-unlocked', JSON.stringify(ids)) }
  catch { /* ignore */ }
}

export default function DessertBook({ currentResult, onRestart, onExit }) {
  const [unlockedIds, setUnlockedIds] = useState(() => getUnlocked())
  const [detailDessert, setDetailDessert] = useState(null)

  useEffect(() => {
    if (currentResult && !unlockedIds.includes(currentResult.id)) {
      const next = [...unlockedIds, currentResult.id]
      setUnlockedIds(next)
      saveUnlocked(next)
    }
  }, [currentResult])

  const isUnlocked = (id) => unlockedIds.includes(id)
  const unlockedDesserts = allDesserts.filter(d => isUnlocked(d.id))

  const navigateDetail = (dir) => {
    if (!detailDessert) return
    const idx = unlockedDesserts.findIndex(d => d.id === detailDessert.id)
    let next = idx + dir
    if (next < 0) next = unlockedDesserts.length - 1
    if (next >= unlockedDesserts.length) next = 0
    setDetailDessert(unlockedDesserts[next])
  }

  return (
    <div className="min-h-[100dvh] bg-cream-dark relative">
      <AnimatePresence mode="wait">
        {!detailDessert ? (
          /* ===== 그리드 뷰: 한 행에 4장, 세로 스크롤 ===== */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[100dvh] flex flex-col"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 py-4 bg-cream-dark">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onExit}
                className="w-8 h-8 rounded-full bg-cabin/15 flex items-center justify-center
                           text-brown cursor-pointer hover:bg-cabin/25 transition-colors text-sm"
              >
                ✕
              </motion.button>
              <h2 className="text-xl font-bold text-brown">디저트 북</h2>
              <p className="text-[10px] text-brown-light/50 text-right leading-tight">
                스크롤 내리며 다른<br />카드 스캔 가능
              </p>
            </div>

            {/* 카드 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto px-3 pb-24">
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-2.5 mb-2.5">
                  {row.map(d => {
                    const unlocked = isUnlocked(d.id)
                    return (
                      <motion.button
                        key={d.id}
                        whileHover={unlocked ? { scale: 1.03 } : {}}
                        whileTap={unlocked ? { scale: 0.97 } : {}}
                        onClick={() => unlocked && setDetailDessert(d)}
                        className={`flex-1 aspect-[3/4] rounded-2xl border-2 overflow-hidden
                                   flex flex-col relative
                                   ${unlocked
                                     ? 'border-cabin/20 bg-card shadow-lg cursor-pointer'
                                     : 'border-cabin/10 cursor-default'
                                   }`}
                      >
                        {unlocked ? (
                          /* 앞면: 카드 이미지만 (이름/설명 없음) */
                          <div className="w-full h-full flex flex-col">
                            <div className="flex-1 bg-gradient-to-b from-cream via-cream-dark/20 to-cabin-light/10
                                            flex items-center justify-center overflow-hidden">
                              {getDessertImage(d.image)
                                ? <img src={getDessertImage(d.image)} alt={d.name} className="w-full h-full object-cover" />
                                : <span className="text-4xl md:text-5xl">🍰</span>
                              }
                            </div>
                            {/* 하단: 조합법 */}
                            <div className="px-1.5 py-2 bg-cabin/8 text-center border-t border-cabin/10">
                              <p className="text-[10px] md:text-xs text-brown font-semibold">
                                {d.combo}
                              </p>
                            </div>
                            {/* 현재 결과 표시 */}
                            {currentResult?.id === d.id && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-cabin rounded-full
                                              flex items-center justify-center shadow-md">
                                <span className="text-[9px] text-cream">★</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* 뒷면: card-back 이미지 */
                          <div className="w-full h-full flex flex-col">
                            <div className="flex-1 overflow-hidden flex items-center justify-center">
                              <img src={cardBack} alt="미해금" className="w-full h-full object-cover opacity-70" />
                            </div>
                            <div className="px-1.5 py-2 bg-cabin/8 text-center border-t border-cabin/10">
                              <p className="text-[10px] md:text-xs text-brown/40 font-semibold">???</p>
                            </div>
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* 고정 하단 바 */}
            <div className="fixed bottom-0 left-0 right-0 bg-cream-dark/95 backdrop-blur-sm
                            border-t border-cabin/10 px-4 py-3
                            flex items-center justify-between z-50">
              <p className="text-xs text-brown-light/50">
                {unlockedIds.length} / {allDesserts.length} 해금
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onRestart}
                  className="bg-cabin-light/20 text-brown px-4 py-2 rounded-lg
                             text-xs font-semibold border border-cabin/15
                             cursor-pointer"
                >
                  다시하기
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onExit}
                  className="bg-cabin text-cream px-4 py-2 rounded-lg
                             text-xs font-semibold shadow-md cursor-pointer"
                >
                  나가기
                </motion.button>
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
            className="min-h-[100dvh] bg-cabin-dark/95 flex flex-col"
          >
            {/* 닫기 */}
            <div className="flex justify-end p-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDetailDessert(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                           text-cream/70 cursor-pointer hover:bg-white/20 transition-colors text-sm"
              >
                ✕
              </motion.button>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 flex items-center px-2">
              {/* 좌측 화살표 */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateDetail(-1)}
                className="flex-shrink-0 text-cream/70 text-2xl md:text-3xl
                           cursor-pointer hover:text-cream transition-colors px-1 md:px-3"
              >
                ◀
              </motion.button>

              {/* 카드 + 설명 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={detailDessert.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6
                             items-center md:items-stretch max-w-3xl mx-auto"
                >
                  {/* 좌: 디저트 카드 이미지 */}
                  <div className="w-52 md:w-72 flex-shrink-0">
                    <div className="bg-card rounded-2xl border-2 border-cabin/20
                                    shadow-xl overflow-hidden aspect-[3/4]
                                    flex items-center justify-center">
                      {getDessertImage(detailDessert.image)
                        ? <img src={getDessertImage(detailDessert.image)} alt={detailDessert.name} className="w-full h-full object-contain p-2" />
                        : <span className="text-7xl md:text-8xl">🍰</span>
                      }
                    </div>
                  </div>

                  {/* 우: 정보 패널 */}
                  <div className="flex-1 max-w-md w-full">
                    <div className="bg-card/90 rounded-2xl border border-cabin/15
                                    shadow-lg overflow-hidden h-full flex flex-col">
                      {/* 디저트 이름 */}
                      <div className="px-5 py-4 border-b border-cabin/10 bg-white/40">
                        <h3 className="text-xl md:text-2xl font-bold text-brown text-center">
                          {detailDessert.name}
                        </h3>
                      </div>

                      {/* 한줄 성격 */}
                      <div className="px-5 py-3 border-b border-cabin/10 bg-cabin/5">
                        <p className="text-sm md:text-base font-semibold text-brown text-center">
                          {detailDessert.personality}
                        </p>
                      </div>

                      {/* 디저트 설명 */}
                      <div className="px-5 py-4 border-b border-cabin/10 flex-1">
                        <p className="text-sm text-brown leading-relaxed">
                          "{detailDessert.description}"
                        </p>
                      </div>

                      {/* 레시피북의 문장 */}
                      <div className="px-5 py-4 bg-cabin/5">
                        <p className="text-xs text-cabin font-semibold mb-1">레시피북의 문장</p>
                        <p className="text-sm text-brown-light leading-relaxed italic">
                          "{detailDessert.description}"
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 우측 화살표 */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateDetail(1)}
                className="flex-shrink-0 text-cream/70 text-2xl md:text-3xl
                           cursor-pointer hover:text-cream transition-colors px-1 md:px-3"
              >
                ▶
              </motion.button>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-end gap-3 p-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onRestart}
                className="bg-white/10 text-cream/80 px-5 py-2.5 rounded-lg
                           text-sm font-semibold border border-white/10
                           cursor-pointer"
              >
                다시하기
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onExit}
                className="bg-white/15 text-cream/80 px-5 py-2.5 rounded-lg
                           text-sm font-semibold border border-white/10
                           cursor-pointer"
              >
                나가기
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
