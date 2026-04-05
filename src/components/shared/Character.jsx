import foxHalf from '../../assets/images/character/fox-half.png'

export default function Character({ variant = 'half', size = 'normal', className = '' }) {
  const isHalf = variant === 'half'

  if (isHalf && size === 'large') {
    // 대화 화면용: 모바일은 고정, PC는 뷰포트 높이의 65%
    return (
      <div className={`relative flex-shrink-0 ${className}`}>
        <img
          src={foxHalf}
          alt="여우씨"
          className="w-60 h-72 md:w-auto md:h-[65vh] object-contain"
        />
      </div>
    )
  }

  const sizeClass = 'w-44 h-56 md:w-52 md:h-64'

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {isHalf ? (
        <img
          src={foxHalf}
          alt="여우씨"
          className={`${sizeClass} object-contain`}
        />
      ) : (
        <div className={`${sizeClass} rounded-2xl bg-cabin-light/30 border-2 border-cabin/20
                        flex items-center justify-center flex-col gap-1`}>
          <span className="text-5xl">🦊</span>
          <span className="text-xs text-brown-light">여우씨</span>
        </div>
      )}
    </div>
  )
}
