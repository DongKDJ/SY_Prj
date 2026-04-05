import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import DialogBox from './shared/DialogBox'

export default function ResultTransition({ onComplete }) {
  const [dialogDone, setDialogDone] = useState(false)
  const calledRef = useRef(false)

  const handleComplete = () => {
    if (calledRef.current) return
    calledRef.current = true
    onComplete()
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-night via-night/90 to-cabin-dark/40
                    flex flex-col items-center justify-end pb-8 px-4">
      {/* 오븐 안에서 굽고 있는 연출 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex-1 flex items-center justify-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-center"
        >
          <span className="text-6xl block mb-4">🔥</span>
          <p className="text-night-text/60 text-sm">디저트가 구워지고 있어요...</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <DialogBox
          lines={[
            '드디어 완성이 다 되어가!',
            '너의 이야기가 담긴 디저트를 확인해볼까?',
          ]}
          onComplete={() => setDialogDone(true)}
        />
      </motion.div>

      {dialogDone && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleComplete}
          className="mt-6 bg-cabin text-cream px-8 py-3 rounded-full
                     font-semibold shadow-lg cursor-pointer
                     hover:bg-cabin-dark transition-colors"
        >
          책장 넘기기
        </motion.button>
      )}
    </div>
  )
}
