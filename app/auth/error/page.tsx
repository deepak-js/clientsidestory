'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [errorCode, setErrorCode] = useState<string>('')

  useEffect(() => {
    // Get error details from URL parameters
    const error = searchParams.get('error') || 'Unknown error'
    const description = searchParams.get('error_description') || 'An error occurred during authentication'
    const code = searchParams.get('error_code') || ''

    // Format the error description (replace '+' with spaces)
    const formattedDescription = description.replace(/\+/g, ' ')

    setErrorMessage(error)
    setErrorDescription(formattedDescription)
    setErrorCode(code)
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-8 md:p-24">
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 shadow-md">
        <div className="mb-6 flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="mt-4 text-center text-2xl font-bold text-red-700">Authentication Error</h1>
        </div>

        <div className="mb-6 rounded-md bg-white p-4 text-sm">
          <p className="mb-2">
            <span className="font-semibold">Error:</span> {errorMessage}
          </p>
          {errorCode && (
            <p className="mb-2">
              <span className="font-semibold">Error Code:</span> {errorCode}
            </p>
          )}
          <p className="mb-2">
            <span className="font-semibold">Description:</span> {errorDescription}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </Link>
          <Link href="/" className="text-center text-sm text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
