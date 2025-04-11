'use client'

import { useState } from 'react'
import { LinkCategory } from '@/lib/utils/links'
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaGripLines } from 'react-icons/fa'

interface CategoryCardProps {
  category: LinkCategory
  onEdit: (category: LinkCategory) => void
  onDelete: (category: LinkCategory) => void
  onToggleVisibility: (category: LinkCategory) => void
  isDraggable?: boolean
}

export default function CategoryCard({ 
  category, 
  onEdit, 
  onDelete, 
  onToggleVisibility,
  isDraggable = false
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the category "${category.name}"? This will not delete the links in this category.`)) {
      onDelete(category)
    }
  }
  
  return (
    <div 
      className={`relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all ${
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
          {category.icon ? (
            category.icon.startsWith('http') ? (
              <img 
                src={category.icon} 
                alt="" 
                className="h-6 w-6 object-contain" 
              />
            ) : (
              <span className="text-lg">{category.icon}</span>
            )
          ) : (
            <span className="text-lg">📁</span>
          )}
        </div>
        
        {/* Category info */}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{category.name}</h3>
          {category.description && (
            <p className="text-xs text-gray-500">{category.description}</p>
          )}
          {!category.is_visible && (
            <p className="mt-1 text-xs text-amber-600">Hidden</p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleVisibility(category)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title={category.is_visible ? 'Hide category' : 'Show category'}
          >
            {category.is_visible ? <FaEye /> : <FaEyeSlash />}
          </button>
          
          <button
            onClick={() => onEdit(category)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Edit category"
          >
            <FaEdit />
          </button>
          
          <button
            onClick={handleDelete}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
            title="Delete category"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  )
}
