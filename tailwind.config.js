/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        'cs-indigo': '#3730A3',
        'cs-teal': '#0EA5E9',
        
        // Secondary
        'cs-lavender': '#C4B5FD',
        'cs-coral': '#F97316',
        
        // Neutrals
        'cs-black': '#111827',
        'cs-gray': '#64748B',
        'cs-light': '#F1F5F9',
        'cs-white': '#FFFFFF',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'display': ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui'],
        'mono': ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'cs': '0 4px 6px -1px rgba(55, 48, 163, 0.1), 0 2px 4px -1px rgba(55, 48, 163, 0.06)',
      },
      borderRadius: {
        'cs': '8px',
      },
    },
  },
  plugins: [],
}
