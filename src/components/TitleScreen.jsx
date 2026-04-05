import { motion } from 'framer-motion'

export default function TitleScreen({ onStart }) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-cream relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cabin-light/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cabin/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-dawn/40 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10"
      >
        {/* 타이틀 영역 - 이미지로 교체 가능 */}
        <div className="bg-cream-dark/60 backdrop-blur-sm rounded-3xl px-10 py-8
                        border border-cabin/15 shadow-lg mb-12 max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-brown tracking-tight leading-snug">
            여우씨의<br />디저트 레시피
          </h1>
          <p className="text-brown-light/70 text-sm mt-3">
            나만의 디저트로 알아보는 성격 이야기
          </p>
        </div>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-cabin text-cream px-12 py-4 rounded-full
                     text-lg font-semibold shadow-lg
                     hover:bg-cabin-dark transition-colors duration-300
                     cursor-pointer"
        >
          스타트
        </motion.button>
      </motion.div>
    </div>
  )
}
