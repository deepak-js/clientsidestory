'use client'

import { useState, useEffect } from 'react'
import { Link, trackLinkClick } from '@/lib/utils/links'
import { formatUrl } from '@/lib/utils/validation'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaGlobe,
  FaLink
} from 'react-icons/fa'

interface PublicLinkDisplayProps {
  links: Link[]
  accentColor?: string
  userId: string
}

export default function PublicLinkDisplay({ links, accentColor = '#6366f1', userId }: PublicLinkDisplayProps) {
  // Group links by category
  const [groupedLinks, setGroupedLinks] = useState<Record<string, Link[]>>({})
  const [highlightedLinks, setHighlightedLinks] = useState<Link[]>([])
  const [socialLinks, setSocialLinks] = useState<Link[]>([])

  // Get social media icon
  const getSocialIcon = (link: Link) => {
    const title = link.title.toLowerCase()

    if (title === 'facebook') return <FaFacebook className="h-5 w-5" />
    if (title === 'twitter') return <FaTwitter className="h-5 w-5" />
    if (title === 'instagram') return <FaInstagram className="h-5 w-5" />
    if (title === 'linkedin') return <FaLinkedin className="h-5 w-5" />
    if (title === 'youtube') return <FaYoutube className="h-5 w-5" />
    if (title === 'tiktok') return <FaTiktok className="h-5 w-5" />
    if (title === 'website') return <FaGlobe className="h-5 w-5" />

    return link.icon ? (
      link.icon.startsWith('http') ? (
        <img src={link.icon} alt="" className="h-5 w-5 object-contain" />
      ) : (
        <span>{link.icon}</span>
      )
    ) : (
      <FaLink className="h-5 w-5" />
    )
  }

  // Get social media color
  const getSocialColor = (link: Link) => {
    const title = link.title.toLowerCase()

    if (title === 'facebook') return '#1877F2'
    if (title === 'twitter') return '#1DA1F2'
    if (title === 'instagram') return '#E1306C'
    if (title === 'linkedin') return '#0077B5'
    if (title === 'youtube') return '#FF0000'
    if (title === 'tiktok') return '#000000'
    if (title === 'website') return '#4A5568'

    return accentColor
  }

  useEffect(() => {
    const highlighted: Link[] = []
    const social: Link[] = []
    const grouped: Record<string, Link[]> = {}

    // First pass: separate social, highlighted and regular links
    links.forEach(link => {
      // Check if it's a social media link
      if (link.title.match(/facebook|twitter|instagram|linkedin|youtube|tiktok|website/i)) {
        social.push(link)
      } else if (link.is_highlighted) {
        highlighted.push(link)
      } else {
        const categoryId = link.category_id || 'uncategorized'
        if (!grouped[categoryId]) {
          grouped[categoryId] = []
        }
        grouped[categoryId].push(link)
      }
    })

    setHighlightedLinks(highlighted)
    setSocialLinks(social)
    setGroupedLinks(grouped)
  }, [links])

  // Handle link click
  const handleLinkClick = async (link: Link) => {
    // Track the click
    await trackLinkClick(link.id, document.referrer)
  }

  // Get category name for a group
  const getCategoryName = (categoryId: string): string => {
    if (categoryId === 'uncategorized') return 'Links'

    const link = links.find(l => l.category_id === categoryId)
    return link?.category_name || 'Links'
  }

  // Get category icon
  const getCategoryIcon = (categoryId: string): string => {
    if (categoryId === 'uncategorized') return '🔗'

    const link = links.find(l => l.category_id === categoryId)
    return link?.icon || '📁'
  }

  return (
    <div className="space-y-6">
      {/* Social Media Links */}
      {socialLinks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map(link => (
            <a
              key={link.id}
              href={formatUrl(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-sm transition-all hover:opacity-90"
              style={{ backgroundColor: getSocialColor(link) }}
              title={link.title}
            >
              {getSocialIcon(link)}
            </a>
          ))}
        </div>
      )}

      {/* Highlighted Links */}
      {highlightedLinks.length > 0 && (
        <div className="space-y-3">
          {highlightedLinks.map(link => (
            <a
              key={link.id}
              href={formatUrl(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              className="flex items-center rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md"
              style={{ borderColor: accentColor }}
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                {link.icon ? (
                  link.icon.startsWith('http') ? (
                    <img
                      src={link.icon}
                      alt=""
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    <span className="text-lg">{link.icon}</span>
                  )
                ) : (
                  <span className="text-lg">⭐</span>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900">{link.title}</h3>
                {link.description && (
                  <p className="text-sm text-gray-500">{link.description}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Categorized Links */}
      {Object.entries(groupedLinks).map(([categoryId, categoryLinks]) => (
        <div key={categoryId} className="space-y-3">
          <div className="flex items-center">
            <span className="mr-2 text-lg">{getCategoryIcon(categoryId)}</span>
            <h2 className="text-lg font-medium text-gray-900">{getCategoryName(categoryId)}</h2>
          </div>

          <div className="space-y-2">
            {categoryLinks.map(link => (
              <a
                key={link.id}
                href={formatUrl(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
                className="flex items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  {link.icon ? (
                    link.icon.startsWith('http') ? (
                      <img
                        src={link.icon}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    ) : (
                      <span className="text-base">{link.icon}</span>
                    )
                  ) : (
                    <span className="text-base">🔗</span>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">{link.title}</h3>
                  {link.description && (
                    <p className="text-xs text-gray-500">{link.description}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {socialLinks.length === 0 && highlightedLinks.length === 0 && Object.keys(groupedLinks).length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">No links have been added yet.</p>
        </div>
      )}
    </div>
  )
}
