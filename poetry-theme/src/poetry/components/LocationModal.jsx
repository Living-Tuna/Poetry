import { useState } from 'react'
import { supabase } from '../../supabase/client'
import LocationFields from './LocationFields'

export default function LocationModal({ onClose }) {
  const [country, setCountry] = useState(localStorage.getItem('poetry_country') || '')
  const [state, setState] = useState(localStorage.getItem('poetry_state') || '')
  const [zip, setZip] = useState(localStorage.getItem('poetry_zip') || '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSave() {
    if (!country.trim()) { setError('Select your country'); return }
    if (!zip.trim()) { setError('ZIP / Postal code is required for Blend'); return }
    if (!state.trim()) { setError('State is missing — check your PIN code or enter it manually'); return }
    setBusy(true)
    localStorage.setItem('poetry_country', country)
    localStorage.setItem('poetry_state', state)
    localStorage.setItem('poetry_zip', zip)
    try {
      await supabase.auth.updateUser({ data: { country, state, zip } })
    } catch {}
    setBusy(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[80vh] overflow-y-auto animate-fade-in"
        style={{
          backgroundColor: 'var(--tp-surface)',
          border: '1.5px solid var(--tp-border)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", Georgia, serif' }}>
            Your Location
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl transition-colors hover:opacity-70" style={{ color: 'var(--tp-text-secondary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm mb-5" style={{ color: 'var(--tp-text-secondary)' }}>
          Add your location so Blend can connect you with nearby readers. Your ZIP / Postal code is required and your state will be detected automatically.
        </p>

        <LocationFields
          country={country} setCountry={setCountry}
          state={state} setState={setState}
          zip={zip} setZip={setZip}
        />

        {error && <p className="text-xs mt-3" style={{ color: '#ef4444' }}>{error}</p>}

        <button onClick={handleSave} disabled={busy}
          className="w-full mt-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--tp-secondary)', borderRadius: 'var(--tp-btn-radius, 0.75rem)' }}>
          {busy ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
