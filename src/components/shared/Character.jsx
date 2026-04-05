import foxHalf from '../../assets/images/character/fox-half.png'

export default function Character({ variant = 'half', className = '' }) {
  const isHalf = variant === 'half'
  const size = isHalf ? 'w-28 h-36' : 'w-40 h-56'

  return (
    <div className={`${size} relative flex-shrink-0 ${className}`}>
      {isHalf ? (
        <img
          src={foxHalf}
          alt="여우씨"
          className="w-full h-full object-contain"
        />
      ) : (
        /* fox-full.png 추가 전 placeholder */
        <div className={`${size} rounded-2xl bg-cabin-light/30 border-2 border-cabin/20
                          flex items-center justify-center flex-col gap-1`}>
          <span className="text-4xl">🦊</span>
          <span className="text-xs text-brown-light">여우씨</span>
        </div>
      )}
    </div>
  )
}
