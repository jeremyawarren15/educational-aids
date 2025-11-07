import { useEffect, useRef, useState } from 'react'
import { type Problem } from '../lib/problems'
import ProgressBar from './ProgressBar'

export type Result = 'pending' | 'correct' | 'wrong'

export type BaseGameProps = {
  problems: Problem[]
  target: number
  totalProblems: number
  renderProblem: (problem: Problem, target: number) => React.ReactNode
  onDone: (results: Result[]) => void
}

export default function BaseGame({
  problems,
  target,
  totalProblems,
  renderProblem,
  onDone,
}: BaseGameProps) {
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Result[]>(
    () => Array.from({ length: totalProblems }, () => 'pending'),
  )
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [index])

  const current = problems[index]

  function submitCurrent() {
    const trimmed = input.trim()
    if (trimmed.length === 0) return
    const given = Number(trimmed)
    const isCorrect = Number.isFinite(given) && given === current.expected
    if (!isCorrect) {
      setResults((prev) => {
        const next = prev.slice()
        next[index] = 'wrong'
        return next
      })
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 350)
      setInput('')
      inputRef.current?.focus()
      return
    }

    // Correct answer: record final outcome for this problem
    // Always mark as correct if they eventually get it right
    const nextResults = results.slice()
    nextResults[index] = 'correct'
    setResults(nextResults)

    if (index + 1 < problems.length) {
      setIndex(index + 1)
      setInput('')
    } else {
      onDone(nextResults)
    }
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
          {renderProblem(current, target)}
        </div>
      </div>

      <div className="flex justify-center">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={`w-64 text-center text-5xl rounded-3xl border bg-white px-5 py-4 shadow focus:outline-none ${
            isShaking
              ? 'border-red-400 ring-4 ring-red-200 animate-ea-shake'
              : 'border-sky-200 focus:ring-4 focus:ring-sky-200'
          }`}
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

