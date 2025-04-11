'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NewStoryPage() {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: '',
    challenge: '',
    solution: '',
    results: '',
    testimonial: '',
    testimonialAuthor: '',
    testimonialPosition: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle the form submission
    console.log('Form submitted:', formData)
    // Then redirect to the stories page or show a success message
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Success Story</h1>
        <Link 
          href="/dashboard/stories" 
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Story Details</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Story Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                placeholder="E.g., How Company X Increased Sales by 200%"
              />
            </div>
            
            <div>
              <label htmlFor="client" className="block text-sm font-medium">
                Client Name
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                placeholder="E.g., Acme Inc."
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
              >
                <option value="">Select a category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Branding">Branding</option>
                <option value="Marketing">Marketing</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Story Content</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="challenge" className="block text-sm font-medium">
                The Challenge
              </label>
              <textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                placeholder="Describe the challenge the client was facing..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="solution" className="block text-sm font-medium">
                The Solution
              </label>
              <textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                placeholder="Describe the solution you provided..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="results" className="block text-sm font-medium">
                The Results
              </label>
              <textarea
                id="results"
                name="results"
                value={formData.results}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                placeholder="Describe the results achieved..."
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Client Testimonial</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="testimonial" className="block text-sm font-medium">
                Testimonial Quote
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                placeholder="Add a quote from your client..."
              ></textarea>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="testimonialAuthor" className="block text-sm font-medium">
                  Author Name
                </label>
                <input
                  type="text"
                  id="testimonialAuthor"
                  name="testimonialAuthor"
                  value={formData.testimonialAuthor}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                  placeholder="E.g., John Smith"
                />
              </div>
              
              <div>
                <label htmlFor="testimonialPosition" className="block text-sm font-medium">
                  Author Position
                </label>
                <input
                  type="text"
                  id="testimonialPosition"
                  name="testimonialPosition"
                  value={formData.testimonialPosition}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                  placeholder="E.g., CEO, Acme Inc."
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Link 
            href="/dashboard/stories" 
            className="rounded border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Story
          </button>
        </div>
      </form>
    </div>
  )
}
