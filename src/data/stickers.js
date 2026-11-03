/**
 * 포토부스 스티커 — 작가 원화 스티커 18장 (2026-11-04 대표 지정 "Downloads\스티커"로 교체).
 * 원본은 그대로 두고, 그린 부분만 남게 잘라 긴 변 900px로 줄인 사본이 src/assets/images/stickers/ 에 있다.
 * (흰 배경 중복본 IMG_2255는 투명본 IMG_3110 1과 같은 그림이라 뺐다. 원본 파일명 대응은 아래 주석.)
 * 빌드 때 vite.webp.js가 WebP로 바꾼다.
 *
 * w: 사진 영역 폭 대비 처음 붙일 때의 폭(소수) — 붙인 뒤 손잡이·두 손가락으로 자유롭게 키우고 줄인다.
 * tilt: 처음 붙일 때 무작위로 기울이는 범위(도)
 */
import foxBerry from '../assets/images/stickers/fox-berry.png'             // 제목_없는_아트워크
import foxCake from '../assets/images/stickers/fox-cake.png'               // IMG_3110 1
import thankYou from '../assets/images/stickers/thank-you.png'             // IMG_2510
import bubbleHeart from '../assets/images/stickers/bubble-heart.png'       // IMG_3111
import bubbleExclaim from '../assets/images/stickers/bubble-exclaim.png'   // IMG_3113
import bubbleQuestion from '../assets/images/stickers/bubble-question.png' // IMG_3115
import bubbleSweat from '../assets/images/stickers/bubble-sweat.png'       // IMG_3112
import bubblePop from '../assets/images/stickers/bubble-pop.png'           // IMG_3114
import strawberry from '../assets/images/stickers/strawberry.png'         // IMG_3110
import apple from '../assets/images/stickers/apple.png'                   // IMG_3107
import blueberry from '../assets/images/stickers/blueberry.png'           // IMG_0753
import fish from '../assets/images/stickers/fish.png'                     // IMG_2107
import creamBerry from '../assets/images/stickers/cream-berry.png'        // IMG_2970
import apples from '../assets/images/stickers/apples.png'                 // IMG_2916
import flower from '../assets/images/stickers/flower.png'                 // IMG_2904
import leaf from '../assets/images/stickers/leaf.png'                     // IMG_2903
import sparkle from '../assets/images/stickers/sparkle.png'               // IMG_2907
import snow from '../assets/images/stickers/snow.png'                     // IMG_2908

export const stickers = [
  { id: 'fox-berry', label: '여우씨 블루베리', src: foxBerry, w: 0.24, tilt: 5 },
  { id: 'fox-cake', label: '여우씨 케이크', src: foxCake, w: 0.24, tilt: 5 },
  { id: 'thank-you', label: '땡큐', src: thankYou, w: 0.16, tilt: 8 },
  { id: 'bubble-heart', label: '하트 말풍선', src: bubbleHeart, w: 0.13, tilt: 6 },
  { id: 'bubble-exclaim', label: '느낌표 말풍선', src: bubbleExclaim, w: 0.13, tilt: 6 },
  { id: 'bubble-question', label: '물음표 말풍선', src: bubbleQuestion, w: 0.13, tilt: 6 },
  { id: 'bubble-sweat', label: '땀방울 말풍선', src: bubbleSweat, w: 0.13, tilt: 6 },
  { id: 'bubble-pop', label: '빠직 말풍선', src: bubblePop, w: 0.13, tilt: 6 },
  { id: 'strawberry', label: '딸기', src: strawberry, w: 0.12, tilt: 15 },
  { id: 'apple', label: '사과', src: apple, w: 0.12, tilt: 15 },
  { id: 'blueberry', label: '블루베리', src: blueberry, w: 0.13, tilt: 12 },
  { id: 'fish', label: '물고기', src: fish, w: 0.14, tilt: 12 },
  { id: 'cream-berry', label: '크림 딸기', src: creamBerry, w: 0.1, tilt: 12 },
  { id: 'apples', label: '사과 두 개', src: apples, w: 0.11, tilt: 12 },
  { id: 'flower', label: '꽃', src: flower, w: 0.08, tilt: 25 },
  { id: 'leaf', label: '잎', src: leaf, w: 0.08, tilt: 25 },
  { id: 'sparkle', label: '반짝', src: sparkle, w: 0.08, tilt: 20 },
  { id: 'snow', label: '눈송이', src: snow, w: 0.12, tilt: 15 },
]
