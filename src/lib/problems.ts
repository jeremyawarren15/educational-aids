export type Problem = {
  a: number
  expected: number
}

export function generateAdditionProblems(target: number, count: number): Problem[] {
  const arr: Problem[] = Array.from({ length: count }, () => {
    const a = Math.floor(Math.random() * (target + 1))
    return { a, expected: target - a }
  })
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

export function generateMultiplicationProblems(target: number, maxRange: number, count: number): Problem[] {
  // Generate problems from 0 to maxRange: target x 0, target x 1, ..., target x maxRange
  const allProblems: Problem[] = Array.from({ length: maxRange + 1 }, (_, i) => {
    return { a: i, expected: target * i }
  })
  // Shuffle the array
  for (let i = allProblems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = allProblems[i]
    allProblems[i] = allProblems[j]
    allProblems[j] = tmp
  }
  // Return only the requested count
  return allProblems.slice(0, count)
}


