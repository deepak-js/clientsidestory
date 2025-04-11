import { createClient } from '@/lib/supabase/server'

// Define the Testimonial type
export type Testimonial = {
  id: string
  user_id: string
  name: string
  company: string
  quote: string
  image_url: string | null
  created_at: string
  updated_at: string
}

// Define the User type based on your database schema
export type User = {
  id: string
  email: string
  name: string | null
  agency_name: string | null
  logo_url: string | null
  website: string | null
  tagline: string | null
  // Metrics fields
  clients_onboarded: number | null
  stories_published: number | null
  completion_rate: number | null
  // Verification fields
  is_verified: boolean | null
  verification_date: string | null
  // Profile customization
  accent_color: string | null
  profile_views: number | null
  created_at: string
  updated_at: string
  // Virtual field for testimonials (not stored in users table)
  testimonials?: Testimonial[]
}

// Check if a user's profile is complete
export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false

  // Check if required fields are filled
  return Boolean(
    user.name &&
    user.agency_name
  )
}

// Fetch user profile from Supabase (server-side)
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  if (!userId) {
    console.error('fetchUserProfile called with invalid userId:', userId)
    return null
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // This is the "no rows returned" error, which means the user doesn't exist
        console.warn(`User profile not found for userId: ${userId}`)
      } else {
        console.error('Error fetching user profile:', error)
      }
      return null
    }

    if (!data) {
      console.warn(`No data returned for userId: ${userId}`)
      return null
    }

    return data as User
  } catch (error) {
    console.error('Exception fetching user profile:', error)
    return null
  }
}

// Fetch testimonials for a user (server-side)
export const fetchTestimonials = async (userId: string): Promise<Testimonial[]> => {
  if (!userId) {
    console.error('fetchTestimonials called with invalid userId:', userId)
    return []
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching testimonials:', error)
      return []
    }

    if (!data || !Array.isArray(data)) {
      console.warn(`No testimonials found for userId: ${userId}`)
      return []
    }

    return data as Testimonial[]
  } catch (error) {
    console.error('Exception fetching testimonials:', error)
    return []
  }
}

// Fetch user profile with testimonials (server-side)
export const fetchUserProfileWithTestimonials = async (userId: string): Promise<User | null> => {
  if (!userId) {
    console.error('fetchUserProfileWithTestimonials called with invalid userId:', userId)
    return null
  }

  try {
    // Fetch user profile and testimonials in parallel for better performance
    const userPromise = fetchUserProfile(userId)
    const testimonialsPromise = fetchTestimonials(userId)

    const [user, testimonials] = await Promise.all([userPromise, testimonialsPromise])

    if (!user) {
      console.warn(`User profile not found for userId: ${userId} in fetchUserProfileWithTestimonials`)
      return null
    }

    // Return user with testimonials attached
    return {
      ...user,
      testimonials
    }
  } catch (error) {
    console.error('Exception fetching user profile with testimonials:', error)
    return null
  }
}
