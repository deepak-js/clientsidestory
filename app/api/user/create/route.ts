import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { id, email } = await request.json()

    if (!id || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      )
    }

    // Create a Supabase client with the Auth context of the server
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            // This is a workaround for the cookies() await issue
            try {
              return cookies().get(name)?.value
            } catch {
              return undefined
            }
          },
          set(name, value, options) {
            // Cookie setting is handled by middleware
          },
          remove(name, options) {
            // Cookie removal is handled by middleware
          }
        },
      }
    )

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingUser) {
      // Create new user record
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id,
            email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
          { error: 'Failed to create user record' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, data })
    }

    // User already exists
    return NextResponse.json({ success: true, existing: true })

  } catch (error) {
    console.error('Error in user creation API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
