'use client'

import { useState } from 'react'
import { 
  FaTwitter, 
  FaFacebook, 
  FaLinkedin, 
  FaEnvelope, 
  FaLink,
  FaWhatsapp
} from 'react-icons/fa'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  accentColor?: string
}

export default function ShareButtons({ url, title, description, accentColor = '#6366f1' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  
  // Encode parameters for sharing
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || '')
  
  // Share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  
  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  
  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-3 text-sm font-medium text-gray-700">Share this profile</h3>
      <div className="flex space-x-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:opacity-80"
          style={{ backgroundColor: accentColor }}
          aria-label="Share on Twitter"
        >
          <FaTwitter />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:opacity-80"
          style={{ backgroundColor: accentColor }}
          aria-label="Share on Facebook"
        >
          <FaFacebook />
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:opacity-80"
          style={{ backgroundColor: accentColor }}
          aria-label="Share on LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:opacity-80"
          style={{ backgroundColor: accentColor }}
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp />
        </a>
        <a
          href={emailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:opacity-80"
          style={{ backgroundColor: accentColor }}
          aria-label="Share via Email"
        >
          <FaEnvelope />
        </a>
        <button
          onClick={copyToClipboard}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:opacity-80"
          style={{ backgroundColor: accentColor }}
          aria-label="Copy link"
        >
          <FaLink />
        </button>
      </div>
      {copied && (
        <div className="mt-2 rounded bg-green-100 px-2 py-1 text-xs text-green-800">
          Link copied to clipboard!
        </div>
      )}
    </div>
  )
}
