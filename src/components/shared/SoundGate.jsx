import { useEffect, useState, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hasSound, isMuted, isPlaying, subscribe } from '../../lib/sound'
import { PaperGrain } from './Decorations'
import { tapWord } from '../../lib/device'

/**
 * 소리 켜기 안내 (2026-11-05 대표: "사이트 들어가서 2번 터치해야 넘어가게").
 * 브라우저가 자동재생을 막아 배경음악이 못 나오면 타이틀 위에 덮어 "한 번 터치" 안내 —
 * 그 첫 터치는 App의 문서 리스너가 받아 음악을 켜고, 이 막은 사라진다(두 번째 터치가 시작하기).
 * 자동재생이 허용된 전시 PC(음악이 이미 나옴)·소리를 꺼 둔 기기에서는 안 뜬다.
 * 음악이 켜지는 데 한 박자 걸리므로 0.5초 뒤에도 안 나올 때만 보인다(허용 환경에서 깜빡임 방지).
 */
export default function SoundGate() {
  const muted = useSyncExternalStore(subscribe, isMuted)
  const playing = useSyncExternalStore(subscribe, isPlaying)
  const [dismissed, setDismissed] = useState(false)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 500)
    return () => clearTimeout(t)
  }, [])

  const show = hasSound() && armed && !dismissed && !muted && !playing
  const word = tapWord() // PC = 클릭, 폰·태블릿 = 터치

  useEffect(() => {
    if (!show) return
    const onKey = () => setDismissed(true)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sound-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onPointerDown={() => setDismissed(true)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-cream/35 backdrop-blur-[2px] cursor-pointer"
          role="button"
          aria-label={`${word}해서 소리 켜기`}
          data-sfx="none"
        >
          <motion.div
            initial={{ scale: 0.94, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 130, damping: 16 }}
            className="relative gold-rim rounded-2xl px-8 py-6 md:px-10 md:py-7 text-center max-w-xs md:max-w-sm mx-6
                       shadow-[0_28px_50px_-22px_rgba(94,70,50,0.7)]"
          >
            <PaperGrain />
            <svg viewBox="0 0 24 24" className="relative w-9 h-9 mx-auto text-ink/80" fill="none" stroke="currentColor"
                 strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor" fillOpacity="0.15" />
              <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
              <path d="M18.5 7a7 7 0 0 1 0 10" />
            </svg>
            <p className="relative font-display font-bold text-ink text-lg md:text-xl mt-3 leading-snug">
              화면을 한 번 {word}하면
              <br />소리가 켜져요
            </p>
            <p className="relative font-display text-xs md:text-sm text-ink/60 mt-2 tracking-wide">
              켜진 뒤 다시 {word}하면 시작합니다
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
