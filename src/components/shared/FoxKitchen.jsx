import { motion } from 'framer-motion'
import Character from './Character'
import { ArtStage, ArtLayer, GoldFrame } from './ArtStage'
import { openingBg, openingBubble, openingObject } from '../../assets/screenImages'

/* 여우씨 부엌 장면 (오프닝 원화) — 대화 화면과 오븐 대기 화면이 같은 무대를 쓴다.
   로딩 게이트 목록은 screenImages.js kitchenSrcs */

/* ── 배치 튜닝 상수 (스테이지 % 좌표, 3840x2160 원화 기준) ── */
// 책상 윗선: 이 높이에서 여우를 잘라 책상 뒤에 걸친 것처럼 보이게 한다
const DESK_TOP = '88%'
// 여우씨: 책상 뒤 중앙-왼쪽, 말풍선 꼬리(캔버스 약 53%, 72%)가 머리 오른쪽 위에 오도록.
// 얼굴이 잼병 오브젝트(캔버스 x 35~54%)에 가리지 않게 왼쪽에. bottom은 책상 윗선 기준.
const FOX = { left: '6%', width: '41%', bottom: '-6%' }
// 말풍선 구름 안쪽 텍스트 영역 (원화 말풍선 bbox: x 49~94%, y 14~72%)
const BUBBLE_TEXT = { left: '55%', top: '25%', width: '32%', height: '31%' }
// 말풍선 전체 축소 배율 — 말풍선 중심(71% 43%) 기준, 안의 텍스트·안내도 같이 줄어든다
const BUBBLE_SCALE = 0.92
// 원화 오른쪽 아래 오븐 창 (캔버스 x 74~100%, y 86~100% — 아래는 화면 밖)
const OVEN_WINDOW = { left: '73%', top: '84%', width: '27%', height: '20%' }

/* 스테이지 폭 기준 글자 크기 — 가로 화면 스테이지 = min(100vw, 177.78dvh) */
const stageFont = (pct) => `min(${pct}vw, ${(pct * 16) / 9}dvh)`

/**
 * text: 말풍선 대사 (가로 화면), hint: 말풍선 오른쪽 아래 안내
 * baking: 오븐 창이 따뜻하게 빛난다 (결과 대기 화면)
 */
export default function FoxKitchen({ text, hint, baking = false }) {
  return (
    <ArtStage className="art-reveal bg-ink">
      <ArtLayer src={openingBg} />

      {baking && (
        <div
          className="absolute oven-window-glow pointer-events-none"
          style={OVEN_WINDOW}
          aria-hidden="true"
        />
      )}

      {/* 여우씨 — 책상 윗선(DESK_TOP)에서 잘라 책상 뒤에 걸친 것처럼 */}
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: DESK_TOP }}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.15 }}
          className="absolute"
          style={{ left: FOX.left, width: FOX.width, bottom: FOX.bottom }}
        >
          <Character variant="half" size="free" className="w-full aspect-[1224/1129]" />
        </motion.div>
      </div>

      {/* 책상 위 잼병 — 여우 앞 전경 */}
      <ArtLayer src={openingObject} />

      <GoldFrame />

      {/* 말풍선 + 대사 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 90, damping: 13 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 art-bob">
          <div
            className="absolute inset-0"
            style={{ transform: `scale(${BUBBLE_SCALE})`, transformOrigin: '71% 43%' }}
          >
            <ArtLayer src={openingBubble} />

            {/* 대사 텍스트 (세로 화면에서는 하단 스트립으로 대체) */}
            <div
              className="absolute flex items-center justify-center portrait:hidden"
              style={BUBBLE_TEXT}
            >
              <p
                className="font-display font-bold text-ink leading-relaxed text-center"
                style={{ fontSize: stageFont(1.8) }}
              >
                {text}
              </p>
            </div>

            {hint && (
              <span
                className="absolute font-display text-ink/60 portrait:hidden"
                style={{ left: '83%', top: '57%', fontSize: stageFont(1.1) }}
              >
                {hint}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </ArtStage>
  )
}

/* 세로 화면: 말풍선이 크롭돼 읽을 수 없으므로 대사를 하단 양피지 스트립으로 */
export function KitchenPortraitStrip({ text, hint }) {
  return (
    <div className="hidden portrait:block absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[92vw] z-20">
      <div className="gold-rim rounded-xl px-4 py-3
                      shadow-[0_12px_24px_-12px_rgba(94,70,50,0.5)]">
        <p className="font-display text-ink text-sm leading-relaxed min-h-[3.5rem]">
          {text}
        </p>
        <p className="font-script text-right text-sm text-jam/70 mt-1 min-h-[1.25rem]">
          {hint}
        </p>
      </div>
    </div>
  )
}
