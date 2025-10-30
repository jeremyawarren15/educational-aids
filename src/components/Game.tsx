import { useEffect, useMemo, useRef, useState } from 'react'
import { generateProblems, type Problem } from '../lib/problems'
import ProgressBar from './ProgressBar'

export type Result = 'pending' | 'correct' | 'wrong'

export default function Game({
  target,
  totalProblems,
  onDone,
}: {
  target: number
  totalProblems: number
  onDone: (results: Result[]) => void
}) {
  const problems = useMemo<Problem[]>(
    () => generateProblems(target, totalProblems),
    [target, totalProblems],
  )

  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Result[]>(
    () => Array.from({ length: totalProblems }, () => 'pending'),
  )
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [index])

  const current = problems[index]

  function submitCurrent() {
    const trimmed = input.trim()
    if (trimmed.length === 0) return
    const given = Number(trimmed)
    const isCorrect = Number.isFinite(given) && given === current.expected
    setResults((prev) => {
      const next = prev.slice()
      next[index] = isCorrect ? 'correct' : 'wrong'
      return next
    })
    setTimeout(() => {
      if (index + 1 < problems.length) {
        setIndex((i) => i + 1)
        setInput('')
      } else {
        onDone(
          results.map((r, i) => (i === index ? (isCorrect ? 'correct' : 'wrong') : r)),
        )
      }
    }, 400)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitCurrent()
    } else if (e.key === 'Escape') {
      setInput('')
    }
  }

  return (
    <div className="grid gap-10">
      <div className="flex items-center justify-between text-sky-700">
        <div className="text-base">Problem <span className="font-semibold">{index + 1}</span> of <span className="font-semibold">{totalProblems}</span></div>
        <div className="text-base">Target <span className="font-semibold">{target}</span></div>
      </div>

      <div className="text-center bg-sky-50 rounded-3xl border border-sky-100 p-8">
        <div className="text-lg text-sky-700">Type your answer and press Enter</div>
        <div className="mt-3 font-extrabold text-6xl md:text-7xl tracking-tight">
          <span>{current.a}</span>
          <span className="text-sky-600"> + </span>
          <span className="text-sky-400">_</span>
          <span className="text-sky-600"> = </span>
          <span>{target}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-64 text-center text-5xl rounded-3xl border border-sky-200 bg-white px-5 py-4 shadow focus:outline-none focus:ring-4 focus:ring-sky-200"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^0-9-]/g, ''))}
          onKeyDown={handleKeyDown}
          aria-label="Answer"
        />
      </div>

      <ProgressBar results={results} activeIndex={index} />
    </div>
  )
}


