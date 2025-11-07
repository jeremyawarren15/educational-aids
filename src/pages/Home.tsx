import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-50 to-sky-100 text-sky-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Math Fill‑in‑the‑Blank</h1>
          <p className="mt-2 text-sky-700 text-lg">Choose a game to play</p>
        </header>

        <main>
          <div className="bg-white/90 backdrop-blur shadow-2xl rounded-3xl p-6 md:p-10 border border-sky-100">
            <div className="grid gap-6 md:gap-8">
              <Link
                to="/addition"
                className="block rounded-2xl bg-sky-600 px-8 py-6 text-center text-2xl font-extrabold text-white shadow-lg transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300"
              >
                Addition
              </Link>
              <Link
                to="/multiplication"
                className="block rounded-2xl bg-emerald-600 px-8 py-6 text-center text-2xl font-extrabold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              >
                Multiplication
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

