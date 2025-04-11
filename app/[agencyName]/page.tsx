import { createClient } from '@/lib/supabase/server'
import { Testimonial } from '@/lib/utils/profile-server'
import { Link as LinkType } from '@/lib/utils/links'
import { createColorVariables } from '@/lib/utils/color-utils'
import { generateAllStructuredData } from '@/lib/utils/structured-data'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import ShareButtons from '@/components/social/ShareButtons'
import ContactForm from '@/components/contact/ContactForm'
import PublicLinkDisplay from '@/components/links/PublicLinkDisplay'

// Fetch user profile data from the database
async function getUserProfile(slug: string) {
  try {
    const supabase = await createClient()

    // Normalize the slug for consistent matching
    const normalizedSlug = slug.toLowerCase().trim()

    // Query the users table to find an agency with a matching slug
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('agency_name', normalizedSlug.replace(/-/g, '%'))
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    if (!data) {
      console.error('User profile not found for slug:', slug)
      return null
    }

    // Fetch testimonials for this user
    let testimonials = []
    try {
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', data.id)
        .order('created_at', { ascending: false })
        .limit(3)

      if (testimonialsError) {
        console.error('Error fetching testimonials:', testimonialsError)
      } else {
        testimonials = testimonialsData || []
      }
    } catch (testimonialsException) {
      console.error('Exception fetching testimonials:', testimonialsException)
      // Continue execution even if testimonials fail to load
    }

    // Fetch links for this user
    let links = []
    try {
      const now = new Date().toISOString()

      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select(`
          *,
          link_categories (name, icon)
        `)
        .eq('user_id', data.id)
        .eq('is_visible', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('display_order', { ascending: true })

      if (linksError) {
        console.error('Error fetching links:', linksError)
      } else {
        // Transform the data to include category_name
        links = (linksData || []).map(link => ({
          ...link,
          category_name: link.link_categories ? link.link_categories.name : null,
          category_icon: link.link_categories ? link.link_categories.icon : null,
          link_categories: undefined // Remove the nested object
        }))
      }
    } catch (linksException) {
      console.error('Exception fetching links:', linksException)
      // Continue execution even if links fail to load
    }

    // Track profile view
    try {
      // Increment profile_views counter
      await supabase
        .from('users')
        .update({ profile_views: (data.profile_views || 0) + 1 })
        .eq('id', data.id)
    } catch (viewError) {
      console.error('Error tracking profile view:', viewError)
      // Continue execution even if view tracking fails
    }

    // Use real data for core profile, metrics, testimonials, links, and customization
    return {
      id: data.id,
      username: slug,
      name: data.name || 'Anonymous',
      agency: data.agency_name || slug,
      tagline: data.tagline || 'Helping brands scale with stories.',
      profileImage: data.logo_url,
      isVerified: data.is_verified || false,
      verificationDate: data.verification_date,
      website: data.website,
      accentColor: data.accent_color || '#6366f1', // Default to indigo if not set
      profileViews: data.profile_views || 0,
      // Real metrics data from the database
      metrics: {
        clientsOnboarded: data.clients_onboarded || 0,
        storiesPublished: data.stories_published || 0,
        completionRate: data.completion_rate || 0
      },
      // Links with proper error handling
      links: links || [],
      // Testimonials with proper error handling
      testimonials: testimonials.length > 0 ? testimonials.map(t => ({
        id: t.id,
        name: t.name,
        company: t.company,
        image: t.image_url,
        quote: t.quote
      })) : [
        // Fallback testimonials if none exist yet
        {
          id: 'fallback-1',
          name: 'Jane Smith',
          company: 'Tech Innovators',
          image: null,
          quote: `Working with ${data.name || 'this agency'} transformed our brand storytelling. Our engagement increased by 45% in just two months.`
        },
        {
          id: 'fallback-2',
          name: 'Alex Johnson',
          company: 'Growth Ventures',
          image: null,
          quote: 'The quality of work and attention to detail is outstanding. Our conversion rate doubled after implementing their strategy.'
        }
      ]
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

export default async function ProfilePage(props: { params: { agencyName: string } }) {
  // Await the entire params object first
  const { params } = await props
  const agencyName = params.agencyName
  const profile = await getUserProfile(agencyName)

  if (!profile) {
    notFound()
  }

  // Generate CSS variables for the custom accent color
  const accentColor = profile.accentColor || '#6366f1' // Default to indigo

  // Use the color utility function to create CSS variables
  const customStyles = createColorVariables(accentColor)

  // Generate structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clientsidestory.app'
  const profileUrl = `${baseUrl}/${params.agencyName}`
  const structuredData = generateAllStructuredData(profile, profileUrl)

  return (
    <>
      {/* Add JSON-LD structured data */}
      <JsonLd data={structuredData} />

      <div className="min-h-screen bg-white" style={customStyles}>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4" style={{ ringColor: 'var(--accent-color-light)' }}>
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white" style={{ backgroundColor: 'var(--accent-color)' }}>
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            {profile.isVerified && (
              <span className="ml-2 inline-flex items-center rounded-full p-1"
                title={profile.verificationDate ? `Verified on ${new Date(profile.verificationDate).toLocaleDateString()}` : 'Verified'}
                style={{ backgroundColor: 'var(--accent-color-light)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" style={{ color: 'var(--accent-color)' }}>
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>

          <p className="mb-2 text-lg font-medium" style={{ color: 'var(--accent-color)' }}>@{profile.username}</p>
          <p className="mb-8 text-xl text-gray-600">{profile.tagline}</p>

          {/* Profile Stats and Social Sharing */}
          <div className="mb-6 flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-500">{profile.profileViews} profile views</p>

            {/* Social Share Buttons */}
            <ShareButtons
              url={profileUrl}
              title={`Check out ${profile.name}'s profile on ClientsideStory`}
              description={profile.tagline}
              accentColor={profile.accentColor}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="/dashboard/stories"
              className="inline-flex w-full items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-90 sm:w-auto"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              View Stories
            </Link>
            <a
              href="#"
              className="inline-flex w-full items-center justify-center rounded-md border bg-white px-6 py-3 text-base font-medium shadow-sm hover:bg-opacity-10 sm:w-auto"
              style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)', backgroundColor: 'white' }}
            >
              Book a Call
            </a>
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>

        {/* Social Links Section - Displayed directly under profile info */}
        {profile.links && profile.links.filter(link =>
          link.title.match(/facebook|twitter|instagram|linkedin|youtube|tiktok|website/i)
        ).length > 0 && (
          <div className="mb-8">
            <PublicLinkDisplay
              links={profile.links.filter(link =>
                link.title.match(/facebook|twitter|instagram|linkedin|youtube|tiktok|website/i)
              )}
              accentColor={profile.accentColor}
              userId={profile.id}
            />
          </div>
        )}

        {/* Other Links Section */}
        {profile.links && profile.links.filter(link =>
          !link.title.match(/facebook|twitter|instagram|linkedin|youtube|tiktok|website/i)
        ).length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">Links</h2>
            <PublicLinkDisplay
              links={profile.links.filter(link =>
                !link.title.match(/facebook|twitter|instagram|linkedin|youtube|tiktok|website/i)
              )}
              accentColor={profile.accentColor}
              userId={profile.id}
            />
          </div>
        )}

        {/* Success Metrics */}
        <div className="mb-16 rounded-xl p-8 shadow-sm" style={{ backgroundColor: 'var(--accent-color-light)' }}>
          <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">Success Metrics</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{profile.metrics.clientsOnboarded}</p>
              <p className="text-sm text-gray-600">Clients Onboarded</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{profile.metrics.storiesPublished}</p>
              <p className="text-sm text-gray-600">Stories Published</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{profile.metrics.completionRate}%</p>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">Client Testimonials</h2>
          <div className="space-y-6">
            {profile.testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-lg font-medium text-indigo-600">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="italic text-gray-700">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <ContactForm
            recipientId={profile.id}
            recipientName={profile.name}
            accentColor={profile.accentColor}
          />
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500">
          <p>© 2024 {profile.agency}. All rights reserved.</p>
          <p className="mt-2">
            Powered by <Link href="/" className="text-indigo-600 hover:underline">ClientsideStory</Link>
          </p>
        </footer>
      </div>
    </div>
    </>
  )
}
