import { useMemo } from 'react'
import { generateAdditionProblems, type Problem } from '../lib/problems'
import BaseGame, { type Result } from './BaseGame'

export default function AdditionGame({
  target,
  totalProblems,
  onDone,
}: {
  target: number
  totalProblems: number
  onDone: (results: Result[]) => void
}) {
  const problems = useMemo<Problem[]>(
    () => generateAdditionProblems(target, totalProblems),
    [target, totalProblems],
  )

  function renderProblem(problem: Problem, target: number) {
    return (
      <>
        <span>{problem.a}</span>
        <span className="text-sky-600"> + </span>
        <span className="text-sky-400">_</span>
        <span className="text-sky-600"> = </span>
        <span>{target}</span>
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
    />
  )
}

