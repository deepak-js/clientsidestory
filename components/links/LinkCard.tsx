'use client'

import { useState } from 'react'
import { Link } from '@/lib/utils/links'
import { formatUrl } from '@/lib/utils/validation'
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaStar, FaRegStar, FaGripLines, FaChartBar } from 'react-icons/fa'
import NextLink from 'next/link'

interface LinkCardProps {
  link: Link
  onEdit: (link: Link) => void
  onDelete: (link: Link) => void
  onToggleVisibility: (link: Link) => void
  onToggleHighlight: (link: Link) => void
  isDraggable?: boolean
  accentColor?: string
}

export default function LinkCard({
  link,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleHighlight,
  isDraggable = false,
  accentColor = '#6366f1'
}: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the link "${link.title}"?`)) {
      onDelete(link)
    }
  }

  // Format the URL for display
  const displayUrl = link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Check if the link is active based on scheduling
  const now = new Date()
  const startDate = link.start_date ? new Date(link.start_date) : null
  const endDate = link.end_date ? new Date(link.end_date) : null
  const isActive = (
    link.is_visible &&
    (!startDate || startDate <= now) &&
    (!endDate || endDate >= now)
  )

  // Determine status text
  let statusText = ''
  if (!link.is_visible) {
    statusText = 'Hidden'
  } else if (startDate && startDate > now) {
    statusText = `Scheduled to appear on ${startDate.toLocaleDateString()}`
  } else if (endDate && endDate < now) {
    statusText = `Expired on ${endDate.toLocaleDateString()}`
  }

  return (
    <div
      className={`relative rounded-lg border ${
        link.is_highlighted ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
      } p-4 shadow-sm transition-all ${
        isHovered ? 'shadow-md' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag handle */}
      {isDraggable && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-gray-400">
          <FaGripLines />
        </div>
      )}

      <div className={`flex items-center ${isDraggable ? 'pl-6' : ''}`}>
        {/* Icon */}
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
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
            <span className="text-lg">🔗</span>
          )}
        </div>

        {/* Link info */}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{link.title}</h3>
          <p className="text-xs text-gray-500">{displayUrl}</p>
          {link.category_name && (
            <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {link.category_name}
            </span>
          )}
          {statusText && (
            <p className="mt-1 text-xs text-amber-600">{statusText}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleHighlight(link)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title={link.is_highlighted ? 'Remove highlight' : 'Highlight link'}
          >
            {link.is_highlighted ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
          </button>

          <button
            onClick={() => onToggleVisibility(link)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title={link.is_visible ? 'Hide link' : 'Show link'}
          >
            {link.is_visible ? <FaEye /> : <FaEyeSlash />}
          </button>

          <NextLink
            href={`/dashboard/links/${link.id}`}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="View analytics"
          >
            <FaChartBar />
          </NextLink>

          <button
            onClick={() => onEdit(link)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Edit link"
          >
            <FaEdit />
          </button>

          <button
            onClick={handleDelete}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
            title="Delete link"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Click count */}
      <div className="mt-2 text-right text-xs text-gray-500">
        {link.click_count} {link.click_count === 1 ? 'click' : 'clicks'}
      </div>
    </div>
  )
}
