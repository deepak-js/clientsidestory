/**
 * Validates if a string is a valid URL
 * @param url The URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  // Add http:// if not present to make the URL parser work
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    url = 'http://' + url
  }
  
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Validates if a string is a valid email address
 * @param email The email to validate
 * @returns True if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates if a string is a valid hex color
 * @param color The color to validate
 * @returns True if the color is valid, false otherwise
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

/**
 * Validates if a string is a valid date
 * @param dateString The date string to validate
 * @returns True if the date is valid, false otherwise
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Formats a URL by adding https:// if not present
 * @param url The URL to format
 * @returns The formatted URL
 */
export function formatUrl(url: string): string {
  if (!url) return url
  
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return 'https://' + url
  }
  
  return url
}
