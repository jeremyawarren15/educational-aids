import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MultiplicationConfigPanel, { type MultiplicationConfigValues } from '../components/MultiplicationConfigPanel'
import MultiplicationGame from '../components/MultiplicationGame'
import { type Result } from '../components/BaseGame'

type Mode = 'config' | 'play' | 'done'

function getConfigFromURL(): Partial<MultiplicationConfigValues> {
  const params = new URLSearchParams(window.location.search)
  const target = params.get('target')
  const maxRange = params.get('maxRange')
  const totalProblems = params.get('totalProblems')
  
  return {
    target: target ? Number(target) : undefined,
    maxRange: maxRange ? Number(maxRange) : undefined,
    totalProblems: totalProblems ? Number(totalProblems) : undefined,
  }
}

function updateURL(config: MultiplicationConfigValues) {
  const params = new URLSearchParams()
  params.set('target', String(config.target))
  params.set('maxRange', String(config.maxRange))
  params.set('totalProblems', String(config.totalProblems))
  const newURL = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', newURL)
}

export default function MultiplicationPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('config')
  const [config, setConfig] = useState<MultiplicationConfigValues | null>(null)
  const [results, setResults] = useState<Result[] | null>(null)
  const [initialConfig, setInitialConfig] = useState<Partial<MultiplicationConfigValues>>(() => getConfigFromURL())

  useEffect(() => {
    // Read URL params on mount
    const urlConfig = getConfigFromURL()
    setInitialConfig(urlConfig)
    
    // If all params are present and valid, auto-start the game
    if (urlConfig.target !== undefined && urlConfig.maxRange !== undefined && urlConfig.totalProblems !== undefined) {
      const target = Math.max(1, Math.round(urlConfig.target))
      const maxRange = Math.max(0, Math.round(urlConfig.maxRange))
      const totalProblems = Math.min(50, Math.max(1, Math.round(urlConfig.totalProblems)))
      if (target > 0 && maxRange >= 0 && totalProblems > 0) {
        const validConfig = { target, maxRange, totalProblems }
        setConfig(validConfig)
        setMode('play')
        setResults(null)
      }
    }

    // Handle browser back/forward navigation
    function handlePopState() {
      const urlConfig = getConfigFromURL()
      setInitialConfig(urlConfig)
      
      if (urlConfig.target !== undefined && urlConfig.maxRange !== undefined && urlConfig.totalProblems !== undefined) {
        const target = Math.max(1, Math.round(urlConfig.target))
        const maxRange = Math.max(0, Math.round(urlConfig.maxRange))
        const totalProblems = Math.min(50, Math.max(1, Math.round(urlConfig.totalProblems)))
        if (target > 0 && maxRange >= 0 && totalProblems > 0) {
          const validConfig = { target, maxRange, totalProblems }
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

  function handleStart(c: MultiplicationConfigValues) {
    setConfig(c)
    setMode('play')
    setResults(null)
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
                  initial={initialConfig.target !== undefined && initialConfig.maxRange !== undefined && initialConfig.totalProblems !== undefined
                    ? { target: initialConfig.target, maxRange: initialConfig.maxRange, totalProblems: initialConfig.totalProblems }
                    : { target: 4, maxRange: 12, totalProblems: 10 }
                  } 
                  onStart={handleStart} 
                />
              </>
            )}
            {mode === 'play' && config && (
              <MultiplicationGame
                target={config.target}
                maxRange={config.maxRange}
                totalProblems={config.totalProblems}
                onDone={(r) => {
                  setResults(r)
                  setMode('done')
                }}
                onHome={() => navigate('/')}
                onSettings={() => setMode('config')}
              />
            )}
            {mode === 'done' && results && (
              <div className="grid gap-6 text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-emerald-800">Great job!</div>
                <div className="flex items-center justify-center">
                  <div className="rounded-2xl bg-green-50 border border-green-200 text-green-700 px-6 py-4 text-xl font-bold">
                    Correct: {results.filter((r) => r === 'correct').length}
                  </div>
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

