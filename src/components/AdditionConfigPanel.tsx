import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

export type AdditionConfigValues = {
  target: number
  totalProblems: number
}

export default function AdditionConfigPanel({
  initial,
  onStart,
}: {
  initial?: Partial<AdditionConfigValues>
  onStart: (config: AdditionConfigValues) => void
}) {
  const [target, setTarget] = useState<number>(initial?.target ?? 10)
  const [totalProblems, setTotalProblems] = useState<number>(
    initial?.totalProblems ?? 10,
  )

  useEffect(() => {
    setTarget((t) => sanitizeTarget(t))
    setTotalProblems((n) => sanitizeCount(n))
  }, [])

  function sanitizeTarget(value: number): number {
    if (!Number.isFinite(value)) return 10
    return Math.max(1, Math.round(value))
  }

  function sanitizeCount(value: number): number {
    if (!Number.isFinite(value)) return 10
    return Math.min(50, Math.max(1, Math.round(value)))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onStart({ target: sanitizeTarget(target), totalProblems: sanitizeCount(totalProblems) })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <div className="grid gap-2">
        <label className="text-sky-900 font-semibold text-lg" htmlFor="target">Target number</label>
        <input
          id="target"
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="e.g. 10"
          className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-3xl focus:outline-none focus:ring-4 focus:ring-sky-200"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
        />
        <p className="text-sm text-sky-700">Problems look like <span className="font-semibold">a + _ = {target || 'N'}</span>.</p>
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
          className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-3xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
          value={totalProblems}
          onChange={(e) => setTotalProblems(Number(e.target.value))}
        />
      </div>

      <button
        type="submit"
        className="mx-auto mt-2 inline-flex items-center justify-center rounded-3xl bg-sky-600 px-10 py-5 text-3xl font-extrabold text-white shadow-lg transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300"
      >
        Start
      </button>
    </form>
  )
}

