'use client'

import { createClient } from '@/lib/supabase/client'
import { Testimonial, fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/utils/profile-client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string } | null>(null)

  // Form state
  const [isEditing, setIsEditing] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    quote: '',
    image_url: ''
  })

  // Fetch user and testimonials on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // Get the current user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError) {
          console.error('Authentication error:', authError)
          setError(`Authentication error: ${authError.message}`)
          setLoading(false)
          return
        }

        if (!authUser) {
          setError('You must be logged in to view testimonials')
          setLoading(false)
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
          return
        }

        setUser(authUser)

        try {
          // Fetch testimonials for the user
          const userTestimonials = await fetchTestimonials(authUser.id)
          setTestimonials(userTestimonials)
        } catch (testimonialError) {
          console.error('Error fetching testimonials:', testimonialError)
          setError('Failed to load testimonials. Please try again.')
          // Continue execution with empty testimonials
          setTestimonials([])
        }
      } catch (err) {
        console.error('Error in testimonials page:', err)
        setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Client name is required')
      return false
    }
    if (!formData.company.trim()) {
      setError('Company name is required')
      return false
    }
    if (!formData.quote.trim()) {
      setError('Testimonial quote is required')
      return false
    }
    if (formData.image_url && !/^https?:\/\/.+/.test(formData.image_url)) {
      setError('Image URL must be a valid URL starting with http:// or https://')
      return false
    }
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in to save testimonials')
      return
    }

    // Validate form data
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (isEditing && currentTestimonial) {
        // Update existing testimonial
        const updated = await updateTestimonial(currentTestimonial.id, formData)

        if (updated) {
          setTestimonials(prev =>
            prev.map(t => t.id === currentTestimonial.id ? { ...t, ...formData } : t)
          )
          // Show success message
          setError(null)
          // Reset form
          resetForm()
        } else {
          setError('Failed to update testimonial. Please try again.')
        }
      } else {
        // Create new testimonial
        const newTestimonial = await createTestimonial(user.id, formData)

        if (newTestimonial) {
          setTestimonials(prev => [newTestimonial, ...prev])
          // Show success message
          setError(null)
          // Reset form
          resetForm()
        } else {
          setError('Failed to create testimonial. Please try again.')
        }
      }
    } catch (err) {
      console.error('Error saving testimonial:', err)
      setError(`Failed to save testimonial: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle testimonial deletion
  const handleDelete = async (id: string) => {
    // Find the testimonial to be deleted for better error messages
    const testimonialToDelete = testimonials.find(t => t.id === id)
    if (!testimonialToDelete) {
      setError('Testimonial not found')
      return
    }

    // Confirm deletion with specific testimonial details
    if (!confirm(`Are you sure you want to delete the testimonial from ${testimonialToDelete.name}? This action cannot be undone.`)) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const success = await deleteTestimonial(id)

      if (success) {
        setTestimonials(prev => prev.filter(t => t.id !== id))
        // Show success message (could use a toast notification in a real app)
        console.log('Testimonial deleted successfully')
      } else {
        setError('Failed to delete testimonial. Please try again.')
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err)
      setError(`Failed to delete testimonial: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle edit button click
  const handleEdit = (testimonial: Testimonial) => {
    setIsEditing(true)
    setCurrentTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      quote: testimonial.quote,
      image_url: testimonial.image_url || ''
    })
  }

  // Reset form to initial state
  const resetForm = () => {
    setIsEditing(false)
    setCurrentTestimonial(null)
    setFormData({
      name: '',
      company: '',
      quote: '',
      image_url: ''
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Testimonial Form */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">
          {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Client Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <label htmlFor="quote" className="block text-sm font-medium">
              Testimonial Quote
            </label>
            <textarea
              id="quote"
              name="quote"
              value={formData.quote}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Working with them was an amazing experience..."
            />
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium">
              Profile Image URL (Optional)
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-2">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Testimonial' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </div>

      {/* Testimonials List */}
      <div>
        <h2 className="mb-4 text-lg font-medium">Your Testimonials</h2>

        {loading && testimonials.length === 0 ? (
          <div className="text-center text-gray-500">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600">You haven't added any testimonials yet.</p>
            <p className="mt-2 text-sm text-gray-500">
              Testimonials from satisfied clients help build trust with potential clients.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-indigo-100">
                      {testimonial.image_url ? (
                        <img
                          src={testimonial.image_url}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-indigo-600">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="rounded-md bg-white px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="rounded-md bg-white px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="italic text-gray-700">"{testimonial.quote}"</p>

                <div className="mt-4 text-xs text-gray-400">
                  Added on {new Date(testimonial.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
