import { useMemo } from 'react'
import { generateMultiplicationProblems, type Problem } from '../lib/problems'
import BaseGame, { type Result } from './BaseGame'

export default function MultiplicationGame({
  target,
  maxRange,
  totalProblems,
  onDone,
  onHome,
  onSettings,
}: {
  target: number
  maxRange: number
  totalProblems: number
  onDone: (results: Result[]) => void
  onHome?: () => void
  onSettings?: () => void
}) {
  const problems = useMemo<Problem[]>(
    () => generateMultiplicationProblems(target, maxRange, totalProblems),
    [target, maxRange, totalProblems],
  )

  function renderProblem(problem: Problem, target: number) {
    return (
      <>
        <span>{target}</span>
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
      target={target}
      totalProblems={totalProblems}
      renderProblem={renderProblem}
      onDone={onDone}
      onHome={onHome}
      onSettings={onSettings}
    />
  )
}

