import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdditionConfigPanel, { type AdditionConfigValues } from '../components/AdditionConfigPanel'
import AdditionGame from '../components/AdditionGame'
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

function getConfigFromURL(): Partial<AdditionConfigValues> {
  const params = new URLSearchParams(window.location.search)
  const targets = params.get('targets')
  const totalProblems = params.get('totalProblems')
  
  const parsedTargets = parseTargets(targets)
  
  return {
    targets: parsedTargets && parsedTargets.length > 0 ? parsedTargets : undefined,
    totalProblems: totalProblems ? Number(totalProblems) : undefined,
  }
}

function updateURL(config: AdditionConfigValues) {
  const params = new URLSearchParams()
  params.set('targets', formatTargetsForURL(config.targets))
  params.set('totalProblems', String(config.totalProblems))
  const newURL = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', newURL)
}

export default function AdditionPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('config')
  const [config, setConfig] = useState<AdditionConfigValues | null>(null)
  const [results, setResults] = useState<Result[] | null>(null)
  const [initialConfig, setInitialConfig] = useState<Partial<AdditionConfigValues>>(() => getConfigFromURL())

  useEffect(() => {
    // Read URL params on mount
    const urlConfig = getConfigFromURL()
    setInitialConfig(urlConfig)
    
    // If both params are present and valid, auto-start the game
    if (urlConfig.targets && urlConfig.targets.length > 0 && urlConfig.totalProblems) {
      const totalProblems = Math.min(50, Math.max(1, Math.round(urlConfig.totalProblems)))
      if (totalProblems > 0) {
        const validConfig = { targets: urlConfig.targets, totalProblems }
        setConfig(validConfig)
        setMode('play')
        setResults(null)
      }
    }

    // Handle browser back/forward navigation
    function handlePopState() {
      const urlConfig = getConfigFromURL()
      setInitialConfig(urlConfig)
      
      if (urlConfig.targets && urlConfig.targets.length > 0 && urlConfig.totalProblems) {
        const totalProblems = Math.min(50, Math.max(1, Math.round(urlConfig.totalProblems)))
        if (totalProblems > 0) {
          const validConfig = { targets: urlConfig.targets, totalProblems }
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

  function handleStart(c: AdditionConfigValues) {
    setConfig(c)
    setMode('play')
    setResults(null)
    updateURL(c)
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-50 to-sky-100 text-sky-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Math Fill‑in‑the‑Blank</h1>
          <p className="mt-2 text-sky-700 text-lg">Add to reach the target number</p>
        </header>

        <main>
          <div className="bg-white/90 backdrop-blur shadow-2xl rounded-3xl p-6 md:p-10 border border-sky-100">
            {mode === 'config' && (
              <>
                <button
                  className="mb-6 inline-flex items-center justify-center rounded-2xl bg-gray-100 px-6 py-3 text-lg font-semibold text-gray-700 shadow transition hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
                  onClick={() => navigate('/')}
                >
                  ← Back
                </button>
                <AdditionConfigPanel 
                  initial={initialConfig.targets && initialConfig.targets.length > 0 && initialConfig.totalProblems 
                    ? { targets: initialConfig.targets, totalProblems: initialConfig.totalProblems }
                    : { targets: [10], totalProblems: 10 }
                  } 
                  onStart={handleStart} 
                />
              </>
            )}
            {mode === 'play' && config && (
              <AdditionGame
                targets={config.targets}
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
                <div className="text-2xl md:text-3xl font-extrabold text-sky-800">Great job!</div>
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
                    className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300"
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

