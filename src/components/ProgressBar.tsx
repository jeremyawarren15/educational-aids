import type { Result } from './Game'

export default function ProgressBar({
  results,
  activeIndex,
}: {
  results: Result[]
  activeIndex: number
}) {
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      {results.map((r, i) => (
        <span
          key={i}
          className={
            'h-3 w-3 rounded-full ' +
            (i < activeIndex
              ? r === 'correct'
                ? 'bg-green-500'
                : 'bg-rose-500'
              : i === activeIndex
              ? 'bg-sky-400 animate-pulse'
              : 'bg-gray-300')
          }
        />
      ))}
    </div>
  )
}


