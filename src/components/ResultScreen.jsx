import { motion } from 'framer-motion'
import Character from './shared/Character'
import DialogBox from './shared/DialogBox'
import { foxDialogs } from '../data/desserts'
import { useState } from 'react'

export default function ResultScreen({ result, onViewBook }) {
  const [dialogDone, setDialogDone] = useState(false)

  if (!result) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-cream">
        <p className="text-brown">결과를 불러올 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-dawn via-cream to-cream-dark
                    relative overflow-hidden px-4 py-8">
      {/* 해뜨는 아침 배경 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-cabin-light/20 rounded-full blur-[100px]" />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64
                     bg-morning/40 rounded-full blur-[80px]"
        />
      </div>

      {/* 캐릭터 */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
        className="flex items-start gap-4 max-w-lg mx-auto mb-6 z-10 relative"
      >
        <Character variant="full" />
        {!dialogDone && (
          <div className="flex-1 mt-4">
            <DialogBox
              lines={foxDialogs.result}
              onComplete={() => setDialogDone(true)}
            />
          </div>
        )}
      </motion.div>

      {/* 디저트 결과 카드 */}
      {dialogDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="max-w-lg mx-auto z-10 relative"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* 디저트 카드 이미지 */}
            <motion.div
              initial={{ rotateY: -30 }}
              animate={{ rotateY: 0 }}
              className="w-48 h-64 bg-card rounded-2xl border-2 border-cabin/30
                         shadow-xl flex items-center justify-center flex-shrink-0
                         card-glow"
            >
              {/* placeholder - dessert image */}
              <div className="text-center p-4">
                <span className="text-5xl block mb-2">🍰</span>
                <p className="text-xs text-brown-light">{result.combo}</p>
                <p className="text-sm font-bold text-brown mt-2">{result.name}</p>
              </div>
            </motion.div>

            {/* 설명 */}
            <div className="flex-1 space-y-4">
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-5
                              border border-cabin/15">
                <p className="text-xs text-cabin font-semibold mb-1">한줄 성격</p>
                <p className="text-lg font-bold text-brown">{result.personality}</p>
              </div>

              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-5
                              border border-cabin/15">
                <p className="text-xs text-cabin font-semibold mb-1">디저트 설명</p>
                <p className="text-sm text-brown leading-relaxed italic">
                  "{result.description}"
                </p>
              </div>

              <div className="bg-cabin/10 rounded-2xl p-4 border border-cabin/10">
                <p className="text-xs text-cabin font-semibold mb-1">레시피북의 문장</p>
                <p className="text-sm text-brown leading-relaxed">
                  "{result.description}"
                </p>
              </div>
            </div>
          </div>

          {/* 공유 + 디저트북 버튼 */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const text = `나의 디저트는 "${result.name}"! - ${result.personality}\n${result.description}\n\n여우씨의 디저트 레시피에서 확인해보세요!`
                if (navigator.share) {
                  navigator.share({ title: '여우씨의 디저트 레시피', text })
                } else {
                  navigator.clipboard.writeText(text)
                  alert('결과가 클립보드에 복사되었습니다!')
                }
              }}
              className="bg-cabin-light/20 text-brown px-6 py-3 rounded-full
                         font-semibold border border-cabin/20
                         hover:bg-cabin-light/30 transition-colors cursor-pointer"
            >
              결과 공유하기
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onViewBook}
              className="bg-cabin text-cream px-6 py-3 rounded-full
                         font-semibold shadow-md
                         hover:bg-cabin-dark transition-colors cursor-pointer"
            >
              디저트 북 보기
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
