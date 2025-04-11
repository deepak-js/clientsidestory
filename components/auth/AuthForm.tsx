'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Define the types of auth views
type AuthView = 'sign_in' | 'sign_up' | 'forgotten_password' | 'update_password' | 'verify_otp'

export default function AuthForm() {
  const supabase = createClient()
  const router = useRouter()
  const [authView, setAuthView] = useState<AuthView>('sign_in')
  const [email, setEmail] = useState<string>('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false)

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // User is logged in, redirect to dashboard
        router.push('/dashboard')
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, router])

  // Check if email exists when user tries to sign up
  const handleViewChange = async (view: AuthView, email: string) => {
    setAuthView(view)
    setEmail(email)
    setAuthError(null)
    setIsExistingUser(false)

    // If changing to sign up view, check if the email already exists
    if (view === 'sign_up' && email) {
      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false, // Don't create a new user, just check if it exists
          }
        })

        // If no error, the user exists
        if (!error) {
          setIsExistingUser(true)
          setAuthError(`An account with email ${email} already exists. Please sign in instead.`)
        }
      } catch (error) {
        console.error('Error checking email:', error)
      }
    }
  }

  return (
    <div className="w-full">
      {/* Show custom message for existing users */}
      {isExistingUser && (
        <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>An account with this email already exists.</span>
          </div>
          <div className="mt-2 flex justify-between">
            <button
              onClick={() => handleViewChange('sign_in', email)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Sign in instead
            </button>
            <button
              onClick={() => handleViewChange('forgotten_password', email)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </div>
      )}

      {/* Show general auth errors */}
      {authError && !isExistingUser && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
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
            <span>{authError}</span>
          </div>
          <button
            onClick={() => setAuthError(null)}
            className="mt-2 text-xs text-red-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#3B82F6',
                brandAccent: '#2563EB',
                brandButtonText: 'white',
                inputBorderFocus: '#3B82F6',
              }
            }
          },
          style: {
            button: {
              borderRadius: '0.375rem',
              fontSize: '14px',
              fontWeight: '500',
              padding: '10px 15px',
            },
            input: {
              borderRadius: '0.375rem',
              fontSize: '14px',
              padding: '10px 15px',
            },
            anchor: {
              color: '#3B82F6',
              fontSize: '14px',
            },
            message: {
              fontSize: '14px',
            },
            container: {
              width: '100%',
            }
          }
        }}
        theme="light"
        providers={['google', 'linkedin']}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/auth/callback`}
        onError={(error) => {
          console.error('Auth UI error:', error)

          // Check if the error is about an existing user
          if (error.message?.includes('already exists')) {
            setIsExistingUser(true)
            setAuthError('An account with this email already exists. Please sign in instead.')
          } else {
            setAuthError(error.message || 'An error occurred during authentication')
          }
        }}
        view={authView}
        showLinks={true}
        magicLink={true}
        onViewChange={({ view }) => handleViewChange(view as AuthView, email)}
        localization={{
          variables: {
            sign_up: {
              email_label: 'Email address',
              password_label: 'Create a password',
              button_label: 'Create account',
              link_text: 'Don\'t have an account? Sign up',
              confirmation_text: 'Check your email for the confirmation link',
            },
            sign_in: {
              email_label: 'Email address',
              password_label: 'Your password',
              button_label: 'Sign in',
              link_text: 'Already have an account? Sign in',
            },
          }
        }}
      />
    </div>
  )
}
