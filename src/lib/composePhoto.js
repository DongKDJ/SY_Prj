/**
 * 사진 합성 — 카메라 프레임(object-fit: cover로 보이는 영역 그대로) + 디저트 레이어 + 폴라로이드 테·캡션.
 *
 * 화면에 보이는 그대로를 찍는다: 프레임 요소의 크기로 비디오를 cover 자르고,
 * 디저트는 화면에서 잰 자리(frame 기준 rect)에 레이어 이미지를 DOM 순서대로 겹친다.
 * 레이어는 모두 같은 2048 정사각 캔버스(inset 0, contain)라 한 rect에 그대로 그리면 합성이 맞는다.
 *
 * @param {object} p
 * @param {HTMLVideoElement} p.video
 * @param {boolean} p.mirrored        정면 카메라 — 보이는 대로(거울) 저장
 * @param {DOMRect} p.frameRect       비디오가 꽉 채운 프레임
 * @param {DOMRect} p.dessertRect     디저트 레이어 묶음(.dessert-wrap)의 화면 rect
 * @param {HTMLImageElement[]} p.layerImgs  그 안의 <img> — DOM 순서 = 렌더 순서
 * @param {string} p.title            캡션 큰 글씨(디저트 이름)
 * @param {string} p.subtitle         캡션 작은 글씨
 * @returns {Promise<Blob>} JPEG
 */
export async function composePhoto({ video, mirrored, frameRect, dessertRect, layerImgs, title, subtitle }) {
  const vw = video.videoWidth
  const vh = video.videoHeight
  if (!vw || !vh) throw new Error('video not ready')

  const W = frameRect.width
  const H = frameRect.height
  // object-fit: cover 와 같은 계산 — 프레임을 채우는 배율의 역수만큼 원본에서 잘라 쓴다
  const s = Math.max(W / vw, H / vh)
  const cropW = W / s
  const cropH = H / s
  const sx = (vw - cropW) / 2
  const sy = (vh - cropH) / 2

  // 긴 변 2048 상한 — 4K 웹캠이라도 파일이 과하게 커지지 않게
  const outScale = Math.min(1, 2048 / Math.max(cropW, cropH))
  const photoW = Math.round(cropW * outScale)
  const photoH = Math.round(cropH * outScale)
  const px = photoW / W // CSS px → 사진 px

  // 폴라로이드 여백: 옆·위 5%, 아래 20%(캡션 자리)
  const pad = Math.round(photoW * 0.05)
  const bottom = Math.round(photoW * 0.2)
  const canvas = document.createElement('canvas')
  canvas.width = photoW + pad * 2
  canvas.height = photoH + pad + bottom
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#FCF5E6'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 사진
  ctx.save()
  ctx.translate(pad, pad)
  if (mirrored) {
    ctx.translate(photoW, 0)
    ctx.scale(-1, 1)
  }
  ctx.drawImage(video, sx, sy, cropW, cropH, 0, 0, photoW, photoH)
  ctx.restore()

  // 디저트 — 화면에서 잰 자리 그대로(프레임 밖으로 끌려 나간 부분은 사진 영역에서 잘린다)
  ctx.save()
  ctx.beginPath()
  ctx.rect(pad, pad, photoW, photoH)
  ctx.clip()
  const dx = pad + (dessertRect.left - frameRect.left) * px
  const dy = pad + (dessertRect.top - frameRect.top) * px
  const dw = dessertRect.width * px
  const dh = dessertRect.height * px
  layerImgs.forEach((img) => {
    if (!img.complete || !img.naturalWidth) return
    // object-fit: contain
    const r = Math.min(dw / img.naturalWidth, dh / img.naturalHeight)
    const w = img.naturalWidth * r
    const h = img.naturalHeight * r
    ctx.drawImage(img, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h)
  })
  ctx.restore()

  // 캡션 — 화면과 같은 손글씨·명조. 번들 폰트가 아직 안 올라왔으면 기다린다.
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
  ctx.fillText(subtitle, canvas.width / 2, pad + photoH + bottom * 0.78)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.92)
  })
}

/** 폰·태블릿이면 true — 저장 버튼을 공유 시트(사진 앱 저장)로 보낼지 정할 때 쓴다 */
export function isTouchMobile() {
  if (navigator.userAgentData?.mobile) return true
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return true
  // iPadOS는 데스크톱 UA를 쓴다
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}
