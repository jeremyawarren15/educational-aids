import { useMemo } from 'react'
import { generateAdditionProblems, type Problem } from '../lib/problems'
import BaseGame, { type Result } from './BaseGame'

export default function AdditionGame({
  targets,
  totalProblems,
  onDone,
  onHome,
  onSettings,
}: {
  targets: number[]
  totalProblems: number
  onDone: (results: Result[]) => void
  onHome?: () => void
  onSettings?: () => void
}) {
  const problems = useMemo<Problem[]>(
    () => generateAdditionProblems(targets, totalProblems),
    [targets, totalProblems],
  )

  function renderProblem(problem: Problem) {
    return (
      <>
        <span>{problem.a}</span>
        <span className="text-sky-600"> + </span>
        <span className="text-sky-400">_</span>
        <span className="text-sky-600"> = </span>
        <span>{problem.target}</span>
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

