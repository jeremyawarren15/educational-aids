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
  // Generate exactly count problems, randomly selecting values from 0 to maxRange
  const arr: Problem[] = Array.from({ length: count }, () => {
    const a = Math.floor(Math.random() * (maxRange + 1))
    return { a, expected: target * a }
  })
  // Shuffle the array
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}


