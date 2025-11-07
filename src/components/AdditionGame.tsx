import { useMemo } from 'react'
import { generateAdditionProblems, type Problem } from '../lib/problems'
import BaseGame, { type Result } from './BaseGame'

export default function AdditionGame({
  targets,
  totalProblems,
  onDone,
  onHome,
  onSettings,
  enableStopwatch,
}: {
  targets: number[]
  totalProblems: number
  onDone: (results: Result[], elapsedTime?: number) => void
  onHome?: () => void
  onSettings?: () => void
  enableStopwatch?: boolean
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
      enableStopwatch={enableStopwatch}
    />
  )
}

