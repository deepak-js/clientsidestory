import { createClient } from '@/lib/supabase/client'

// Link Category Type
export interface LinkCategory {
  id: string
  user_id: string
  name: string
  description?: string
  icon?: string
  display_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

// Link Type
export interface Link {
  id: string
  user_id: string
  category_id?: string
  title: string
  url: string
  description?: string
  icon?: string
  display_order: number
  is_highlighted: boolean
  is_visible: boolean
  start_date?: string
  end_date?: string
  click_count: number
  created_at: string
  updated_at: string
  // Virtual field for category name
  category_name?: string
}

// Link Click Type
export interface LinkClick {
  id: string
  link_id: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  country?: string
  city?: string
  clicked_at: string
}

// Link Analytics Type
export interface LinkAnalytics {
  total_clicks: number
  clicks_by_day: { date: string; count: number }[]
  top_referrers: { referrer: string; count: number }[]
  top_countries: { country: string; count: number }[]
}

// Link Category Input Type
export type LinkCategoryInput = Omit<LinkCategory, 'id' | 'user_id' | 'created_at' | 'updated_at'>

// Link Input Type
export type LinkInput = Omit<Link, 'id' | 'user_id' | 'click_count' | 'created_at' | 'updated_at' | 'category_name'>

// Fetch link categories for a user
export const fetchLinkCategories = async (userId: string): Promise<LinkCategory[]> => {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('link_categories')
      .select('*')
      .eq('user_id', userId)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching link categories:', error)
      return []
    }

    return data as LinkCategory[]
  } catch (error) {
    console.error('Exception fetching link categories:', error)
    return []
  }
}

// Fetch links for a user
export const fetchLinks = async (userId: string): Promise<Link[]> => {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('links')
      .select(`
        *,
        link_categories (
          name
        )
      `)
      .eq('user_id', userId)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching links:', error)
      return []
    }

    // Transform the data to include category_name
    return data.map(link => ({
      ...link,
      category_name: link.link_categories ? link.link_categories.name : null,
      link_categories: undefined // Remove the nested object
    })) as Link[]
  } catch (error) {
    console.error('Exception fetching links:', error)
    return []
  }
}

// Fetch links for a public profile
export const fetchPublicLinks = async (userId: string): Promise<Link[]> => {
  try {
    const supabase = createClient()

    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('links')
      .select(`
        *,
        link_categories (
          name
        )
      `)
      .eq('user_id', userId)
      .eq('is_visible', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching public links:', error)
      return []
    }

    // Transform the data to include category_name
    return data.map(link => ({
      ...link,
      category_name: link.link_categories ? link.link_categories.name : null,
      link_categories: undefined // Remove the nested object
    })) as Link[]
  } catch (error) {
    console.error('Exception fetching public links:', error)
    return []
  }
}

// Create a new link category
export const createLinkCategory = async (userId: string, category: LinkCategoryInput): Promise<LinkCategory | null> => {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('link_categories')
      .insert([
        {
          user_id: userId,
          ...category
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating link category:', error)
      return null
    }

    return data as LinkCategory
  } catch (error) {
    console.error('Exception creating link category:', error)
    return null
  }
}

// Update a link category
export const updateLinkCategory = async (categoryId: string, category: Partial<LinkCategoryInput>): Promise<LinkCategory | null> => {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('link_categories')
      .update(category)
      .eq('id', categoryId)
      .select()
      .single()

    if (error) {
      console.error('Error updating link category:', error)
      return null
    }

    return data as LinkCategory
  } catch (error) {
    console.error('Exception updating link category:', error)
    return null
  }
}

// Delete a link category
export const deleteLinkCategory = async (categoryId: string): Promise<boolean> => {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('link_categories')
      .delete()
      .eq('id', categoryId)

    if (error) {
      console.error('Error deleting link category:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception deleting link category:', error)
    return false
  }
}

// Create a new link
export const createLink = async (userId: string, link: LinkInput): Promise<Link | null> => {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('links')
      .insert([
        {
          user_id: userId,
          ...link
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating link:', error)
      return null
    }

    return data as Link
  } catch (error) {
    console.error('Exception creating link:', error)
    return null
  }
}

// Update a link
export const updateLink = async (linkId: string, link: Partial<LinkInput>): Promise<Link | null> => {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('links')
      .update(link)
      .eq('id', linkId)
      .select()
      .single()

    if (error) {
      console.error('Error updating link:', error)
      return null
    }

    return data as Link
  } catch (error) {
    console.error('Exception updating link:', error)
    return null
  }
}

