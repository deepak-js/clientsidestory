'use client'

import { useState, useEffect } from 'react'
import { Link, LinkCategory, LinkInput } from '@/lib/utils/links'
import { isValidUrl } from '@/lib/utils/validation'

interface LinkFormProps {
  link?: Link
  categories: LinkCategory[]
  onSubmit: (linkData: LinkInput) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export default function LinkForm({ link, categories, onSubmit, onCancel, isSubmitting }: LinkFormProps) {
  const [formData, setFormData] = useState<LinkInput>({
    title: '',
    url: '',
    description: '',
    category_id: undefined,
    icon: '',
    display_order: 0,
    is_highlighted: false,
    is_visible: true,
    start_date: undefined,
    end_date: undefined
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Initialize form with link data if editing
  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title,
        url: link.url,
        description: link.description || '',
        category_id: link.category_id,
        icon: link.icon || '',
        display_order: link.display_order,
        is_highlighted: link.is_highlighted,
        is_visible: link.is_visible,
        start_date: link.start_date,
        end_date: link.end_date
      })
    }
  }, [link])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL'
    }
    
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date)
      const end = new Date(formData.end_date)
      
      if (start > end) {
        newErrors.end_date = 'End date must be after start date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Format URL if needed
    let url = formData.url
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }
    
    await onSubmit({
      ...formData,
      url
    })
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com"
          className={`mt-1 block w-full rounded-md border ${
            errors.url ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
        />
        {errors.url && (
          <p className="mt-1 text-xs text-red-500">{errors.url}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          The URL will be automatically formatted if you don't include http:// or https://
        </p>
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
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option value="">No Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
          placeholder="🔗 or https://example.com/icon.png"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
            Start Date (Optional)
          </label>
          <input
            type="datetime-local"
            id="start_date"
            name="start_date"
            value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
            End Date (Optional)
          </label>
          <input
            type="datetime-local"
            id="end_date"
            name="end_date"
            value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.end_date ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          />
          {errors.end_date && (
            <p className="mt-1 text-xs text-red-500">{errors.end_date}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_highlighted"
            name="is_highlighted"
            checked={formData.is_highlighted}
            onChange={e => setFormData(prev => ({ ...prev, is_highlighted: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="is_highlighted" className="ml-2 block text-sm text-gray-700">
            Highlight this link (will be displayed prominently)
          </label>
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
            Visible (uncheck to hide this link)
          </label>
        </div>
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
          {isSubmitting ? 'Saving...' : link ? 'Update Link' : 'Add Link'}
        </button>
      </div>
    </form>
  )
}
