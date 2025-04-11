'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Link,
  LinkCategory,
  LinkInput,
  LinkCategoryInput,
  fetchLinks,
  fetchLinkCategories,
  createLink,
  updateLink,
  deleteLink,
  createLinkCategory,
  updateLinkCategory,
  deleteLinkCategory,
  reorderLinks,
  reorderLinkCategories
} from '@/lib/utils/links'
import LinkCard from '@/components/links/LinkCard'
import CategoryCard from '@/components/links/CategoryCard'
import LinkForm from '@/components/links/LinkForm'
import CategoryForm from '@/components/links/CategoryForm'
import SocialMediaLinks from '@/components/links/SocialMediaLinks'
import { FaPlus, FaFolderPlus, FaLink, FaShareAlt } from 'react-icons/fa'
import NextLink from 'next/link'

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [categories, setCategories] = useState<LinkCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string } | null>(null)

  // Modal state
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [editingCategory, setEditingCategory] = useState<LinkCategory | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Tab state
  const [activeTab, setActiveTab] = useState<'social' | 'links' | 'categories'>('social')

  // Fetch user, links, and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // Get the current user
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
          setError('You must be logged in to manage links')
          setLoading(false)
          return
        }

        setUser(authUser)

        // Fetch links and categories
        const [userLinks, userCategories] = await Promise.all([
          fetchLinks(authUser.id),
          fetchLinkCategories(authUser.id)
        ])

        setLinks(userLinks)
        setCategories(userCategories)
      } catch (err) {
        console.error('Error fetching links data:', err)
        setError('Failed to load links')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle link form submission
  const handleLinkSubmit = async (linkData: LinkInput) => {
    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (editingLink) {
        // Update existing link
        const updated = await updateLink(editingLink.id, linkData)

        if (updated) {
          setLinks(prev =>
            prev.map(l => l.id === editingLink.id ? { ...l, ...updated } : l)
          )
          setShowLinkModal(false)
          setEditingLink(null)
        } else {
          setError('Failed to update link')
        }
      } else {
        // Create new link
        const newLink = await createLink(user.id, {
          ...linkData,
          display_order: links.length // Add to the end
        })

        if (newLink) {
          setLinks(prev => [...prev, newLink])
          setShowLinkModal(false)
        } else {
          setError('Failed to create link')
        }
      }
    } catch (err) {
      console.error('Error saving link:', err)
      setError('Failed to save link')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle category form submission
  const handleCategorySubmit = async (categoryData: LinkCategoryInput) => {
    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (editingCategory) {
        // Update existing category
        const updated = await updateLinkCategory(editingCategory.id, categoryData)

        if (updated) {
          setCategories(prev =>
            prev.map(c => c.id === editingCategory.id ? { ...c, ...updated } : c)
          )
          setShowCategoryModal(false)
          setEditingCategory(null)
        } else {
          setError('Failed to update category')
        }
      } else {
        // Create new category
        const newCategory = await createLinkCategory(user.id, {
          ...categoryData,
          display_order: categories.length // Add to the end
        })

        if (newCategory) {
          setCategories(prev => [...prev, newCategory])
          setShowCategoryModal(false)
        } else {
          setError('Failed to create category')
        }
      }
    } catch (err) {
      console.error('Error saving category:', err)
      setError('Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle link deletion
  const handleDeleteLink = async (link: Link) => {
    setLoading(true)
    setError(null)

    try {
      const success = await deleteLink(link.id)

      if (success) {
        setLinks(prev => prev.filter(l => l.id !== link.id))
      } else {
        setError('Failed to delete link')
      }
    } catch (err) {
      console.error('Error deleting link:', err)
      setError('Failed to delete link')
    } finally {
      setLoading(false)
    }
  }

  // Handle category deletion
  const handleDeleteCategory = async (category: LinkCategory) => {
    setLoading(true)
    setError(null)

    try {
      const success = await deleteLinkCategory(category.id)

      if (success) {
        setCategories(prev => prev.filter(c => c.id !== category.id))
      } else {
        setError('Failed to delete category')
      }
    } catch (err) {
      console.error('Error deleting category:', err)
      setError('Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  // Handle link visibility toggle
  const handleToggleLinkVisibility = async (link: Link) => {
    setLoading(true)
    setError(null)

    try {
      const updated = await updateLink(link.id, { is_visible: !link.is_visible })

      if (updated) {
        setLinks(prev =>
          prev.map(l => l.id === link.id ? { ...l, is_visible: !l.is_visible } : l)
        )
      } else {
        setError('Failed to update link visibility')
      }
    } catch (err) {
      console.error('Error updating link visibility:', err)
      setError('Failed to update link visibility')
    } finally {
      setLoading(false)
    }
  }

  // Handle link highlight toggle
  const handleToggleLinkHighlight = async (link: Link) => {
    setLoading(true)
    setError(null)

    try {
      const updated = await updateLink(link.id, { is_highlighted: !link.is_highlighted })

      if (updated) {
        setLinks(prev =>
          prev.map(l => l.id === link.id ? { ...l, is_highlighted: !l.is_highlighted } : l)
        )
      } else {
        setError('Failed to update link highlight')
      }
    } catch (err) {
      console.error('Error updating link highlight:', err)
      setError('Failed to update link highlight')
    } finally {
      setLoading(false)
    }
  }

  // Handle category visibility toggle
  const handleToggleCategoryVisibility = async (category: LinkCategory) => {
    setLoading(true)
    setError(null)

    try {
      const updated = await updateLinkCategory(category.id, { is_visible: !category.is_visible })

      if (updated) {
        setCategories(prev =>
          prev.map(c => c.id === category.id ? { ...c, is_visible: !c.is_visible } : c)
        )
      } else {
        setError('Failed to update category visibility')
      }
    } catch (err) {
      console.error('Error updating category visibility:', err)
      setError('Failed to update category visibility')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Links</h1>
        <NextLink href="/dashboard" className="text-sm text-indigo-600 hover:underline">
          Back to Dashboard
        </NextLink>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center border-b-2 px-1 pb-4 pt-2 text-sm font-medium ${
              activeTab === 'social'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <FaShareAlt className="mr-2" />
            Social Profiles
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center border-b-2 px-1 pb-4 pt-2 text-sm font-medium ${
              activeTab === 'links'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <FaLink className="mr-2" />
            Custom Links
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center border-b-2 px-1 pb-4 pt-2 text-sm font-medium ${
              activeTab === 'categories'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <FaFolderPlus className="mr-2" />
            Categories
          </button>
        </nav>
      </div>

      {/* Action buttons */}
      <div className="mb-6 flex justify-end">
        {activeTab === 'links' ? (
          <button
            onClick={() => {
              setEditingLink(null)
              setShowLinkModal(true)
            }}
            className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <FaPlus className="mr-2" />
            Add Link
          </button>
        ) : (
          <button
            onClick={() => {
              setEditingCategory(null)
              setShowCategoryModal(true)
            }}
            className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <FaPlus className="mr-2" />
            Add Category
          </button>
        )}
      </div>

      {loading && links.length === 0 && categories.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">Social Media Profiles</h2>
                <p className="mb-4 text-sm text-gray-500">
                  Add your social media profiles and website to make it easy for visitors to connect with you.
                </p>

                {user && (
                  <SocialMediaLinks
                    userId={user.id}
                    links={links}
                    onLinkAdded={(link) => setLinks(prev => [...prev, link])}
                    onLinkUpdated={(updatedLink) => {
                      setLinks(prev =>
                        prev.map(link => link.id === updatedLink.id ? updatedLink : link)
                      )
                    }}
                    onLinkDeleted={(linkId) => {
                      setLinks(prev => prev.filter(link => link.id !== linkId))
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              {links.filter(link =>
                !link.title.match(/facebook|twitter|instagram|linkedin|youtube|tiktok|website/i)
              ).length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                  <p className="text-gray-600">You haven't added any custom links yet.</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Click the "Add Link" button to create your first custom link.
                  </p>
                </div>
              ) : (
                links
                  .filter(link =>
                    !link.title.match(/facebook|twitter|instagram|linkedin|youtube|tiktok|website/i)
                  )
                  .map(link => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onEdit={(link) => {
                        setEditingLink(link)
                        setShowLinkModal(true)
                      }}
                      onDelete={handleDeleteLink}
                      onToggleVisibility={handleToggleLinkVisibility}
                      onToggleHighlight={handleToggleLinkHighlight}
                      isDraggable={false}
                    />
                  ))
              )}
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              {categories.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                  <p className="text-gray-600">You haven't created any categories yet.</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Categories help you organize your links. Click the "Add Category" button to create your first category.
                  </p>
                </div>
              ) : (
                categories.map(category => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={(category) => {
                      setEditingCategory(category)
                      setShowCategoryModal(true)
                    }}
                    onDelete={handleDeleteCategory}
                    onToggleVisibility={handleToggleCategoryVisibility}
                    isDraggable={false}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </h2>
            <LinkForm
              link={editingLink || undefined}
              categories={categories}
              onSubmit={handleLinkSubmit}
              onCancel={() => {
                setShowLinkModal(false)
                setEditingLink(null)
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <CategoryForm
              category={editingCategory || undefined}
              onSubmit={handleCategorySubmit}
              onCancel={() => {
                setShowCategoryModal(false)
                setEditingCategory(null)
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  )
}
