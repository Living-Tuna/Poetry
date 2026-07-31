import { useEffect, useRef, useState } from 'react'
import { COUNTRIES } from '../../constants/languages'
import { apiFetchStateFromZip } from '../../api/location'

const countryNames = Object.values(COUNTRIES)
  .map((c) => c.name)
  .sort((a, b) => a.localeCompare(b))

const defaultStyle = {
  width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.75rem',
  fontSize: '0.875rem', outline: 'none',
  backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)',
  border: '1.5px solid var(--tp-border)',
}

function CheckIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function LocationFields({ country, setCountry, state, setState, zip, setZip, inputStyle, onInputFocus, onInputBlur }) {
  const style = inputStyle || defaultStyle
  const [stateLoading, setStateLoading] = useState(false)
  const [autoState, setAutoState] = useState(false)
  const [fetchFailed, setFetchFailed] = useState(false)
  const timer = useRef(null)
  const ranInitial = useRef(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (ranInitial.current) return
    ranInitial.current = true
    const digits = zip.replace(/\D/g, '')
    const code = codeFor(country)
    if (code && digits.length >= 4) {
      setStateLoading(true)
      timer.current = setTimeout(async () => {
        try {
          const st = await apiFetchStateFromZip(code, digits)
          setState(st)
          setAutoState(true)
        } catch {
          setAutoState(false)
          setFetchFailed(true)
        } finally {
          setStateLoading(false)
        }
      }, 500)
    }
  }, [zip, country, setState])

  function codeFor(name) {
    return Object.entries(COUNTRIES).find(([, v]) => v.name === name)?.[0] || ''
  }

  function runDetect(code, digits) {
    clearTimeout(timer.current)
    if (!code || digits.length < 4) {
      setStateLoading(false)
      setAutoState(false)
      setState('')
      return
    }
    setStateLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const st = await apiFetchStateFromZip(code, digits)
        setState(st)
        setAutoState(true)
      } catch {
        setAutoState(false)
        setFetchFailed(true)
      } finally {
        setStateLoading(false)
      }
    }, 500)
  }

  function handleZipChange(value) {
    const digits = value.replace(/\D/g, '')
    setZip(digits)
    setFetchFailed(false)
    runDetect(codeFor(country), digits)
  }

  function handleCountryChange(value) {
    setCountry(value)
    setFetchFailed(false)
    runDetect(codeFor(value), zip.replace(/\D/g, ''))
  }

  return (
    <div className="space-y-2">
      <select value={country} onChange={(e) => handleCountryChange(e.target.value)}
        style={{ ...style, appearance: 'auto' }}>
        <option value="">Select country</option>
        {countryNames.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <div>
        <input value={zip} onChange={(e) => handleZipChange(e.target.value)}
          placeholder="ZIP / PIN code" style={style}
          onFocus={onInputFocus} onBlur={onInputBlur} />
        {stateLoading && (
          <p className="text-[11px] mt-1 opacity-70 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-transparent animate-spin inline-block"
              style={{ borderTopColor: 'currentColor' }} />
            Detecting state from PIN code...
          </p>
        )}
      </div>

      {!stateLoading && fetchFailed && (
        <div>
          <p className="text-[11px] mb-1 opacity-70">Auto-detect failed for this code — enter your state manually.</p>
          <input value={state} onChange={(e) => setState(e.target.value)}
            placeholder="State / Region" style={style}
            onFocus={onInputFocus} onBlur={onInputBlur} />
        </div>
      )}

      {!stateLoading && !fetchFailed && state && (
        <div className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5"
          style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 10%, transparent)', border: '1px solid var(--tp-border)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--tp-text-secondary)' }}>State / Region</span>
          <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--tp-secondary)' }}>
            <CheckIcon />
            {state}
            {autoState && <span className="text-[10px] font-normal opacity-70">· auto-detected</span>}
          </span>
        </div>
      )}
    </div>
  )
}
