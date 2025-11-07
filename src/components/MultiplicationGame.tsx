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
}: {
  targets: number[]
  maxRange: number
  totalProblems: number
  onDone: (results: Result[]) => void
  onHome?: () => void
  onSettings?: () => void
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
    />
  )
}

