'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { User, isProfileComplete, fetchUserProfile, upsertUserProfile, enrichCompanyData } from '@/lib/utils/profile'
import Link from 'next/link'

export default function ProfileSetup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    agency_name: '',
    website: '',
    logo_url: ''
  })
  const [enriching, setEnriching] = useState(false)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          // Not authenticated, redirect to login
          router.push('/login')
          return
        }

        // Fetch user profile
        const profile = await fetchUserProfile(session.user.id)

        if (profile) {
          setUser(profile)

          // Pre-fill form with existing data
          setFormData({
            name: profile.name || '',
            agency_name: profile.agency_name || '',
            website: profile.website || '',
            logo_url: profile.logo_url || ''
          })

          // If profile is already complete, redirect to dashboard
          if (isProfileComplete(profile)) {
            router.push('/dashboard')
            return
          }
        } else {
          // Create a new user record if it doesn't exist
          const newUser = await upsertUserProfile(
            session.user.id,
            session.user.email || '',
            {}
          )
          setUser(newUser)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error checking auth:', error)
        setError('Failed to load user data. Please try again.')
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Special handling for website field
    if (name === 'website') {
      // Only process if there's a value
      if (value) {
        let processedValue = value.trim()

        // If it doesn't start with http:// or https://, add https://
        if (!processedValue.match(/^https?:\/\//)) {
          processedValue = `https://${processedValue}`
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }))
      } else {
        setFormData(prev => ({ ...prev, [name]: value }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleEnrich = async () => {
    if (!formData.website) {
      setError('Please enter a website URL to auto-enrich')
      return
    }

    setEnriching(true)
    setError(null)

    try {
      const enrichedData = await enrichCompanyData(formData.website)

      if (enrichedData) {
        setFormData(prev => ({
          ...prev,
          ...enrichedData
        }))
      }
    } catch (error) {
      console.error('Error enriching data:', error)
      setError('Failed to auto-enrich data. Please fill in manually.')
    } finally {
      setEnriching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      const updatedProfile = await upsertUserProfile(
        user.id,
        user.email,
        formData
      )

      if (updatedProfile) {
        // Redirect to dashboard after successful profile update
        router.push('/dashboard')
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Complete Your Profile</h1>

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="agency_name" className="block text-sm font-medium text-gray-700">
              Agency Name
            </label>
            <input
              type="text"
              id="agency_name"
              name="agency_name"
              value={formData.agency_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              This will be used for your public URL: clientsidestory.app/{formData.agency_name ? formData.agency_name.replace(/\s+/g, '-').toLowerCase() : 'your-agency'}
            </p>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website ? formData.website.replace(/^https?:\/\//, '') : ''}
                onChange={handleChange}
                placeholder="example.com"
                className="block w-full flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleEnrich}
                disabled={enriching || !formData.website}
                className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {enriching ? 'Loading...' : 'Auto-Enrich'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Just enter your domain (e.g., example.com) - we'll handle the rest
            </p>
          </div>

          <div>
            <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
              Logo URL (Optional)
            </label>
            <input
              type="url"
              id="logo_url"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
            >
              {isSubmitting ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
