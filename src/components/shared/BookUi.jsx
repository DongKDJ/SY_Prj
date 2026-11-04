import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedDessert from './AnimatedDessert'
import Sentences from './Sentences'
import { getCardImage } from '../../assets/imageMap'
import { cardPlate } from '../../assets/screenImages'
import { Sparkle, Floret } from './Decorations'

/**
 * 결과 화면·디저트 북·카드 도감이 같이 쓰는 금테 UI 조각 (2026-11-05 대표 재구성 지시).
 *  · RoundButton  — ◀ ▶ ✕ 를 글자 대신 도형으로 그려 정확히 가운데 (글자 글리프는 폰트마다 치우친다)
 *  · DessertCard  — 도감의 금테 3:4 카드 (결과 왼쪽 페이지도 이걸 쓴다)
 *  · ComboCards   — 조합 칩 한 줄 + 고른 카드 4장 썸네일 (누르면 크게)
 *  · CardLightbox — 카드·디저트 확대 보기 (어디서든 같은 모양)
 */

const icons = {
  prev:  <path d="M15 5 L7 12 L15 19" />,
  next:  <path d="M9 5 L17 12 L9 19" />,
  close: <path d="M6 6 L18 18 M18 6 L6 18" />,
}

export function RoundButton({ icon, size = 'md', className = '', ...rest }) {
  const sz = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10 md:w-12 md:h-12'
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`gold-rim rounded-full ${sz} flex items-center justify-center flex-shrink-0
                  text-ink/75 hover:text-ink transition-colors cursor-pointer
                  shadow-[0_8px_16px_-10px_rgba(94,70,50,0.6)] ${className}`}
      {...rest}
    >
      <svg viewBox="0 0 24 24" className="w-[45%] h-[45%]" fill="none" stroke="currentColor"
           strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {icons[icon]}
      </svg>
    </motion.button>
  )
}

/** 금테 3:4 디저트 카드. onClick이 있으면 버튼(확대 보기). */
export function DessertCard({ dessert, variant = 'card', className = '', onClick, animate = true }) {
  const Tag = onClick ? motion.button : 'div'
  const extra = onClick ? { type: 'button', whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, 'aria-label': `${dessert.name} 크게 보기` } : {}
  return (
    <Tag
      onClick={onClick}
      className={`gold-rim rounded-2xl overflow-hidden aspect-[3/4] flex items-center justify-center p-2
                  shadow-[0_18px_30px_-18px_rgba(94,70,50,0.6)] ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...extra}
    >
      <AnimatedDessert
        dessertId={dessert.id}
        image={dessert.image}
        name={dessert.name}
        variant={animate ? variant : 'thumb'}
        className="w-full h-full"
      />
    </Tag>
  )
}

/** 조합 칩 + 고른 카드 4장. cards = resultCards(result). */
export function ComboCards({ combo, cards, onCard, compact = false }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`flex items-center justify-center flex-wrap ${compact ? 'gap-1' : 'gap-1.5 md:gap-2'}`}>
        {combo.split('/').map((part, i, arr) => (
          <span key={i} className={`flex items-center ${compact ? 'gap-1' : 'gap-1.5 md:gap-2'}`}>
            <span className={`font-display text-ink gold-rim rounded-full py-0.5 whitespace-nowrap
                              ${compact ? 'text-xs md:text-sm px-2 md:px-3' : 'text-sm md:text-base px-3'}`}>
              {part.trim()}
            </span>
            {i < arr.length - 1 && <Sparkle className={`text-jam/70 ${compact ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />}
          </span>
        ))}
      </div>
      <div className="flex items-start justify-center gap-2 md:gap-3">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            type="button"
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onCard?.(card)}
            aria-label={`${card.ingredient} 카드 크게 보기`}
            className={`cursor-pointer rounded-lg overflow-hidden aspect-[16/21]
                        shadow-[0_10px_18px_-10px_rgba(94,70,50,0.65)]
                        ${compact ? 'w-12 md:w-16' : 'w-14 md:w-20'}`}
          >
            <img src={getCardImage(card.frontImage)} alt={card.ingredient} draggable={false}
                 className="w-full h-full object-cover select-none" />
          </motion.button>
        ))}
      </div>
      <p className="font-display text-[11px] md:text-xs text-ink/55 tracking-wide">카드를 누르면 크게 볼 수 있어요</p>
    </div>
  )
}

