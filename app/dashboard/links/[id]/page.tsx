'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Link, fetchLinks } from '@/lib/utils/links'
import LinkAnalytics from '@/components/links/LinkAnalytics'
import NextLink from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

export default function LinkAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const linkId = params.id as string
  
  const [link, setLink] = useState<Link | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchLinkData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const supabase = createClient()
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError('You must be logged in to view link analytics')
          setLoading(false)
          return
        }
        
        // Fetch the specific link
        const { data, error: linkError } = await supabase
          .from('links')
          .select(`
            *,
            link_categories (
              name
            )
          `)
          .eq('id', linkId)
          .eq('user_id', user.id)
          .single()
        
        if (linkError) {
          console.error('Error fetching link:', linkError)
          setError('Failed to load link data')
          setLoading(false)
          return
        }
        
        if (!data) {
          setError('Link not found')
          setLoading(false)
          return
        }
        
        // Transform the data to include category_name
        setLink({
          ...data,
          category_name: data.link_categories ? data.link_categories.name : null,
          link_categories: undefined // Remove the nested object
        })
      } catch (err) {
        console.error('Error fetching link data:', err)
        setError('Failed to load link data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchLinkData()
  }, [linkId])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 rounded-full p-2 hover:bg-gray-100"
          >
            <FaArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-bold">Link Analytics</h1>
        </div>
        <NextLink href="/dashboard/links" className="text-sm text-indigo-600 hover:underline">
          Back to Links
        </NextLink>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : link ? (
        <>
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-medium text-gray-900">{link.title}</h2>
            <p className="mb-4 text-sm text-gray-500">{link.url}</p>
            <div className="flex flex-wrap gap-2">
              {link.category_name && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {link.category_name}
                </span>
              )}
              {link.is_highlighted && (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  Highlighted
                </span>
              )}
              {!link.is_visible && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                  Hidden
                </span>
              )}
              {link.start_date && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  Starts: {new Date(link.start_date).toLocaleDateString()}
                </span>
              )}
              {link.end_date && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                  Ends: {new Date(link.end_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          <LinkAnalytics link={link} />
        </>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">Link not found</p>
        </div>
      )}
    </div>
  )
}
