import { useMemo } from 'react'
import { generateMultiplicationProblems, type Problem } from '../lib/problems'
import BaseGame, { type Result } from './BaseGame'

export default function MultiplicationGame({
  targets,
  maxRange,
  totalProblems,
  onDone,
  onHome,
  onSettings,
  enableStopwatch,
}: {
  targets: number[]
  maxRange: number
  totalProblems: number
  onDone: (results: Result[], elapsedTime?: number) => void
  onHome?: () => void
  onSettings?: () => void
  enableStopwatch?: boolean
}) {
  const problems = useMemo<Problem[]>(
    () => generateMultiplicationProblems(targets, maxRange, totalProblems),
    [targets, maxRange, totalProblems],
  )

  function renderProblem(problem: Problem) {
    return (
      <>
        <span>{problem.target}</span>
        <span className="text-sky-600"> × </span>
        <span>{problem.a}</span>
        <span className="text-sky-600"> = </span>
        <span className="text-sky-400">_</span>
      </>
    )
  }

  return (
    <BaseGame
      problems={problems}
      totalProblems={totalProblems}
      renderProblem={renderProblem}
      onDone={onDone}
      onHome={onHome}
      onSettings={onSettings}
      enableStopwatch={enableStopwatch}
    />
  )
}

