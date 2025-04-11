import { createClient } from '@/lib/supabase/client'

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

// Fetch user profile from Supabase (client-side)
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  if (!userId) {
    console.error('fetchUserProfile called with invalid userId:', userId)
    return null
  }

  try {
    const supabase = createClient()

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

// Create or update user profile (client-side)
export const upsertUserProfile = async (
  userId: string,
  email: string,
  profileData: Partial<User>
): Promise<User | null> => {
  try {
    const supabase = createClient()

    // Format agency_name for URL use if it exists
    let formattedData = { ...profileData }

    // Process website to ensure it has https:// prefix
    if (formattedData.website && !formattedData.website.match(/^https?:\/\//)) {
      formattedData.website = `https://${formattedData.website}`
    }

    // Prepare the data with id and email
    const data = {
      id: userId,
      email,
      ...formattedData,
      updated_at: new Date().toISOString()
    }

    const { data: result, error } = await supabase
      .from('users')
      .upsert(data, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Error upserting user profile:', error)
      return null
    }

    return result as User
  } catch (error) {
    console.error('Exception upserting user profile:', error)
    return null
  }
}

// Auto-enrich company data using Firecrawl
export const enrichCompanyData = async (website: string): Promise<Partial<User> | null> => {
  try {
    // This is a placeholder for the Firecrawl API integration
    // In a real implementation, you would make an API call to Firecrawl

    // For now, we'll return some mock data
    return {
      // This would be populated with data from Firecrawl
      logo_url: null,
      // Any other fields that Firecrawl might provide
    }
  } catch (error) {
    console.error('Error enriching company data:', error)
    return null
  }
}

// Fetch testimonials for a user
export const fetchTestimonials = async (userId: string): Promise<Testimonial[]> => {
  if (!userId) {
    console.error('fetchTestimonials called with invalid userId:', userId)
    return []
  }

  try {
    const supabase = createClient()

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

// Create a new testimonial
export const createTestimonial = async (userId: string, testimonialData: Omit<Testimonial, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Testimonial | null> => {
  if (!userId) {
    console.error('createTestimonial called with invalid userId:', userId)
    return null
  }

  // Validate required fields
  if (!testimonialData.name || !testimonialData.company || !testimonialData.quote) {
    console.error('createTestimonial called with missing required fields', testimonialData)
    return null
  }

  try {
    const supabase = createClient()

    // Sanitize input data
    const sanitizedData = {
      name: testimonialData.name.trim(),
      company: testimonialData.company.trim(),
      quote: testimonialData.quote.trim(),
      image_url: testimonialData.image_url?.trim() || null
    }

    const newTestimonial = {
      user_id: userId,
      ...sanitizedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert([newTestimonial])
      .select()
      .single()

    if (error) {
      console.error('Error creating testimonial:', error)
      return null
    }

    if (!data) {
      console.warn('No data returned when creating testimonial')
      return null
    }

    return data as Testimonial
  } catch (error) {
    console.error('Exception creating testimonial:', error)
    return null
  }
}

// Update an existing testimonial
export const updateTestimonial = async (testimonialId: string, testimonialData: Partial<Testimonial>): Promise<Testimonial | null> => {
  if (!testimonialId) {
    console.error('updateTestimonial called with invalid testimonialId:', testimonialId)
    return null
  }

  // Validate that we have at least one field to update
  if (!testimonialData || Object.keys(testimonialData).length === 0) {
    console.error('updateTestimonial called with no data to update')
    return null
  }

  try {
    const supabase = createClient()

    // Sanitize input data
    const sanitizedData: Record<string, any> = {}
    if (testimonialData.name) sanitizedData.name = testimonialData.name.trim()
    if (testimonialData.company) sanitizedData.company = testimonialData.company.trim()
    if (testimonialData.quote) sanitizedData.quote = testimonialData.quote.trim()
    if (testimonialData.image_url !== undefined) {
      sanitizedData.image_url = testimonialData.image_url?.trim() || null
    }

    const updates = {
      ...sanitizedData,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', testimonialId)
      .select()
      .single()

    if (error) {
      console.error('Error updating testimonial:', error)
      return null
    }

    if (!data) {
      console.warn(`No data returned when updating testimonial id: ${testimonialId}`)
      return null
    }

    return data as Testimonial
  } catch (error) {
    console.error('Exception updating testimonial:', error)
    return null
  }
}

// Delete a testimonial
export const deleteTestimonial = async (testimonialId: string): Promise<boolean> => {
  if (!testimonialId) {
    console.error('deleteTestimonial called with invalid testimonialId:', testimonialId)
    return false
  }

  try {
    const supabase = createClient()

    // First check if the testimonial exists
    const { data: existingData, error: checkError } = await supabase
      .from('testimonials')
      .select('id')
      .eq('id', testimonialId)
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        // This is the "no rows returned" error, which means the testimonial doesn't exist
        console.warn(`Testimonial with id ${testimonialId} not found, nothing to delete`)
        return false
      }
      console.error('Error checking testimonial existence:', checkError)
      return false
    }

    if (!existingData) {
      console.warn(`Testimonial with id ${testimonialId} not found, nothing to delete`)
      return false
    }

    // Proceed with deletion
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', testimonialId)

    if (error) {
      console.error('Error deleting testimonial:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception deleting testimonial:', error)
    return false
  }
}
