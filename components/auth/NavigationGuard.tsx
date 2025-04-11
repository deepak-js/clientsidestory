'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { fetchUserProfile, isProfileComplete } from '@/lib/utils/profile'

// Pages that don't require authentication
const publicPages = ['/', '/login', '/auth/callback', '/auth/error']

// Pages that don't require a complete profile
const noProfileCheckPages = ['/profile/setup']

export default function NavigationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const checkAuth = async () => {
      // Skip check for public pages
      if (publicPages.includes(pathname)) {
        setIsLoading(false)
        return
      }
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Not authenticated, redirect to login
        router.push('/login')
        return
      }
      
      // Skip profile check for certain pages
      if (noProfileCheckPages.includes(pathname)) {
        setIsLoading(false)
        return
      }
      
      // Check if profile is complete
      const profile = await fetchUserProfile(session.user.id)
      
      if (profile && !isProfileComplete(profile)) {
        // Profile is incomplete, redirect to profile setup
        router.push('/profile/setup')
        return
      }
      
      setIsLoading(false)
    }
    
    checkAuth()
  }, [pathname, router])
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }
  
  return <>{children}</>
}
