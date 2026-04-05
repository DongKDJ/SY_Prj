import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ResultTransition({ onComplete }) {
  const [showButton, setShowButton] = useState(false)
  const calledRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleComplete = () => {
    if (calledRef.current) return
    calledRef.current = true
    onComplete()
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-night via-night/90 to-cabin-dark/40
                    flex flex-col items-center justify-center px-4">
      {/* 오븐 연출 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-10"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-6xl block mb-4">🔥</span>
        </motion.div>
        <p className="text-night-text/60 text-sm">디저트가 구워지고 있어요...</p>
      </motion.div>

      {/* 대사 1줄 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-cream-dark/90 backdrop-blur-sm rounded-2xl px-6 py-4
                   border-2 border-cabin/30 shadow-lg max-w-md mx-auto text-center"
      >
        <p className="text-brown text-base">
          <span className="text-cabin font-semibold mr-2">여우씨</span>
          너의 이야기가 담긴 디저트를 확인해볼까?
        </p>
      </motion.div>

      {/* 책장 넘기기 버튼 */}
      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleComplete}
          className="mt-8 bg-cabin text-cream px-8 py-3 rounded-full
                     font-semibold shadow-lg cursor-pointer
                     hover:bg-cabin-dark transition-colors"
        >
          책장 넘기기
        </motion.button>
      )}
    </div>
  )
}
