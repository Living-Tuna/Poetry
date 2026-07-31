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
        {!stateLoading && autoState && (
          <p className="text-[11px] mt-1 opacity-80">State auto-detected from your PIN code.</p>
        )}
      </div>

      <input value={state} onChange={(e) => setState(e.target.value)}
        placeholder="State / Region" style={style}
        onFocus={onInputFocus} onBlur={onInputBlur} />

      {fetchFailed && (
        <p className="text-[11px] opacity-70">Auto-detect failed for this code — enter your state manually.</p>
      )}
    </div>
  )
}
