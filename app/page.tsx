import Link from 'next/link'

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">ClientsideStory</h1>
          <p className="mt-3 text-lg text-gray-600">Share your client success stories</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Welcome to ClientsideStory</p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="/login"
              className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Login / Sign Up
            </Link>
            <Link
              href="/stillprofit"
              className="rounded border border-indigo-600 bg-white px-4 py-2 text-indigo-600 hover:bg-indigo-50"
            >
              View Sample Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
