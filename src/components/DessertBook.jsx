import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dessertResults } from '../data/desserts'

const allDesserts = Object.values(dessertResults).sort((a, b) => a.id - b.id)

export default function DessertBook({ currentResult, onRestart, onExit }) {
  const [selectedIndex, setSelectedIndex] = useState(
    currentResult ? allDesserts.findIndex(d => d.id === currentResult.id) : 0
  )

  const dessert = allDesserts[selectedIndex]

  const navigate = (dir) => {
    setSelectedIndex(prev => {
      const next = prev + dir
      if (next < 0) return allDesserts.length - 1
      if (next >= allDesserts.length) return 0
      return next
    })
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-cream-dark to-cream
                    px-4 py-8 overflow-hidden">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-brown">디저트 북</h2>
        <p className="text-sm text-brown-light/60 mt-1">
          스크롤하여 다른 디저트를 구경해보세요
        </p>
      </motion.div>

      {/* 도감 그리드 */}
      <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-8">
        {allDesserts.map((d, i) => (
          <motion.button
            key={d.id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIndex(i)}
            className={`aspect-square rounded-xl border-2 flex items-center justify-center
                       text-2xl cursor-pointer transition-all duration-200
                       ${selectedIndex === i
                         ? 'border-cabin bg-cabin/10 shadow-md'
                         : currentResult?.id === d.id
                           ? 'border-cabin-light bg-card'
                           : 'border-cabin/10 bg-card/40'}`}
          >
            {/* placeholder - 디저트 이미지 썸네일 */}
            <div className="text-center">
              <span className="text-lg">🍰</span>
              <p className="text-[8px] text-brown-light leading-tight mt-0.5 px-0.5">
                {d.id}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 선택된 디저트 상세 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={dessert.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="max-w-lg mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center
                          bg-card/60 backdrop-blur-sm rounded-3xl p-6
                          border border-cabin/15 shadow-lg">
            {/* 좌: 디저트 이미지 */}
            <div className="w-40 h-52 bg-cream rounded-2xl border border-cabin/20
                            flex items-center justify-center flex-shrink-0 shadow-md">
              <div className="text-center">
                <span className="text-4xl block mb-2">🍰</span>
                <p className="text-xs text-brown-light px-2">{dessert.combo}</p>
              </div>
            </div>

            {/* 우: 정보 */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div>
                <h3 className="text-xl font-bold text-brown">{dessert.name}</h3>
                <p className="text-sm text-cabin font-semibold mt-1">{dessert.personality}</p>
              </div>

              <div className="bg-cream/60 rounded-xl p-3">
                <p className="text-sm text-brown leading-relaxed italic">
                  "{dessert.description}"
                </p>
              </div>

              {currentResult?.id === dessert.id && (
                <span className="inline-block bg-cabin/10 text-cabin text-xs
                               px-3 py-1 rounded-full font-semibold">
                  나의 디저트
                </span>
              )}
            </div>
          </div>

          {/* 좌우 네비게이션 */}
          <div className="flex justify-between items-center mt-4 px-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-cabin/10 flex items-center justify-center
                         text-brown cursor-pointer hover:bg-cabin/20 transition-colors"
            >
              ◀
            </motion.button>

            <span className="text-sm text-brown-light">
              {dessert.id} / {allDesserts.length}
            </span>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(1)}
              className="w-10 h-10 rounded-full bg-cabin/10 flex items-center justify-center
                         text-brown cursor-pointer hover:bg-cabin/20 transition-colors"
            >
              ▶
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 하단 버튼 */}
      <div className="flex justify-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRestart}
          className="bg-cabin-light/20 text-brown px-6 py-3 rounded-full
                     font-semibold border border-cabin/20
                     hover:bg-cabin-light/30 transition-colors cursor-pointer"
        >
          다시하기
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onExit}
          className="bg-cabin text-cream px-6 py-3 rounded-full
                     font-semibold shadow-md
                     hover:bg-cabin-dark transition-colors cursor-pointer"
        >
          나가기
        </motion.button>
      </div>
    </div>
  )
}
