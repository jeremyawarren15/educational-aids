export type Problem = {
  a: number
  expected: number
  target: number
}

export function generateAdditionProblems(targets: number[], count: number): Problem[] {
  const arr: Problem[] = Array.from({ length: count }, () => {
    // Randomly select a target from the array
    const target = targets[Math.floor(Math.random() * targets.length)]
    const a = Math.floor(Math.random() * (target + 1))
    return { a, expected: target - a, target }
  })
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

export function generateMultiplicationProblems(targets: number[], maxRange: number, count: number): Problem[] {
  // Generate exactly count problems, randomly selecting values from 0 to maxRange
  const arr: Problem[] = Array.from({ length: count }, () => {
    // Randomly select a target from the array
    const target = targets[Math.floor(Math.random() * targets.length)]
    const a = Math.floor(Math.random() * (maxRange + 1))
    return { a, expected: target * a, target }
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


