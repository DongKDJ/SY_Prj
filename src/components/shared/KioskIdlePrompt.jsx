import { motion } from 'framer-motion'
import { PaperGrain, Divider } from './Decorations'

/**
 * 키오스크 유휴 복귀 안내
 *
 * 관람객이 자리를 뜬 채로 남은 화면을 다음 사람이 보지 않도록 처음으로 되돌리기 전,
 * 잠깐 안내를 띄운다. 천천히 읽고 있을 뿐인 사람을 끊지 않기 위한 완충이라
 * 아무 조작이나 들어오면 즉시 취소된다.
 */
export default function KioskIdlePrompt({ secondsLeft }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-ink/45 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0.94, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 130, damping: 16 }}
        className="relative bg-paper border border-paper-edge rounded-md
                   px-10 py-8 text-center max-w-sm mx-6
                   shadow-[0_28px_50px_-22px_rgba(58,36,24,0.75)]"
      >
        <PaperGrain />

        <p className="relative font-script text-xl text-jam">still there?</p>

        <p className="relative font-display text-lg text-ink mt-1">
          잠시 후 처음으로 돌아갑니다
        </p>

        <div className="relative flex justify-center my-4">
          <Divider className="w-28 h-3 text-honey/80" />
        </div>

        <p className="relative font-display font-bold text-5xl text-ink leading-none tabular-nums">
          {secondsLeft}
        </p>

        <p className="relative font-display text-xs text-ink/60 mt-5 tracking-wide">
          화면을 만지면 이어서 계속할 수 있어요
        </p>
      </motion.div>
    </motion.div>
  )
}
