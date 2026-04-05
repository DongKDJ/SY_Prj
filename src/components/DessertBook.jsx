import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dessertResults } from '../data/desserts'

const allDesserts = Object.values(dessertResults).sort((a, b) => a.id - b.id)

// localStorage로 해금 목록 관리
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

  // 현재 결과를 해금 목록에 추가
  useEffect(() => {
    if (currentResult && !unlockedIds.includes(currentResult.id)) {
      const next = [...unlockedIds, currentResult.id]
      setUnlockedIds(next)
      saveUnlocked(next)
    }
  }, [currentResult])

  const isUnlocked = (id) => unlockedIds.includes(id)

  // 해금된 디저트만 탐색
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
    <div className="min-h-[100dvh] bg-gradient-to-b from-cream-dark to-cream relative">
      <AnimatePresence mode="wait">
        {!detailDessert ? (
          /* ===== 그리드 뷰 ===== */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-8"
          >
            {/* 헤더 */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brown">디저트 북</h2>
              <p className="text-sm text-brown-light/60 mt-1">
                스크롤 내리며 다른 카드 스캔 가능
              </p>
            </div>

            {/* 4×4 그리드 */}
            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
              {allDesserts.map((d, i) => {
                const unlocked = isUnlocked(d.id)
                return (
                  <motion.button
                    key={d.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={unlocked ? { scale: 1.05 } : {}}
                    whileTap={unlocked ? { scale: 0.95 } : {}}
                    onClick={() => unlocked && setDetailDessert(d)}
                    className={`aspect-[3/4] rounded-xl border-2 overflow-hidden
                               transition-all duration-200 relative
                               ${unlocked
                                 ? 'border-cabin/25 bg-card shadow-md cursor-pointer hover:shadow-lg'
                                 : 'border-cabin/10 bg-cabin-dark/8 cursor-default'
                               }`}
                  >
                    {unlocked ? (
                      /* 앞면: 해금된 디저트 */
                      <div className="w-full h-full flex flex-col">
                        <div className="flex-1 bg-cream-dark/20 flex items-center justify-center">
                          {/* placeholder 디저트 이미지 */}
                          <span className="text-2xl md:text-3xl">🍰</span>
                        </div>
                        <div className="px-1 py-1.5 bg-white/50 text-center">
                          <p className="text-[9px] md:text-[10px] font-bold text-brown leading-tight
                                        line-clamp-2">
                            {d.name}
                          </p>
                        </div>
                        {currentResult?.id === d.id && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-cabin rounded-full
                                          flex items-center justify-center">
                            <span className="text-[8px] text-cream">★</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* 뒷면: 미해금 카드 패턴 */
                      <div className="w-full h-full flex items-center justify-center
                                      bg-gradient-to-br from-cabin/8 via-cabin-light/5 to-cabin/10
                                      relative overflow-hidden">
                        {/* 장식 패턴 */}
                        <div className="absolute inset-2 border border-cabin/10 rounded-lg" />
                        <div className="absolute inset-4 border border-cabin/8 rounded-md" />
                        <div className="absolute w-8 h-8 border-2 border-cabin/12 rounded-full" />
                        <div className="absolute w-4 h-4 bg-cabin/8 rounded-full" />
                        {/* 꼭짓점 장식 */}
                        <div className="absolute top-2 left-2 w-2 h-2 bg-cabin/10 rounded-full" />
                        <div className="absolute top-2 right-2 w-2 h-2 bg-cabin/10 rounded-full" />
                        <div className="absolute bottom-2 left-2 w-2 h-2 bg-cabin/10 rounded-full" />
                        <div className="absolute bottom-2 right-2 w-2 h-2 bg-cabin/10 rounded-full" />
                        {/* 물음표 */}
                        <span className="text-cabin/20 text-2xl font-bold z-10">?</span>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* 해금 현황 */}
            <p className="text-center text-xs text-brown-light/50 mt-4">
              {unlockedIds.length} / {allDesserts.length} 해금됨
            </p>

            {/* 하단 버튼 */}
            <div className="flex justify-center gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRestart}
                className="bg-cabin-light/20 text-brown px-6 py-2.5 rounded-full
                           text-sm font-semibold border border-cabin/20
                           hover:bg-cabin-light/30 transition-colors cursor-pointer"
              >
                다시하기
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExit}
                className="bg-cabin text-cream px-6 py-2.5 rounded-full
                           text-sm font-semibold shadow-md
                           hover:bg-cabin-dark transition-colors cursor-pointer"
              >
                나가기
              </motion.button>
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
            {/* 닫기 (그리드로 돌아가기) */}
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
            <div className="flex-1 flex items-center px-4">
              {/* 좌측 화살표 */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateDetail(-1)}
                className="flex-shrink-0 text-cream/70 text-2xl md:text-3xl
                           cursor-pointer hover:text-cream transition-colors px-2"
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
                  <div className="w-56 md:w-72 flex-shrink-0">
                    <div className="bg-card rounded-2xl border-2 border-cabin/20
                                    shadow-xl overflow-hidden aspect-[3/4]
                                    flex flex-col">
                      <div className="flex-1 bg-cream-dark/30 flex items-center justify-center">
                        <span className="text-6xl md:text-7xl">🍰</span>
                      </div>
                      <div className="px-3 py-2 bg-white/50 text-center">
                        <p className="text-xs text-brown-light">{detailDessert.combo}</p>
                      </div>
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
                        <p className="text-xs text-cabin font-semibold mb-1.5">디저트 설명</p>
                        <p className="text-sm text-brown leading-relaxed">
                          "{detailDessert.description}"
                        </p>
                      </div>

                      {/* 레시피북의 문장 */}
                      <div className="px-5 py-4 bg-cabin/5">
                        <p className="text-xs text-cabin font-semibold mb-1.5">레시피북의 문장</p>
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
                           cursor-pointer hover:text-cream transition-colors px-2"
              >
                ▶
              </motion.button>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-end gap-3 p-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRestart}
                className="bg-white/10 text-cream/80 px-5 py-2.5 rounded-lg
                           text-sm font-semibold border border-white/10
                           hover:bg-white/20 transition-colors cursor-pointer"
              >
                다시하기
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExit}
                className="bg-white/15 text-cream/80 px-5 py-2.5 rounded-lg
                           text-sm font-semibold border border-white/10
                           hover:bg-white/25 transition-colors cursor-pointer"
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
