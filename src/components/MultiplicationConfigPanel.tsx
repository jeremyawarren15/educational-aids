import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

export type MultiplicationConfigValues = {
  target: number
  maxRange: number
  totalProblems: number
}

export default function MultiplicationConfigPanel({
  initial,
  onStart,
}: {
  initial?: Partial<MultiplicationConfigValues>
  onStart: (config: MultiplicationConfigValues) => void
}) {
  const [target, setTarget] = useState<number>(initial?.target ?? 4)
  const [maxRange, setMaxRange] = useState<number>(
    initial?.maxRange ?? 12,
  )
  const [totalProblems, setTotalProblems] = useState<number>(
    initial?.totalProblems ?? 10,
  )

  useEffect(() => {
    setTarget((t) => sanitizeTarget(t))
    setMaxRange((r) => sanitizeRange(r))
    setTotalProblems((n) => sanitizeCount(n))
  }, [])

  function sanitizeTarget(value: number): number {
    if (!Number.isFinite(value)) return 4
    return Math.max(1, Math.round(value))
  }

  function sanitizeRange(value: number): number {
    if (!Number.isFinite(value)) return 12
    return Math.max(0, Math.round(value))
  }

  function sanitizeCount(value: number): number {
    if (!Number.isFinite(value)) return 10
    return Math.min(50, Math.max(1, Math.round(value)))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onStart({ 
      target: sanitizeTarget(target), 
      maxRange: sanitizeRange(maxRange),
      totalProblems: sanitizeCount(totalProblems)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <div className="grid gap-2">
        <label className="text-sky-900 font-semibold text-lg" htmlFor="target">Target number (multiply by)</label>
        <input
          id="target"
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="e.g. 4"
          className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-3xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
        />
        <p className="text-sm text-sky-700">Problems look like <span className="font-semibold">{target || 'N'} × a = _</span>.</p>
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
        <p className="text-sm text-sky-700">Problems will be generated from <span className="font-semibold">{target || 'N'} × 0</span> to <span className="font-semibold">{target || 'N'} × {maxRange || 'N'}</span>.</p>
      </div>

      <div className="grid gap-2">
        <label className="text-sky-900 font-semibold text-lg" htmlFor="count">Number of problems</label>
        <input
          id="count"
          type="number"
          inputMode="numeric"
          min={1}
          max={50}
          placeholder="10"
          className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-3xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
          value={totalProblems}
          onChange={(e) => setTotalProblems(Number(e.target.value))}
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

