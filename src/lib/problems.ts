export type Problem = {
  a: number
  expected: number
}

export function generateProblems(target: number, count: number): Problem[] {
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


