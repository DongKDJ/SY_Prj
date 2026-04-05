import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedDessert from './shared/AnimatedDessert'

// 컨페티 파티클 생성
function createConfetti(id) {
  const shapes = ['●', '★', '♥', '✦', '◆', '▲']
  const colors = [
    'text-pink-400', 'text-yellow-300', 'text-sky-300',
    'text-green-300', 'text-purple-300', 'text-orange-300',
    'text-rose-400', 'text-amber-200', 'text-teal-300',
  ]
  return {
    id,
    char: shapes[Math.floor(Math.random() * shapes.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    x: -50 + Math.random() * 100,
    startY: -20 - Math.random() * 40,
    endY: 110 + Math.random() * 30,
    size: 10 + Math.random() * 18,
    delay: Math.random() * 1.2,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 720 - 360,
    drift: -30 + Math.random() * 60,
  }
}

// Phase: 'reveal' → 'detail'
export default function ResultScreen({ result, onViewBook }) {
  const [phase, setPhase] = useState('reveal')
  const confetti = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => createConfetti(i)), []
  )

  if (!result) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-cream">
        <p className="text-brown">결과를 불러올 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-cream relative overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ===== Phase 1: 디저트 공개 연출 ===== */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-[100dvh] flex items-center justify-center relative"
          >
            {/* 배경 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFE4D6] via-[#FFDBC8] to-[#E8C4A8]" />

            {/* 배경 빛줄기 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 1.5 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[500px] h-[500px] rounded-full
                         bg-gradient-radial from-white/60 via-white/20 to-transparent
                         blur-2xl"
            />

            {/* 컨페티 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {confetti.map(c => (
                <motion.span
                  key={c.id}
                  initial={{
                    x: `${c.x}vw`,
                    y: `${c.startY}vh`,
                    rotate: 0,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: `${c.x + c.drift}vw`,
                    y: `${c.endY}vh`,
                    rotate: c.rotation,
                    opacity: [0, 1, 1, 0.6],
                    scale: [0, 1.2, 1, 0.8],
                  }}
                  transition={{
                    duration: c.duration,
                    delay: c.delay,
                    ease: 'easeOut',
                  }}
                  className={`absolute ${c.color} pointer-events-none`}
                  style={{ fontSize: `${c.size}px` }}
                >
                  {c.char}
                </motion.span>
              ))}
            </div>

            {/* 디저트 이미지 (중앙 크게) */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotateZ: -10 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 60, damping: 12 }}
              className="relative z-10"
            >
              {/* 글로우 링 */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(255,200,150,0.3)',
                    '0 0 80px rgba(255,200,150,0.6)',
                    '0 0 40px rgba(255,200,150,0.3)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-52 h-52 md:w-72 md:h-72 rounded-full
                           bg-gradient-to-br from-white/40 to-cream-dark/30
                           flex items-center justify-center
                           border-2 border-white/40 backdrop-blur-sm"
              >
                {/* 디저트 레이어 애니메이션 */}
                <AnimatedDessert
                  dessertId={result.id}
                  image={result.image}
                  name={result.name}
                  variant="full"
                  className="w-32 h-32 md:w-44 md:h-44"
                  imgClassName="w-32 h-32 md:w-44 md:h-44 object-contain"
                />
              </motion.div>

              {/* 디저트 이름 */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-center mt-6"
              >
                <p className="text-2xl md:text-3xl font-bold text-brown">
                  {result.name}
                </p>
                <p className="text-sm text-brown-light/70 mt-2">
                  {result.personality}
                </p>
              </motion.div>
            </motion.div>

            {/* 탭하여 계속 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute bottom-8 left-0 right-0 text-center z-30"
            >
              <span className="text-xs text-brown/50 bg-white/30 px-4 py-1.5 rounded-full">
                탭하여 계속
              </span>
            </motion.div>

            {/* 전체 탭 영역 */}
            <button
              onClick={() => setPhase('detail')}
              className="absolute inset-0 z-40 cursor-pointer"
            />
          </motion.div>
        )}

        {/* ===== Phase 2: 결과 상세 화면 ===== */}
        {phase === 'detail' && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-[100dvh] relative"
          >
            {/* 배경 */}
            <div className="absolute inset-0 bg-gradient-to-b from-cream-dark via-cream to-cream-dark" />
            {/* 하단 곡선 장식 */}
            <div className="absolute bottom-0 left-0 right-0 h-32
                            bg-cabin-dark/15 rounded-t-[50%_100%]" />

            {/* 메인 콘텐츠 */}
            <div className="relative z-10 min-h-[100dvh] flex flex-col
                            items-center justify-center px-4 py-8">
              {/* 데스크톱: 좌우 배치, 모바일: 세로 배치 */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-10
                              items-center md:items-start max-w-4xl w-full">

                {/* 좌: 디저트 카드 이미지 */}
                <motion.div
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex-shrink-0 w-64 md:w-80"
                >
                  <div className="bg-card rounded-3xl border-2 border-cabin/15
                                  shadow-2xl overflow-hidden aspect-[3/4]
                                  flex flex-col items-center justify-center">
                    {/* 디저트 레이어 애니메이션 */}
                    <div className="flex-1 w-full bg-cream-dark/30
                                    flex items-center justify-center p-4">
                      <AnimatedDessert
                        dessertId={result.id}
                        image={result.image}
                        name={result.name}
                        variant="card"
                        className="w-full h-full"
                        imgClassName="w-full h-full object-contain"
                      />
                    </div>
                    {/* 카드 하단: 이름 */}
                    <div className="w-full px-4 py-3 bg-white/60 text-center
                                    border-t border-cabin/10">
                      <p className="text-lg md:text-xl font-bold text-brown">
                        {result.name}
                      </p>
                      <p className="text-xs text-brown-light/50 mt-0.5">{result.combo}</p>
                    </div>
                  </div>
                </motion.div>

                {/* 우: 성격 + 설명 + 레시피북 문장 */}
                <motion.div
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="flex-1 max-w-md w-full"
                >
                  <div className="bg-card/50 backdrop-blur-sm rounded-3xl
                                  border border-cabin/10 shadow-xl overflow-hidden">
                    {/* 한줄 성격 */}
                    <div className="px-6 py-4 border-b border-cabin/10 bg-cabin/5">
                      <p className="text-center text-lg md:text-xl font-bold text-brown">
                        {result.personality}
                      </p>
                    </div>

                    {/* 디저트 설명 */}
                    <div className="px-6 py-6 border-b border-cabin/10">
                      <p className="text-xs text-cabin font-semibold mb-2">디저트 설명</p>
                      <p className="text-sm md:text-base text-brown leading-relaxed">
                        "{result.description}"
                      </p>
                    </div>

                    {/* 레시피북의 문장 */}
                    <div className="px-6 py-5 bg-cabin/5">
                      <p className="text-xs text-cabin font-semibold mb-2">레시피북의 문장</p>
                      <p className="text-sm text-brown-light leading-relaxed italic">
                        "{result.description}"
                      </p>
                    </div>
                  </div>

                  {/* 버튼들 */}
                  <div className="flex justify-center gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        const text = `나의 디저트는 "${result.name}"!\n성격: ${result.personality}\n\n${result.description}\n\n여우씨의 디저트 레시피에서 확인해보세요!`
                        if (navigator.share) {
                          navigator.share({ title: '여우씨의 디저트 레시피', text })
                        } else {
                          navigator.clipboard.writeText(text)
                          alert('결과가 클립보드에 복사되었습니다!')
                        }
                      }}
                      className="bg-cabin-light/20 text-brown px-5 py-2.5 rounded-full
                                 text-sm font-semibold border border-cabin/20
                                 hover:bg-cabin-light/30 transition-colors cursor-pointer"
                    >
                      결과 공유하기
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onViewBook}
                      className="bg-cabin text-cream px-5 py-2.5 rounded-full
                                 text-sm font-semibold shadow-md
                                 hover:bg-cabin-dark transition-colors cursor-pointer"
                    >
                      디저트 북 보기
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
