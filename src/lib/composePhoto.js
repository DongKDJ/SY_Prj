/**
 * 사진 합성 — 화면에 보이는 그대로: 카메라(object-fit: cover) + 금장 테두리 + 디저트 레이어 + 스티커,
 * 그 위에 폴라로이드 테와 캡션.
 *
 * 좌표는 전부 화면에서 잰 rect(getBoundingClientRect)로 받는다 — DOM이 곧 정본.
 *
 * @param {object} p
 * @param {HTMLVideoElement} p.video
 * @param {boolean} p.mirrored        정면 카메라 — 보이는 대로(거울) 저장
 * @param {DOMRect} p.frameRect       사진에 담기는 영역(화면에 보이는 사진 영역) — 바깥은 잘린다
 * @param {DOMRect} p.videoRect       <video>가 덮는 영역(원화 스테이지 박스)
 * @param {Array<{img: HTMLImageElement, rect: DOMRect, rot?: number}>} p.layers
 *        그릴 순서대로. rect = 회전 전 상자(중심 기준으로 rot만큼 돌려 그린다). 이미지는 contain으로 맞춘다.
 * @param {string} p.title            캡션 큰 글씨(디저트 이름)
 * @param {string} p.subtitle         캡션 작은 글씨
 * @returns {Promise<Blob>} JPEG
 */
export async function composePhoto({ video, mirrored, frameRect, videoRect, layers, title, subtitle }) {
  const vw = video.videoWidth
  const vh = video.videoHeight
  if (!vw || !vh) throw new Error('video not ready')

  const W = frameRect.width
  const H = frameRect.height
  // 비디오가 덮는 상자 기준 cover 배율 → 원본 1px이 화면 몇 px인가. 사진은 원본 해상도로(긴 변 2048 상한).
  const cover = Math.max(videoRect.width / vw, videoRect.height / vh)
  let px = 1 / cover * 1 // 화면 1px당 사진 px
  const longest = Math.max(W, H) * px
  if (longest > 2048) px *= 2048 / longest
  const photoW = Math.round(W * px)
  const photoH = Math.round(H * px)

  // 폴라로이드 여백: 옆·위 4%, 아래 16%(캡션 자리) — 가로 사진 기준 폭으로
  const pad = Math.round(photoW * 0.04)
  const bottom = Math.round(photoW * 0.16)
  const canvas = document.createElement('canvas')
  canvas.width = photoW + pad * 2
  canvas.height = photoH + pad + bottom
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#FCF5E6'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 화면 좌표 → 사진 좌표
  const X = (x) => pad + (x - frameRect.left) * px
  const Y = (y) => pad + (y - frameRect.top) * px

  ctx.save()
  ctx.beginPath()
  ctx.rect(pad, pad, photoW, photoH)
  ctx.clip()

  // 카메라 — <video>가 덮는 상자에 cover로 그린다
  const drawnW = vw * cover * px
  const drawnH = vh * cover * px
  const vx = X(videoRect.left + (videoRect.width - vw * cover) / 2)
  const vy = Y(videoRect.top + (videoRect.height - vh * cover) / 2)
  ctx.save()
  if (mirrored) {
    ctx.translate(vx + drawnW, vy)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, drawnW, drawnH)
  } else {
    ctx.drawImage(video, vx, vy, drawnW, drawnH)
  }
  ctx.restore()

  // 테두리·디저트·스티커 — 각자 상자 안에 contain, 스티커는 중심 기준 회전
  layers.forEach(({ img, rect, rot = 0 }) => {
    if (!img.complete || !img.naturalWidth) return
    const bw = rect.width * px
    const bh = rect.height * px
    const r = Math.min(bw / img.naturalWidth, bh / img.naturalHeight)
    const w = img.naturalWidth * r
    const h = img.naturalHeight * r
    const cx = X(rect.left + rect.width / 2)
    const cy = Y(rect.top + rect.height / 2)
    ctx.save()
    ctx.translate(cx, cy)
    if (rot) ctx.rotate((rot * Math.PI) / 180)
    ctx.drawImage(img, -w / 2, -h / 2, w, h)
    ctx.restore()
  })
  ctx.restore()

  // 캡션 — 화면과 같은 명조. 번들 폰트가 아직 안 올라왔으면 기다린다.
  const titlePx = Math.round(bottom * 0.4)
  const subPx = Math.round(bottom * 0.17)
  const titleFont = `700 ${titlePx}px "Gowun Batang", serif` // 디저트 이름은 한글 — 손글씨 폰트엔 한글이 없다
  const subFont = `400 ${subPx}px "Gowun Batang", serif`
  try {
    await Promise.all([document.fonts.load(titleFont, title), document.fonts.load(subFont, subtitle)])
  } catch { /* 폰트가 없으면 대체 글꼴로 그린다 */ }
  ctx.fillStyle = '#5E4632'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = titleFont
  ctx.fillText(title, canvas.width / 2, pad + photoH + bottom * 0.5)
  ctx.font = subFont
  ctx.fillStyle = 'rgba(94, 70, 50, 0.65)'
  ctx.fillText(subtitle, canvas.width / 2, pad + photoH + bottom * 0.8)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.92)
  })
}

/** 아이폰·아이패드면 true — 저장을 공유 시트("이미지 저장" → 사진 앱)로 보낼지 정할 때 쓴다.
 *  안드로이드는 공유 시트에 갤러리 저장이 없어 다운로드로 보낸다. */
export function isAppleTouch() {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return true
  // iPadOS는 데스크톱(맥) UA를 쓴다 — 터치 포인트로 가른다
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}
