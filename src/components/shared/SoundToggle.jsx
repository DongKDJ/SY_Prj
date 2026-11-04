import { useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { hasSound, isMuted, setMuted, subscribe } from '../../lib/sound'

/**
 * 소리 켜기·끄기 — 오른쪽 아래 작은 금장 버튼(화면마다 같은 자리). 음원이 하나도 없으면 안 보인다.
 * 사진 찍기 화면은 아래 트레이와 겹쳐서 App이 숨긴다.
 */
export default function SoundToggle() {
  const muted = useSyncExternalStore(subscribe, isMuted)
  if (!hasSound()) return null
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={() => setMuted(!muted)}
      aria-label={muted ? '소리 켜기' : '소리 끄기'}
      aria-pressed={!muted}
      className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 w-11 h-11 rounded-full gold-rim
                 flex items-center justify-center text-ink/80 cursor-pointer
                 shadow-[0_8px_16px_-10px_rgba(94,70,50,0.6)]"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8"
           strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor" fillOpacity="0.15" />
        {muted ? (
          <path d="M16 9l5 6M21 9l-5 6" />
        ) : (
          <>
            <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
            <path d="M18.5 7a7 7 0 0 1 0 10" />
          </>
        )}
      </svg>
    </motion.button>
  )
}
