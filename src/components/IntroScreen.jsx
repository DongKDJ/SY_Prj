import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState(0)
  const calledRef = useRef(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 2500)
    const t3 = setTimeout(() => {
      // 한 번만 호출되도록 보호
      if (!calledRef.current) {
        calledRef.current = true
        onComplete()
      }
    }, 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, []) // 의존성 비움 — 마운트 시 1회만 실행

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: phase >= 2 ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="min-h-[100dvh] bg-night flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-night-text/60 text-sm mb-3">보글보글..</p>
          <p className="text-night-text text-lg">
            깊은 숲속 어디선가 흐르는<br />향긋한 버터의 향기..
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.5 : 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-night-text/40 text-sm mt-6"
          >
            향기를 따라가 볼까요?
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
