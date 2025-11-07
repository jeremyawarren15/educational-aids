import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

export type MultiplicationConfigValues = {
  targets: number[]
  maxRange: number
  totalProblems: number
}

function parseTargets(input: string): number[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n >= 1)
    .map((n) => Math.round(n))
}

function formatTargets(targets: number[]): string {
  return targets.join(', ')
}

export default function MultiplicationConfigPanel({
  initial,
  onStart,
}: {
  initial?: Partial<MultiplicationConfigValues>
  onStart: (config: MultiplicationConfigValues) => void
}) {
  const [targetInput, setTargetInput] = useState<string>(
    initial?.targets ? formatTargets(initial.targets) : '4'
  )
  const [maxRange, setMaxRange] = useState<number>(
    initial?.maxRange ?? 12,
  )
  const [totalProblemsInput, setTotalProblemsInput] = useState<string>(
    initial?.totalProblems ? String(initial.totalProblems) : '10',
  )

  useEffect(() => {
    const targets = parseTargets(targetInput)
    if (targets.length === 0) {
      setTargetInput('4')
    }
    setMaxRange((r) => sanitizeRange(r))
  }, [])

  function sanitizeRange(value: number): number {
    if (!Number.isFinite(value)) return 12
    return Math.max(0, Math.round(value))
  }

  function sanitizeCount(value: string): number {
    const num = Number(value)
    if (!Number.isFinite(num) || num < 1) return 10
    return Math.round(num)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const targets = parseTargets(targetInput)
    if (targets.length === 0) {
      // Default to [4] if no valid targets
      onStart({ 
        targets: [4], 
        maxRange: sanitizeRange(maxRange),
        totalProblems: sanitizeCount(totalProblemsInput)
      })
      return
    }
    onStart({ 
      targets, 
      maxRange: sanitizeRange(maxRange),
      totalProblems: sanitizeCount(totalProblemsInput)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <div className="grid gap-2">
        <label className="text-sky-900 font-semibold text-lg" htmlFor="target">Target numbers (comma-separated, multiply by)</label>
        <input
          id="target"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 4, 6, 9"
          className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-3xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
        />
        <p className="text-sm text-sky-700">
          Enter one or more target numbers separated by commas. Problems will randomly use one of these targets.
          {parseTargets(targetInput).length > 0 && (
            <> Example: <span className="font-semibold">{parseTargets(targetInput)[0]} × a = _</span></>
          )}
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sky-900 font-semibold text-lg" htmlFor="range">Max range</label>
        <input
          id="range"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="12"
          className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-3xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
          value={maxRange}
          onChange={(e) => setMaxRange(Number(e.target.value))}
        />
        <p className="text-sm text-sky-700">
          Problems will be generated from <span className="font-semibold">0</span> to <span className="font-semibold">{maxRange || 'N'}</span> for each target number.
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sky-900 font-semibold text-lg" htmlFor="count">Number of problems</label>
        <input
          id="count"
          type="text"
          inputMode="numeric"
          placeholder="10"
          className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-3xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
          value={totalProblemsInput}
          onChange={(e) => setTotalProblemsInput(e.target.value.replace(/[^0-9]/g, ''))}
        />
      </div>

      <button
        type="submit"
        className="mx-auto mt-2 inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-10 py-5 text-3xl font-extrabold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        Start
      </button>
    </form>
  )
}

