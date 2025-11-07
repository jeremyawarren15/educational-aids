import { useState } from 'react'
import ConfigPanel, { type ConfigValues } from './components/ConfigPanel'
import Game, { type Result } from './components/Game'

type Mode = 'config' | 'play' | 'done'

function App() {
  const [mode, setMode] = useState<Mode>('config')
  const [config, setConfig] = useState<ConfigValues | null>(null)
  const [results, setResults] = useState<Result[] | null>(null)

  function handleStart(c: ConfigValues) {
    setConfig(c)
    setMode('play')
    setResults(null)
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
              <ConfigPanel initial={{ target: 10, totalProblems: 10 }} onStart={handleStart} />
            )}
            {mode === 'play' && config && (
              <Game
                target={config.target}
                totalProblems={config.totalProblems}
                onDone={(r) => {
                  setResults(r)
                  setMode('done')
                }}
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
                    onClick={() => setMode('play')}
                  >
                    Play again
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300"
                    onClick={() => setMode('config')}
                  >
                    Change settings
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

export default App
