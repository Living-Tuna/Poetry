import { useLanguage } from '../../language/LanguageProvider'

export default function DataIndicator({ cachedOnly, size = 14 }) {
  const { t } = useLanguage()
  if (cachedOnly) {
    return (
      <span title={t('common.cachedOffline')} className="inline-flex items-center" style={{ color: '#eab308' }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </span>
    )
  }
  return (
    <span title={t('common.syncedServer')} className="inline-flex items-center" style={{ color: '#22c55e' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
        <path d="M1 14 5.64 18.36A9 9 0 0 0 20.49 15" />
      </svg>
    </span>
  )
}
