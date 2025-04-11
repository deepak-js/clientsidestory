'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, fetchUserProfile, upsertUserProfile, enrichCompanyData } from '@/lib/utils/profile-client'
import ImageUpload from '@/components/profile/ImageUpload'
import { isValidHexColor } from '@/lib/utils/color-utils'

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    agency_name: '',
    website: '',
    logo_url: '',
    tagline: '',
    // Metrics fields
    clients_onboarded: 0,
    stories_published: 0,
    completion_rate: 0,
    // Verification fields (read-only for regular users)
    is_verified: false,
    verification_date: null,
    // Profile customization
    accent_color: '#6366f1' // Default indigo color
  })
  const [enriching, setEnriching] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const loadProfile = async () => {
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
            logo_url: profile.logo_url || '',
            tagline: profile.tagline || '',
            // Metrics fields with defaults
            clients_onboarded: profile.clients_onboarded || 0,
            stories_published: profile.stories_published || 0,
            completion_rate: profile.completion_rate || 0,
            // Verification fields
            is_verified: profile.is_verified || false,
            verification_date: profile.verification_date || null,
            // Profile customization
            accent_color: profile.accent_color || '#6366f1' // Default indigo color
          })
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
        console.error('Error loading profile:', error)
        setError('Failed to load user data. Please try again.')
        setIsLoading(false)
      }
    }

    loadProfile()
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
      <div className="flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Agency Profile</h1>

      {error && (
        <div className="mb-6 rounded border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="agency_name" className="block text-sm font-medium">
            Agency Name
          </label>
          <input
            type="text"
            id="agency_name"
            name="agency_name"
            value={formData.agency_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            This will be used for your public URL: clientsidestory.app/{formData.agency_name ? formData.agency_name.replace(/\s+/g, '-').toLowerCase() : 'your-agency'}
          </p>
        </div>

        <div>
          <label htmlFor="tagline" className="block text-sm font-medium">
            Tagline
          </label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="Helping brands scale with stories"
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            A short, catchy phrase that describes what you do
          </p>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium">
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
              className="block w-full flex-1 rounded-l-md border border-input bg-background px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleEnrich}
              disabled={enriching || !formData.website}
              className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {enriching ? 'Loading...' : 'Auto-Enrich'}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Just enter your domain (e.g., example.com) - we'll handle the rest
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Profile Image
          </label>
          <div className="mt-2">
            {user && (
              <ImageUpload
                currentImageUrl={formData.logo_url}
                onImageUpload={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                userId={user.id}
              />
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload a profile image or logo for your agency (recommended size: 400x400px)
          </p>
        </div>

        {/* Success Metrics Section */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-medium">Success Metrics</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            These metrics will be displayed on your public profile
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="clients_onboarded" className="block text-sm font-medium">
                Clients Onboarded
              </label>
              <input
                type="number"
                id="clients_onboarded"
                name="clients_onboarded"
                min="0"
                value={formData.clients_onboarded}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="stories_published" className="block text-sm font-medium">
                Stories Published
              </label>
              <input
                type="number"
                id="stories_published"
                name="stories_published"
                min="0"
                value={formData.stories_published}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="completion_rate" className="block text-sm font-medium">
                Completion Rate (%)
              </label>
              <input
                type="number"
                id="completion_rate"
                name="completion_rate"
                min="0"
                max="100"
                value={formData.completion_rate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Profile Customization Section */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-medium">Profile Customization</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Customize the appearance of your public profile
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="accent_color" className="block text-sm font-medium">
                Accent Color
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="color"
                  id="accent_color"
                  name="accent_color"
                  value={formData.accent_color}
                  onChange={handleChange}
                  className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.accent_color}
                  onChange={(e) => {
                    // Update the form data
                    const newColor = e.target.value;
                    setFormData(prev => ({ ...prev, accent_color: newColor }));
                  }}
                  name="accent_color"
                  className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none ${isValidHexColor(formData.accent_color) ? 'border-input focus:border-primary focus:ring-primary' : 'border-red-300 focus:border-red-500 focus:ring-red-500'}`}
                />
              </div>
              {!isValidHexColor(formData.accent_color) && (
                <p className="mt-1 text-xs text-red-500">
                  Please enter a valid hex color (e.g., #6366f1)
                </p>
              )}
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Preview:</span>
                <div
                  className="h-6 w-24 rounded"
                  style={{ backgroundColor: isValidHexColor(formData.accent_color) ? formData.accent_color : '#6366f1' }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                This color will be used for buttons and accents on your public profile
              </p>
            </div>

            {/* Verification Status (Read-only for regular users) */}
            <div>
              <label className="block text-sm font-medium">
                Verification Status
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <div className={`flex items-center rounded-full ${formData.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-3 py-1 text-sm`}>
                  {formData.is_verified ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </>
                  ) : (
                    <>Unverified</>
                  )}
                </div>
                {formData.verification_date && (
                  <span className="text-xs text-gray-500">
                    Verified on {new Date(formData.verification_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Verification is currently managed by the ClientsideStory team
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-75"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