// Delete a link
export const deleteLink = async (linkId: string): Promise<boolean> => {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)

    if (error) {
      console.error('Error deleting link:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception deleting link:', error)
    return false
  }
}

// Track a link click
export const trackLinkClick = async (linkId: string, referrer?: string): Promise<boolean> => {
  try {
    const supabase = createClient()

    // Get basic client info
    const userAgent = navigator.userAgent
    
    const { error } = await supabase
      .from('link_clicks')
      .insert([
        {
          link_id: linkId,
          referrer,
          user_agent: userAgent
        }
      ])

    if (error) {
      console.error('Error tracking link click:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception tracking link click:', error)
    return false
  }
}

// Get link analytics
export const getLinkAnalytics = async (linkId: string): Promise<LinkAnalytics | null> => {
  try {
    const supabase = createClient()

    // Get total clicks
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('click_count')
      .eq('id', linkId)
      .single()

    if (linkError) {
      console.error('Error fetching link click count:', linkError)
      return null
    }

    // Get clicks by day (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: clicksByDay, error: clicksByDayError } = await supabase
      .from('link_clicks')
      .select('clicked_at')
      .eq('link_id', linkId)
      .gte('clicked_at', thirtyDaysAgo.toISOString())

    if (clicksByDayError) {
      console.error('Error fetching clicks by day:', clicksByDayError)
      return null
    }

    // Process clicks by day
    const clicksByDayMap = new Map<string, number>()
    
    clicksByDay.forEach(click => {
      const date = new Date(click.clicked_at).toISOString().split('T')[0]
      clicksByDayMap.set(date, (clicksByDayMap.get(date) || 0) + 1)
    })

    const clicksByDayArray = Array.from(clicksByDayMap.entries()).map(([date, count]) => ({
      date,
      count
    }))

    // Get top referrers
    const { data: referrers, error: referrersError } = await supabase
      .from('link_clicks')
      .select('referrer')
      .eq('link_id', linkId)
      .not('referrer', 'is', null)

    if (referrersError) {
      console.error('Error fetching referrers:', referrersError)
      return null
    }

    // Process referrers
    const referrersMap = new Map<string, number>()
    
    referrers.forEach(click => {
      if (click.referrer) {
        referrersMap.set(click.referrer, (referrersMap.get(click.referrer) || 0) + 1)
      }
    })

    const topReferrers = Array.from(referrersMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Get top countries
    const { data: countries, error: countriesError } = await supabase
      .from('link_clicks')
      .select('country')
      .eq('link_id', linkId)
      .not('country', 'is', null)

    if (countriesError) {
      console.error('Error fetching countries:', countriesError)
      return null
    }

    // Process countries
    const countriesMap = new Map<string, number>()
    
    countries.forEach(click => {
      if (click.country) {
        countriesMap.set(click.country, (countriesMap.get(click.country) || 0) + 1)
      }
    })

    const topCountries = Array.from(countriesMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      total_clicks: link.click_count,
      clicks_by_day: clicksByDayArray,
      top_referrers: topReferrers,
      top_countries: topCountries
    }
  } catch (error) {
    console.error('Exception getting link analytics:', error)
    return null
  }
}

// Reorder links
export const reorderLinks = async (linkIds: string[]): Promise<boolean> => {
  try {
    const supabase = createClient()

    // Update each link's display_order
    const updates = linkIds.map((id, index) => ({
      id,
      display_order: index
    }))

    const { error } = await supabase
      .from('links')
      .upsert(updates)

    if (error) {
      console.error('Error reordering links:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception reordering links:', error)
    return false
  }
}

// Reorder link categories
export const reorderLinkCategories = async (categoryIds: string[]): Promise<boolean> => {
  try {
    const supabase = createClient()

    // Update each category's display_order
    const updates = categoryIds.map((id, index) => ({
      id,
      display_order: index
    }))

    const { error } = await supabase
      .from('link_categories')
      .upsert(updates)

    if (error) {
      console.error('Error reordering link categories:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception reordering link categories:', error)
    return false
  }
}