/**
 * 확대 보기. item = { card } 또는 { dessert }. 바깥을 누르거나 Esc·이전 버튼으로 닫힘.
 * 카드는 게임 중 뒤집었을 때와 같은 모양(카드 + 성격 명판 + 따옴표 설명)으로 열리고,
 * 카드를 한 번 더 누르면 카드 그림만 크게(다시 누르면 돌아옴) — 2026-11-05 대표 선택.
 */
export function CardLightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-cream/70 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="크게 보기"
        >
          <RoundButton icon="close" size="sm" onClick={onClose} aria-label="닫기"
                       className="absolute top-4 right-4 md:top-6 md:right-6" />
          <motion.div
            key={item.card ? `card-${item.card.id}` : `dessert-${item.dessert.id}`}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="relative flex flex-col items-center max-w-2xl w-full max-h-full overflow-y-auto px-2 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {item.card ? (
              <CardView card={item.card} />
            ) : (
              <>
                <DessertCard dessert={item.dessert} className="w-[clamp(12rem,44dvh,20rem)] md:w-[clamp(14rem,50dvh,24rem)]" />
                <p className="font-display text-2xl md:text-3xl font-bold text-ink text-center mt-5 leading-tight">
                  {item.dessert.name}
                </p>
                <p className="font-display text-sm md:text-base text-ink/70 text-center mt-1">
                  {item.dessert.personality}
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* 카드 확대 내용 — 카드가 바뀌면 다시 마운트되어 '카드만' 상태가 초기화된다 */
function CardView({ card }) {
  const [imageOnly, setImageOnly] = useState(false)
  const item = { card }
  return (
              <>
                <motion.button
                  type="button"
                  layout
                  onClick={() => setImageOnly((v) => !v)}
                  aria-label={imageOnly ? '카드 설명 보기' : '카드만 크게 보기'}
                  aria-pressed={imageOnly}
                  className={`cursor-zoom-in aspect-[16/21] shadow-[0_30px_50px_-24px_rgba(94,70,50,0.55)]
                              ${imageOnly
                                ? 'w-[min(88vw,calc(84dvh*16/21))] cursor-zoom-out'
                                : 'w-[clamp(10rem,36dvh,16rem)] md:w-[clamp(12rem,40dvh,18rem)]'}`}
                >
                  <img src={getCardImage(item.card.frontImage)} alt={item.card.ingredient} draggable={false}
                       className="w-full h-full object-contain select-none" />
                </motion.button>
                {!imageOnly && <>
                <div className="relative mt-2 w-64 md:w-80">
                  <img src={cardPlate} alt="" aria-hidden="true" draggable={false} className="w-full h-auto select-none" />
                  <div className="absolute inset-0 flex items-center justify-center pt-[5%] px-10">
                    <p className="font-display text-lg md:text-2xl font-bold text-ink text-center leading-tight whitespace-nowrap">
                      {item.card.brief}
                    </p>
                  </div>
                </div>
                <Floret className="w-4 h-4 text-honey mx-auto mt-5 mb-2" />
                <p className="font-display text-base md:text-lg text-ink leading-relaxed text-center max-w-xl px-2">
                  <Sentences text={item.card.description} quote />
                </p>
                <p className="font-display text-[11px] md:text-xs text-ink/55 tracking-wide mt-4">카드를 한 번 더 누르면 카드만 크게 보여요</p>
                </>}
              </>
  )
}
