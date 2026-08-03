import iconGif from '../assets/icon.gif'

export default function LoadingScreen({ text }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff' }}>
      <div className="flex flex-col items-center gap-3">
        <img
          src={iconGif}
          alt={text || ''}
          className="w-16 h-16 md:w-20 md:h-20"
          style={{ objectFit: 'contain' }}
        />
        {text && <p className="text-sm" style={{ color: '#888' }}>{text}</p>}
      </div>
    </div>
  )
}
