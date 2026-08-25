import { motion } from 'framer-motion'
import backButtonImg from '../../assets/images/ui/back-button.png'

/**
 * 이전으로 — 원화 사과 버튼. 전 화면 공통으로 좌상단에 고정.
 *
 * 화면 전체가 탭 영역인 화면(대화·책갈피·결과)에서는 그 탭 버튼보다 위(z-50)에 놓아야
 * 클릭이 먹는다. 버튼 안에 버튼을 넣을 수 없으므로 항상 형제로 배치할 것.
 */
export default function BackButton({ onClick, label = '이전으로', className = '' }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.08, rotate: -4 }}
      whileTap={{ scale: 0.93 }}
      className={`absolute top-4 left-4 md:top-6 md:left-6 z-50 w-20 md:w-24 cursor-pointer
                  drop-shadow-[0_6px_14px_rgba(58,36,24,0.5)] ${className}`}
    >
      <img
        src={backButtonImg}
        alt=""
        draggable={false}
        className="w-full h-auto select-none"
      />
    </motion.button>
  )
}
