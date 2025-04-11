/**
 * Utility functions for working with colors
 */

/**
 * Validates if a string is a valid hex color
 * @param color The color string to validate
 * @returns True if the color is a valid hex color, false otherwise
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Creates a lighter version of a hex color
 * @param hexColor The hex color to lighten
 * @param opacity The opacity to apply (0-1)
 * @returns The hex color with opacity
 */
export function createLighterColor(hexColor: string, opacity: number = 0.2): string {
  // Default to indigo if the color is invalid
  if (!isValidHexColor(hexColor)) {
    hexColor = '#6366f1';
  }
  
  // Convert opacity to hex
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  
  return `${hexColor}${alpha}`;
}

/**
 * Creates CSS variables for a custom accent color
 * @param accentColor The accent color in hex format
 * @returns An object with CSS variables
 */
export function createColorVariables(accentColor: string): React.CSSProperties {
  // Default to indigo if the color is invalid
  if (!isValidHexColor(accentColor)) {
    accentColor = '#6366f1';
  }
  
  const accentColorLight = createLighterColor(accentColor);
  
  return {
    '--accent-color': accentColor,
    '--accent-color-light': accentColorLight,
  } as React.CSSProperties;
}

/**
 * Generates a contrasting text color (black or white) based on the background color
 * @param hexColor The background color in hex format
 * @returns '#ffffff' for dark backgrounds, '#000000' for light backgrounds
 */
export function getContrastingTextColor(hexColor: string): string {
  // Default to black if the color is invalid
  if (!isValidHexColor(hexColor)) {
    return '#000000';
  }
  
  // Remove the # if it exists
  hexColor = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
