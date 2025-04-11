import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const errorCode = requestUrl.searchParams.get('error_code')
  const origin = requestUrl.origin

  // Handle authentication errors
  if (error) {
    // Redirect to error page with error details
    const errorUrl = new URL(`${origin}/auth/error`)
    if (error) errorUrl.searchParams.set('error', error)
    if (errorDescription) errorUrl.searchParams.set('error_description', errorDescription)
    if (errorCode) errorUrl.searchParams.set('error_code', errorCode)

    return NextResponse.redirect(errorUrl)
  }

  // Handle successful authentication
  if (code) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      // If there's an error exchanging the code for a session
      if (error) {
        console.error('Error exchanging code for session:', error.message)
        return NextResponse.redirect(
          `${origin}/auth/error?error=session_error&error_description=${encodeURIComponent(
            error.message || 'Failed to complete authentication'
          )}`
        )
      }

      // Successful authentication, redirect to dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    } catch (err) {
      console.error('Unexpected error during authentication:', err)
      return NextResponse.redirect(
        `${origin}/auth/error?error=unexpected_error&error_description=${encodeURIComponent(
          'An unexpected error occurred during authentication'
        )}`
      )
    }
  }

  // No code or error provided, redirect to login
  return NextResponse.redirect(`${origin}/login`)
}
