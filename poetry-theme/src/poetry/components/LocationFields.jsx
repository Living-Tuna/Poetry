import { useEffect, useRef, useState } from 'react'
import { COUNTRIES } from '../../constants/languages'
import { apiFetchStateFromZip, apiAutoDetectLocation } from '../../api/location'

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

export default function LocationFields({ country, setCountry, state, setState, zip, setZip, inputStyle, onInputFocus, onInputBlur, autoDetect = true }) {
  const style = inputStyle || defaultStyle
  const [stateLoading, setStateLoading] = useState(false)
  const [autoState, setAutoState] = useState(false)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [autoBusy, setAutoBusy] = useState(autoDetect)
  const [autoFailed, setAutoFailed] = useState(false)
  const [autoOk, setAutoOk] = useState(false)
  const [manual, setManual] = useState(!autoDetect)
  const timer = useRef(null)

  function persistCoords(loc) {
    if (loc.lat) localStorage.setItem('poetry_lat', String(loc.lat))
    if (loc.lng) localStorage.setItem('poetry_lng', String(loc.lng))
  }

  function runDetect() {
    setAutoBusy(true)
    setAutoFailed(false)
    setManual(false)
    return apiAutoDetectLocation()
      .then((loc) => {
        if (loc.country && !country) setCountry(loc.country)
        if (loc.state && !state) {
          setState(loc.state)
          setAutoState(true)
        }
        if (loc.zip && !zip) setZip(loc.zip)
        persistCoords(loc)
        setAutoOk(!!loc.country)
        setAutoFailed(!loc.country)
        if (!loc.country) setManual(true)
        return loc
      })
      .catch(() => {
        setAutoFailed(true)
        setManual(true)
        return null
      })
      .finally(() => {
        setAutoBusy(false)
      })
  }

  useEffect(() => {
    if (!autoDetect) return
    runDetect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showSelector = !autoBusy && manual

  useEffect(() => {
    const digits = zip.replace(/\D/g, '')
    const code = codeFor(country)
    if (!code || digits.length < 4) {
      setStateLoading(false)
      return
    }
    if (state) {
      setStateLoading(false)
      setFetchFailed(false)
      return
    }
    setStateLoading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const st = await apiFetchStateFromZip(code, digits)
        setState(st)
        setAutoState(true)
        setFetchFailed(false)
      } catch {
        setAutoState(false)
        setFetchFailed(true)
      } finally {
        setStateLoading(false)
      }
    }, 500)
    return () => clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip, country, state])

  function codeFor(name) {
    return Object.entries(COUNTRIES).find(([, v]) => v.name === name)?.[0] || ''
  }

  function handleZipChange(value) {
    const digits = value.replace(/\D/g, '')
    setZip(digits)
    setFetchFailed(false)
    if (digits.length >= 4) setState('')
  }

  function handleCountryChange(value) {
    setCountry(value)
    setFetchFailed(false)
  }

  const zipStateInput = (
    <>
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

      {!stateLoading && !fetchFailed && state && manual && (
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
    </>
  )

  return (
    <div className="space-y-2">
      {autoBusy && (
        <p className="text-[11px] opacity-70 flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-transparent animate-spin inline-block"
            style={{ borderTopColor: 'currentColor' }} />
          Detecting your location...
        </p>
      )}

      {!autoBusy && autoOk && !manual && (
        <>
          <div className="rounded-xl px-3 py-2.5"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 10%, transparent)', border: '1px solid var(--tp-border)' }}>
            <p className="text-[11px] flex items-center gap-1 mb-1" style={{ color: 'var(--tp-secondary)' }}>
              <CheckIcon size={12} />
              Location detected automatically
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--tp-text)' }}>
                {[country, state, zip].filter(Boolean).join(', ') || 'Auto-detected'}
              </span>
              <button type="button" onClick={() => setManual(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--tp-secondary)', fontWeight: 600 }}>
                Change
              </button>
            </div>
          </div>
          {zipStateInput}
        </>
      )}

      {!autoDetect && (
        <button type="button" onClick={runDetect} disabled={autoBusy}
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          style={{ color: 'var(--tp-secondary)', backgroundColor: 'color-mix(in srgb, var(--tp-secondary) 12%, transparent)' }}>
          {autoBusy ? 'Detecting…' : 'Detect automatically'}
        </button>
      )}

      {showSelector && (
        <>
          {autoFailed && (
            <p className="text-[11px] opacity-70">Couldn't access your location — enter your country and state manually.</p>
          )}

          <select value={country} onChange={(e) => handleCountryChange(e.target.value)}
            style={{ ...style, appearance: 'auto' }}>
            <option value="">Select country</option>
            {countryNames.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {zipStateInput}
        </>
      )}
    </div>
  )
}
