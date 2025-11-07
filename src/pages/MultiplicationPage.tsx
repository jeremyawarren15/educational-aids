import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MultiplicationConfigPanel, { type MultiplicationConfigValues } from '../components/MultiplicationConfigPanel'
import MultiplicationGame from '../components/MultiplicationGame'
import { type Result } from '../components/BaseGame'

type Mode = 'config' | 'play' | 'done'

function parseTargets(input: string | null): number[] | undefined {
  if (!input) return undefined
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n >= 1)
    .map((n) => Math.round(n))
}

function formatTargetsForURL(targets: number[]): string {
  return targets.join(',')
}

function getConfigFromURL(): Partial<MultiplicationConfigValues> {
  const params = new URLSearchParams(window.location.search)
  const targets = params.get('targets')
  const maxRange = params.get('maxRange')
  const totalProblems = params.get('totalProblems')
  const enableStopwatch = params.get('enableStopwatch')
  
  const parsedTargets = parseTargets(targets)
  
  return {
    targets: parsedTargets && parsedTargets.length > 0 ? parsedTargets : undefined,
    maxRange: maxRange ? Number(maxRange) : undefined,
    totalProblems: totalProblems ? Number(totalProblems) : undefined,
    enableStopwatch: enableStopwatch === 'true' ? true : enableStopwatch === 'false' ? false : undefined,
  }
}

function updateURL(config: MultiplicationConfigValues) {
  const params = new URLSearchParams()
  params.set('targets', formatTargetsForURL(config.targets))
  params.set('maxRange', String(config.maxRange))
  params.set('totalProblems', String(config.totalProblems))
  if (config.enableStopwatch) {
    params.set('enableStopwatch', 'true')
  }
  const newURL = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', newURL)
}

export default function MultiplicationPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('config')
  const [config, setConfig] = useState<MultiplicationConfigValues | null>(null)
  const [results, setResults] = useState<Result[] | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number | undefined>(undefined)
  const [initialConfig, setInitialConfig] = useState<Partial<MultiplicationConfigValues>>(() => getConfigFromURL())

  useEffect(() => {
    // Read URL params on mount
    const urlConfig = getConfigFromURL()
    setInitialConfig(urlConfig)
    
    // If all params are present and valid, auto-start the game
    if (urlConfig.targets && urlConfig.targets.length > 0 && urlConfig.maxRange !== undefined && urlConfig.totalProblems !== undefined) {
      const maxRange = Math.max(0, Math.round(urlConfig.maxRange))
      const totalProblems = Math.max(1, Math.round(urlConfig.totalProblems))
      if (maxRange >= 0 && totalProblems > 0) {
        const validConfig = { targets: urlConfig.targets, maxRange, totalProblems, enableStopwatch: urlConfig.enableStopwatch }
        setConfig(validConfig)
        setMode('play')
        setResults(null)
      }
    }

    // Handle browser back/forward navigation
    function handlePopState() {
      const urlConfig = getConfigFromURL()
      setInitialConfig(urlConfig)
      
      if (urlConfig.targets && urlConfig.targets.length > 0 && urlConfig.maxRange !== undefined && urlConfig.totalProblems !== undefined) {
        const maxRange = Math.max(0, Math.round(urlConfig.maxRange))
        const totalProblems = Math.max(1, Math.round(urlConfig.totalProblems))
        if (maxRange >= 0 && totalProblems > 0) {
          const validConfig = { targets: urlConfig.targets, maxRange, totalProblems, enableStopwatch: urlConfig.enableStopwatch }
          setConfig(validConfig)
          setMode('play')
          setResults(null)
        } else {
          setMode('config')
        }
      } else {
        setMode('config')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${seconds}s`
  }

  function handleStart(c: MultiplicationConfigValues) {
    setConfig(c)
    setMode('play')
    setResults(null)
    setElapsedTime(undefined)
    updateURL(c)
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-50 to-emerald-100 text-emerald-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Math Fill‑in‑the‑Blank</h1>
          <p className="mt-2 text-emerald-700 text-lg">Multiply to find the answer</p>
        </header>

        <main>
          <div className="bg-white/90 backdrop-blur shadow-2xl rounded-3xl p-6 md:p-10 border border-emerald-100">
            {mode === 'config' && (
              <>
                <button
                  className="mb-6 inline-flex items-center justify-center rounded-2xl bg-gray-100 px-6 py-3 text-lg font-semibold text-gray-700 shadow transition hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
                  onClick={() => navigate('/')}
                >
                  ← Back
                </button>
                <MultiplicationConfigPanel 
                  initial={initialConfig.targets && initialConfig.targets.length > 0 && initialConfig.maxRange !== undefined && initialConfig.totalProblems !== undefined
                    ? { targets: initialConfig.targets, maxRange: initialConfig.maxRange, totalProblems: initialConfig.totalProblems, enableStopwatch: initialConfig.enableStopwatch }
                    : { targets: [4], maxRange: 12, totalProblems: 10, enableStopwatch: initialConfig.enableStopwatch }
                  } 
                  onStart={handleStart} 
                />
              </>
            )}
            {mode === 'play' && config && (
              <MultiplicationGame
                targets={config.targets}
                maxRange={config.maxRange}
                totalProblems={config.totalProblems}
                enableStopwatch={config.enableStopwatch}
                onDone={(r, time) => {
                  setResults(r)
                  setElapsedTime(time)
                  setMode('done')
                }}
                onHome={() => navigate('/')}
                onSettings={() => setMode('config')}
              />
            )}
            {mode === 'done' && results && (
              <div className="grid gap-6 text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-emerald-800">Great job!</div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="rounded-2xl bg-green-50 border border-green-200 text-green-700 px-6 py-4 text-xl font-bold">
                    Correct: {results.filter((r) => r === 'correct').length}
                  </div>
                  {elapsedTime !== undefined && (
                    <div className="rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 text-xl font-bold">
                      Time: {formatTime(elapsedTime)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                    onClick={() => {
                      if (config) {
                        updateURL(config)
                      }
                      setMode('play')
                    }}
                  >
                    Play again
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                    onClick={() => setMode('config')}
                  >
                    Change settings
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-3xl bg-gray-600 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300"
                    onClick={() => navigate('/')}
                  >
                    Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

