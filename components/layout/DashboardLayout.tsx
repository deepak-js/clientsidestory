'use client'

import { ReactNode, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { fetchUserProfile } from '@/lib/utils/profile-client'
import { createColorVariables } from '@/lib/utils/color-utils'

interface DashboardLayoutProps {
  children: ReactNode
  user: {
    email?: string | null
    id: string
  }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [colorStyles, setColorStyles] = useState<React.CSSProperties>({})

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (user && user.id) {
          const profile = await fetchUserProfile(user.id)
          if (profile && profile.accent_color) {
            setColorStyles(createColorVariables(profile.accent_color))
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      }
    }

    loadUserProfile()
  }, [user])

  return (
    <div className="flex h-screen overflow-hidden" style={colorStyles}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-lg font-medium">Welcome, {user.email || 'User'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
