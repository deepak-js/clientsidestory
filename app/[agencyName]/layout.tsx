import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { fetchUserProfileWithTestimonials } from '@/lib/utils/profile-server'

// Generate metadata for the agency page
export async function generateMetadata(props: { params: { agencyName: string } }): Promise<Metadata> {
  const supabase = await createClient()

  // Await the entire params object first
  const { params } = await props
  const agencyName = params.agencyName

  // Query the users table to find an agency with a matching slug
  const { data: agency } = await supabase
    .from('users')
    .select('*')
    .ilike('agency_name', agencyName.replace(/-/g, '%'))
    .single()

  if (!agency) {
    return {
      title: 'Agency Not Found',
      description: 'The requested agency could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  // Get the full profile with testimonials for rich metadata
  const profile = await fetchUserProfileWithTestimonials(agency.id)

  // Format the agency name for display
  const displayName = profile?.agency_name || agency.agency_name || agency.name || 'Agency'

  // Create a description that includes services if available
  const description = profile?.tagline
    ? `${displayName} - ${profile.tagline}. View client success stories and case studies.`
    : `View client success stories and case studies from ${displayName}.`

  // Get the logo URL for OpenGraph image
  const logoUrl = profile?.logo_url || '/default-agency-logo.png'

  // Base URL for canonical links and images
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clientsidestory.app'
  const profileUrl = `${baseUrl}/${agencyName}`

  return {
    title: `${displayName} | Client Success Stories`,
    description: description,
    keywords: [`${displayName}`, 'client stories', 'case studies', 'testimonials', 'agency portfolio'],
    authors: [{ name: displayName }],
    creator: displayName,
    publisher: 'ClientsideStory',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'profile',
      title: `${displayName} | Client Success Stories`,
      description: description,
      url: profileUrl,
      siteName: 'ClientsideStory',
      images: [
        {
          url: logoUrl.startsWith('http') ? logoUrl : `${baseUrl}${logoUrl}`,
          width: 1200,
          height: 630,
          alt: `${displayName} logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} | Client Success Stories`,
      description: description,
      images: [logoUrl.startsWith('http') ? logoUrl : `${baseUrl}${logoUrl}`],
      creator: '@clientsidestory',
      site: '@clientsidestory',
    },
    alternates: {
      canonical: profileUrl,
    },
    metadataBase: new URL(baseUrl),
  }
}

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
