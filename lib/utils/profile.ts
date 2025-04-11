import { createClient } from '@/lib/supabase/server'

// Define the User type based on your database schema
export type User = {
  id: string
  email: string
  name: string | null
  agency_name: string | null
  logo_url: string | null
  website: string | null
  created_at: string
  updated_at: string
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

// Fetch user profile from Supabase
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data as User
  } catch (error) {
    console.error('Exception fetching user profile:', error)
    return null
  }
}

// Create or update user profile
export const upsertUserProfile = async (
  userId: string,
  email: string,
  profileData: Partial<User>
): Promise<User | null> => {
  try {
    const supabase = await createClient()

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
