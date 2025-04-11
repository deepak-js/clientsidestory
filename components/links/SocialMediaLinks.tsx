'use client'

import { useState } from 'react'
import { createLink, updateLink, deleteLink, Link as LinkType } from '@/lib/utils/links'
import { formatUrl } from '@/lib/utils/validation'
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaTiktok, 
  FaGlobe,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes
} from 'react-icons/fa'

// Social media platform definitions
const SOCIAL_PLATFORMS = [
  { 
    id: 'website', 
    name: 'Website', 
    icon: <FaGlobe className="h-5 w-5" />, 
    placeholder: 'https://yourwebsite.com',
    baseUrl: '',
    color: '#4A5568'
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: <FaFacebook className="h-5 w-5" />, 
    placeholder: 'username or page name',
    baseUrl: 'https://facebook.com/',
    color: '#1877F2'
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: <FaTwitter className="h-5 w-5" />, 
    placeholder: 'username (without @)',
    baseUrl: 'https://twitter.com/',
    color: '#1DA1F2'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: <FaInstagram className="h-5 w-5" />, 
    placeholder: 'username (without @)',
    baseUrl: 'https://instagram.com/',
    color: '#E1306C'
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: <FaLinkedin className="h-5 w-5" />, 
    placeholder: 'username or profile URL',
    baseUrl: 'https://linkedin.com/in/',
    color: '#0077B5'
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: <FaYoutube className="h-5 w-5" />, 
    placeholder: 'channel name or URL',
    baseUrl: 'https://youtube.com/c/',
    color: '#FF0000'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: <FaTiktok className="h-5 w-5" />, 
    placeholder: 'username (without @)',
    baseUrl: 'https://tiktok.com/@',
    color: '#000000'
  }
]

interface SocialMediaLinksProps {
  userId: string
  links: LinkType[]
  onLinkAdded: (link: LinkType) => void
  onLinkUpdated: (link: LinkType) => void
  onLinkDeleted: (linkId: string) => void
}

export default function SocialMediaLinks({ 
  userId, 
  links, 
  onLinkAdded, 
  onLinkUpdated, 
  onLinkDeleted 
}: SocialMediaLinksProps) {
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get existing social links
  const socialLinks = links.filter(link => 
    SOCIAL_PLATFORMS.some(platform => 
      link.title.toLowerCase() === platform.name.toLowerCase()
    )
  )
  
  // Get platforms that don't have links yet
  const availablePlatforms = SOCIAL_PLATFORMS.filter(platform => 
    !socialLinks.some(link => 
      link.title.toLowerCase() === platform.name.toLowerCase()
    )
  )
  
  // Handle adding a new social link
  const handleAddLink = async (platform: typeof SOCIAL_PLATFORMS[0]) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Create a new link
      const newLink = await createLink(userId, {
        title: platform.name,
        url: platform.baseUrl,
        icon: platform.id,
        is_highlighted: false,
        is_visible: true,
        display_order: links.length
      })
      
      if (newLink) {
        onLinkAdded(newLink)
        setEditingLink(newLink.id)
        setEditValue(platform.baseUrl)
      } else {
        setError(`Failed to add ${platform.name} link`)
      }
    } catch (err) {
      console.error(`Error adding ${platform.name} link:`, err)
      setError(`Failed to add ${platform.name} link`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle updating a social link
  const handleUpdateLink = async (link: LinkType) => {
    if (!editValue.trim()) {
      setError('Please enter a valid URL or username')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Format the URL based on the platform
      const platform = SOCIAL_PLATFORMS.find(p => p.name.toLowerCase() === link.title.toLowerCase())
      let formattedUrl = editValue
      
      if (platform && platform.id !== 'website') {
        // If it's already a full URL, use it as is
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
          // Remove any @ symbol if present
          formattedUrl = formattedUrl.replace(/^@/, '')
          
          // If it's just a username, prepend the base URL
          formattedUrl = platform.baseUrl + formattedUrl
        }
      } else {
        // For website, ensure it has https:// prefix
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
          formattedUrl = 'https://' + formattedUrl
        }
      }
      
      // Update the link
      const updated = await updateLink(link.id, { url: formattedUrl })
      
      if (updated) {
        onLinkUpdated({
          ...link,
          url: formattedUrl
        })
        setEditingLink(null)
        setEditValue('')
      } else {
        setError(`Failed to update ${link.title} link`)
      }
    } catch (err) {
      console.error(`Error updating ${link.title} link:`, err)
      setError(`Failed to update ${link.title} link`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle deleting a social link
  const handleDeleteLink = async (link: LinkType) => {
    if (confirm(`Are you sure you want to remove your ${link.title} link?`)) {
      setIsSubmitting(true)
      setError(null)
      
      try {
        const success = await deleteLink(link.id)
        
        if (success) {
          onLinkDeleted(link.id)
        } else {
          setError(`Failed to delete ${link.title} link`)
        }
      } catch (err) {
        console.error(`Error deleting ${link.title} link:`, err)
        setError(`Failed to delete ${link.title} link`)
      } finally {
        setIsSubmitting(false)
      }
    }
  }
  
  // Get platform info for a link
  const getPlatformInfo = (link: LinkType) => {
    return SOCIAL_PLATFORMS.find(p => p.name.toLowerCase() === link.title.toLowerCase()) || SOCIAL_PLATFORMS[0]
  }
  
  // Get display URL (without http:// or base URL)
  const getDisplayUrl = (link: LinkType) => {
    const platform = getPlatformInfo(link)
    let url = link.url
    
    // Remove http:// or https://
    url = url.replace(/^https?:\/\//, '')
    
    // Remove base URL if it's a social platform
    if (platform.id !== 'website' && platform.baseUrl) {
      const baseUrlWithoutProtocol = platform.baseUrl.replace(/^https?:\/\//, '')
      url = url.replace(baseUrlWithoutProtocol, '')
    }
    
    return url
  }
  
  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      
      {/* Existing social links */}
      <div className="space-y-2">
        {socialLinks.map(link => (
          <div 
            key={link.id} 
            className="flex items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
          >
            <div 
              className="mr-3 flex h-8 w-8 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: getPlatformInfo(link).color }}
            >
              {SOCIAL_PLATFORMS.find(p => p.name.toLowerCase() === link.title.toLowerCase())?.icon}
            </div>
            
            <div className="flex-1">
              {editingLink === link.id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder={getPlatformInfo(link).placeholder}
                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                    disabled={isSubmitting}
                  />
                  <button
                    onClick={() => handleUpdateLink(link)}
                    disabled={isSubmitting}
                    className="ml-2 rounded-full p-1 text-green-500 hover:bg-green-50"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => {
                      setEditingLink(null)
                      setEditValue('')
                    }}
                    className="ml-1 rounded-full p-1 text-red-500 hover:bg-red-50"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-medium">{link.title}</h3>
                  <p className="text-xs text-gray-500">{getDisplayUrl(link)}</p>
                </>
              )}
            </div>
            
            {editingLink !== link.id && (
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setEditingLink(link.id)
                    setEditValue(getDisplayUrl(link))
                  }}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteLink(link)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Add new social links */}
      {availablePlatforms.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Add social profiles:</h3>
          <div className="flex flex-wrap gap-2">
            {availablePlatforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => handleAddLink(platform)}
                disabled={isSubmitting}
                className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
              >
                <div 
                  className="mr-2 flex h-6 w-6 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.icon}
                </div>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
