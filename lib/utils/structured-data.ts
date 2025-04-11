/**
 * Utility functions for generating structured data (JSON-LD)
 */

interface ProfileData {
  id: string
  username: string
  name: string
  agency: string
  tagline?: string
  profileImage?: string
  isVerified?: boolean
  website?: string
  metrics?: {
    clientsOnboarded: number
    storiesPublished: number
    completionRate: number
  }
  testimonials?: Array<{
    id: string
    name: string
    company: string
    quote: string
    image?: string | null
  }>
}

/**
 * Generate Person structured data for a profile
 */
export function generatePersonSchema(profile: ProfileData, profileUrl: string): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': profileUrl,
    'name': profile.name,
    'alternateName': profile.agency,
    'description': profile.tagline,
    'image': profile.profileImage,
    'url': profileUrl,
    'sameAs': profile.website ? [profile.website] : [],
  }
}

/**
 * Generate Organization structured data for a profile
 */
export function generateOrganizationSchema(profile: ProfileData, profileUrl: string): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': profileUrl,
    'name': profile.agency,
    'description': profile.tagline,
    'logo': profile.profileImage,
    'url': profileUrl,
    'sameAs': profile.website ? [profile.website] : [],
    'founder': {
      '@type': 'Person',
      'name': profile.name,
    },
  }
}

/**
 * Generate Review structured data for testimonials
 */
export function generateReviewSchema(profile: ProfileData, profileUrl: string): Record<string, any>[] {
  if (!profile.testimonials || profile.testimonials.length === 0) {
    return []
  }

  return profile.testimonials.map(testimonial => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    'itemReviewed': {
      '@type': 'Organization',
      'name': profile.agency,
      'url': profileUrl,
    },
    'reviewRating': {
      '@type': 'Rating',
      'ratingValue': '5',
      'bestRating': '5',
    },
    'name': `Review by ${testimonial.name} from ${testimonial.company}`,
    'reviewBody': testimonial.quote,
    'author': {
      '@type': 'Person',
      'name': testimonial.name,
    },
    'publisher': {
      '@type': 'Organization',
      'name': testimonial.company,
    },
  }))
}

/**
 * Generate all structured data for a profile
 */
export function generateAllStructuredData(profile: ProfileData, profileUrl: string): Record<string, any>[] {
  const personSchema = generatePersonSchema(profile, profileUrl)
  const organizationSchema = generateOrganizationSchema(profile, profileUrl)
  const reviewSchemas = generateReviewSchema(profile, profileUrl)

  return [personSchema, organizationSchema, ...reviewSchemas]
}
