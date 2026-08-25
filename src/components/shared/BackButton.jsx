import { motion } from 'framer-motion'
import backButtonImg from '../../assets/images/ui/back-button.png'

/**
 * 이전으로 — 원화 사과 버튼. 전 화면 공통으로 좌하단에 고정 (작가가 원화 캔버스에 놓은 자리).
 * 단 세로 화면에서는 좌상단 — 대화 화면의 대사 스트립이 하단을 쓰기 때문.
 * fixed 인 이유: 도감처럼 화면보다 긴 페이지에서 absolute 로 두면 버튼이 문서 맨 아래로 밀려난다.
 *
 * 폭 10vw = 작가가 3840x2160 캔버스에 그려준 크기(385px = 캔버스 폭의 10%) 그대로.
 * 폰에서는 104px, 큰 모니터에서는 208px에서 멈춘다.
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
      className={`fixed left-4 md:left-6 z-50 cursor-pointer
                  landscape:bottom-4 landscape:md:bottom-6 portrait:top-4
                  w-[clamp(104px,10vw,208px)]
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
