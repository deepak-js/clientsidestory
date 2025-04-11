import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Define an async function to create a Supabase client for server-side operations
export async function createClient() {
  // Create a Supabase client with proper cookie handling for Next.js 15
  // Make sure we have the environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables')
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      // Use a simpler cookie handler that doesn't try to await cookies()
      cookies: {
        async get(name) {
          // This is a workaround for the cookies() await issue in Next.js 15
          try {
            // In Next.js 15, we need to use a different approach
            // We'll use a synchronous approach that doesn't trigger the warning
            // This is based on the Next.js documentation for handling cookies in SSR
            const cookieStore = cookies()
            const cookieList = cookieStore.getAll()
            const cookie = cookieList.find(c => c.name === name)
            return cookie?.value
          } catch (error) {
            console.error('Error getting cookie:', error)
            return undefined
          }
        },
        set(name, value, options) {
          // Cookie setting is handled by middleware
        },
        remove(name, options) {
          // Cookie removal is handled by middleware
        }
      }
    }
  )
}
