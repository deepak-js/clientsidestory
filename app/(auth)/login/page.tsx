'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  // Listen for auth state changes and redirect to dashboard when authenticated
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
      if (session) {
        // User is logged in, try to create/update user record
        try {
          const response = await fetch('/api/user/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: session.user.id,
              email: session.user.email,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error('API error:', errorData)
            setError(`Failed to create user record: ${errorData.error || 'Unknown error'}`)
          }
        } catch (error) {
          console.error('Failed to create user record:', error)
          setError(`Failed to create user record: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }

        // Always redirect to dashboard, which will handle profile completion check
        router.push('/dashboard')
      }
    })

    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/dashboard')
      }
    }
    checkUser()

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-white p-8 md:p-24">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-md">
        <div className="mb-6 flex justify-center">
          <img src="/logo.svg" alt="ClientsideStory Logo" className="h-12" />
        </div>
        <p className="mb-8 text-center text-sm text-gray-500">Share your client success stories</p>
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          Login / Sign Up
        </h1>

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['google']}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/auth/callback`}
          onError={(error) => {
            console.error('Auth UI error:', error)
            setError(error.message || 'An error occurred during authentication')
          }}
          view="sign_in"
          showLinks={true}
        />
      </div>
    </div>
  )
}
