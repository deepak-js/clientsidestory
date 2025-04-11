import { createClient } from '@/lib/supabase/server'
import { fetchUserProfile, isProfileComplete } from '@/lib/utils/profile-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Dashboard(props: {}) {
  try {
    const supabase = await createClient()

    const {
      data: { user: authUser },
      error: authError
    } = await supabase.auth.getUser()

    // Handle authentication errors
    if (authError) {
      console.error('Authentication error:', authError)
      return redirect('/login?error=auth')
    }

    // Redirect to login if not authenticated
    if (!authUser) {
      return redirect('/login')
    }

    // Fetch user profile data
    const user = await fetchUserProfile(authUser.id)

    // Redirect to profile setup if profile is incomplete
    if (!user || !isProfileComplete(user)) {
      return redirect('/dashboard/profile')
    }

    // If we get here, we have a valid user and profile
    return (
      <div className="space-y-6">
        <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your ClientsideStory dashboard. Manage your client success stories here.
        </p>
        {user?.agency_name && (
          <p className="mt-2 text-sm text-muted-foreground">
            Your public URL: <span className="font-medium">clientsidestory.app/{user.agency_name.replace(/\s+/g, '-').toLowerCase()}</span>
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Your Stories</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create and manage your client success stories
          </p>
          <p className="text-sm text-muted-foreground">No stories yet</p>
          <Link href="/dashboard/stories/new" className="mt-4 inline-block rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            Create New Story
          </Link>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Profile</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Update your profile information
          </p>
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <p><span className="font-medium">Name:</span> {user?.name || 'Not set'}</p>
              {user?.is_verified && (
                <span className="inline-flex items-center rounded-full bg-blue-100 p-1" title="Verified">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-blue-600">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p><span className="font-medium">Agency:</span> {user?.agency_name || 'Not set'}</p>
            <p><span className="font-medium">Tagline:</span> {user?.tagline || 'Not set'}</p>
            <p><span className="font-medium">Website:</span> {user?.website ? (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            ) : 'Not set'}</p>
            <p><span className="font-medium">Profile Views:</span> {user?.profile_views || 0}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/profile" className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Edit Profile
            </Link>
            {user?.agency_name && (
              <Link
                href={`/${user.agency_name.replace(/\s+/g, '-').toLowerCase()}`}
                target="_blank"
                className="rounded border border-primary px-4 py-2 text-primary hover:bg-primary/10"
              >
                View Public Profile
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Success Metrics</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Your public profile performance metrics
          </p>
          <div className="mb-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded bg-gray-50 p-2">
              <p className="text-xl font-semibold text-indigo-600">{user?.clients_onboarded || 0}</p>
              <p className="text-xs text-gray-500">Clients</p>
            </div>
            <div className="rounded bg-gray-50 p-2">
              <p className="text-xl font-semibold text-indigo-600">{user?.stories_published || 0}</p>
              <p className="text-xs text-gray-500">Stories</p>
            </div>
            <div className="rounded bg-gray-50 p-2">
              <p className="text-xl font-semibold text-indigo-600">{user?.completion_rate || 0}%</p>
              <p className="text-xs text-gray-500">Completion</p>
            </div>
          </div>
          <Link href="/dashboard/profile" className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            Update Metrics
          </Link>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Testimonials</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Showcase client testimonials on your profile
          </p>
          <Link href="/dashboard/testimonials" className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            Manage Testimonials
          </Link>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Links</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Manage your profile links and categories
          </p>
          <Link href="/dashboard/links" className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            Manage Links
          </Link>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Messages</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            View and respond to messages from your profile visitors
          </p>
          <Link href="/dashboard/messages" className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            View Messages
          </Link>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-medium">Settings</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
          <Link href="/dashboard/settings" className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            Account Settings
          </Link>
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Error in Dashboard:', error)
    return redirect('/login?error=dashboard')
  }
}