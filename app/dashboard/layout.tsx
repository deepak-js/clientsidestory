import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    return redirect('/login')
  }

  // Fetch user profile data if needed
  // This would be used to check if profile is complete
  // For now, we'll just pass the auth user data

  return <DashboardLayout user={user}>{children}</DashboardLayout>
}
