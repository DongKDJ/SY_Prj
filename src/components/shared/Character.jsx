import foxHalf from '../../assets/images/character/fox-half.png'

export default function Character({ variant = 'half', className = '' }) {
  const isHalf = variant === 'half'

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {isHalf ? (
        <img
          src={foxHalf}
          alt="여우씨"
          className="w-44 h-56 md:w-52 md:h-64 object-contain"
        />
      ) : (
        <div className="w-52 h-72 rounded-2xl bg-cabin-light/30 border-2 border-cabin/20
                        flex items-center justify-center flex-col gap-1">
          <span className="text-5xl">🦊</span>
          <span className="text-xs text-brown-light">여우씨</span>
        </div>
      )}
    </div>
  )
}
