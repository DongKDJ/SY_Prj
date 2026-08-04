import { createRoot } from 'react-dom/client'
/* 폰트 셀프호스팅 — 전시장 네트워크가 느리거나 막혀도 타이포가 유지되도록 CDN 대신 번들.
   dynamic-subset / 서브셋 분리본이라 unicode-range로 실제 쓰는 글자 범위만 내려받는다. */
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@fontsource/gowun-batang/korean-400.css'
import '@fontsource/gowun-batang/korean-700.css'
import '@fontsource/gowun-batang/latin-400.css'
import '@fontsource/gowun-batang/latin-700.css'
import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-700.css'
import './index.css'
import App from './App.jsx'

// ponytail: 앰비언트 모션 강도 비교용 임시 스위치(?ambient=strong).
// 강도를 확정하면 index.css의 :root --ambient 기본값에 반영하고 이 블록은 제거.
if (new URLSearchParams(window.location.search).get('ambient') === 'strong') {
  document.documentElement.classList.add('ambient-strong')
}

createRoot(document.getElementById('root')).render(<App />)
