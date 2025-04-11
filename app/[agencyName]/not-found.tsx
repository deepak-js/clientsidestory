import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Agency Not Found</h1>
        <p className="mb-8 text-lg text-gray-600">
          The agency you're looking for doesn't exist or may have changed its name.
        </p>
        <Link 
          href="/" 
          className="rounded-md bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
