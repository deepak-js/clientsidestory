'use client'

import { useState, useEffect } from 'react'
import { LinkCategory, LinkCategoryInput } from '@/lib/utils/links'

interface CategoryFormProps {
  category?: LinkCategory
  onSubmit: (categoryData: LinkCategoryInput) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export default function CategoryForm({ category, onSubmit, onCancel, isSubmitting }: CategoryFormProps) {
  const [formData, setFormData] = useState<LinkCategoryInput>({
    name: '',
    description: '',
    icon: '',
    display_order: 0,
    is_visible: true
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Initialize form with category data if editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        display_order: category.display_order,
        is_visible: category.is_visible
      })
    }
  }, [category])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    await onSubmit(formData)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
          Icon (URL or emoji)
        </label>
        <input
          type="text"
          id="icon"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder="📁 or https://example.com/icon.png"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_visible"
          name="is_visible"
          checked={formData.is_visible}
          onChange={e => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="is_visible" className="ml-2 block text-sm text-gray-700">
          Visible (uncheck to hide this category)
        </label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Add Category'}
        </button>
      </div>
    </form>
  )
}
