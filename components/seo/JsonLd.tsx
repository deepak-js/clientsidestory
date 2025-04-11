import React from 'react'

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[]
}

/**
 * Component to add JSON-LD structured data to a page
 */
export default function JsonLd({ data }: JsonLdProps) {
  const jsonLdString = JSON.stringify(data, null, 2)
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  )
}
