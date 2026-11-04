import { Component } from 'react'
import { PaperGrain, Divider } from './Decorations'

const AUTO_MS = 8000

/**
 * 오류 안전망 (2026-11-05 대표 — 전시용). 화면 어딘가가 깨지면 빈 화면 대신 금테 카드를 띄우고
 * 8초 뒤(또는 버튼으로) 처음으로 돌아간다. 평소에는 아무 일도 하지 않는다 — 기존 기능 영향 없음.
 * onReset: 게임 상태를 처음으로 되돌리는 함수(App의 restart). 되돌린 뒤 key를 바꿔 아래를 새로 마운트한다.
 */
export default class ErrorBoundary extends Component {
  state = { error: null, gen: 0, left: AUTO_MS / 1000 }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[safety-net]', error, info?.componentStack)
    this.timer = setInterval(() => {
      this.setState((s) => {
        if (s.left <= 1) { this.reset(); return { left: 0 } }
        return { left: s.left - 1 }
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  reset = () => {
    clearInterval(this.timer)
    try { this.props.onReset?.() } catch { /* 되돌리기 자체가 실패해도 아래는 새로 마운트된다 */ }
    this.setState((s) => ({ error: null, gen: s.gen + 1, left: AUTO_MS / 1000 }))
  }

  render() {
    if (!this.state.error) {
      return <div key={this.state.gen} className="contents">{this.props.children}</div>
    }
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-cream px-6">
        <div className="relative gold-rim rounded-2xl px-10 py-8 text-center max-w-sm
                        shadow-[0_28px_50px_-22px_rgba(94,70,50,0.75)]">
          <PaperGrain />
          <p className="relative font-display text-lg font-bold text-ink">잠시 문제가 생겼어요</p>
          <p className="relative font-display text-sm text-ink/70 mt-1">
            {this.state.left}초 뒤 처음으로 돌아갑니다
          </p>
          <div className="relative flex justify-center my-4">
            <Divider className="w-28 h-3 text-honey/80" />
          </div>
          <button
            type="button"
            onClick={this.reset}
            className="relative btn-art btn-art-butter rounded-full px-8 py-3 font-display font-bold text-base cursor-pointer"
          >
            처음으로
          </button>
        </div>
      </div>
    )
  }
}
