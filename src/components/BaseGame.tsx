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
  onHome?: () => void
  onSettings?: () => void
}

export default function BaseGame({
  problems,
  target,
  totalProblems,
  renderProblem,
  onDone,
  onHome,
  onSettings,
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
        {(onHome || onSettings) && (
          <div className="flex items-center">
            {onSettings && (
              <button
                className="p-2 -mr-1 text-gray-300 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300 rounded-lg"
                onClick={onSettings}
                aria-label="Settings"
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
            {onHome && (
              <button
                className="p-2 text-gray-300 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300 rounded-lg"
                onClick={onHome}
                aria-label="Go to home"
                title="Home"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
            )}
          </div>
        )}
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

