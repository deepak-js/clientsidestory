import { ThemeVariables } from '@supabase/auth-ui-shared'

// Define brand colors
export const brandColors = {
  // Primary brand color
  primary: '#3B82F6', // Blue-500
  primaryHover: '#2563EB', // Blue-600
  primaryActive: '#1D4ED8', // Blue-700
  
  // Secondary brand color
  secondary: '#F3F4F6', // Gray-100
  secondaryHover: '#E5E7EB', // Gray-200
  secondaryActive: '#D1D5DB', // Gray-300
  
  // Text colors
  textPrimary: '#1F2937', // Gray-800
  textSecondary: '#6B7280', // Gray-500
  textLight: '#F9FAFB', // Gray-50
  
  // Border colors
  border: '#E5E7EB', // Gray-200
  borderFocus: '#93C5FD', // Blue-300
  
  // Background colors
  background: '#FFFFFF', // White
  backgroundSecondary: '#F9FAFB', // Gray-50
  
  // Status colors
  success: '#10B981', // Green-500
  error: '#EF4444', // Red-500
  warning: '#F59E0B', // Amber-500
  info: '#3B82F6', // Blue-500
}

// Create a custom theme for the Auth UI
export const customTheme: ThemeVariables = {
  default: {
    colors: {
      brand: brandColors.primary,
      brandAccent: brandColors.primaryHover,
      brandButtonText: brandColors.textLight,
      defaultButtonBackground: brandColors.secondary,
      defaultButtonBackgroundHover: brandColors.secondaryHover,
      defaultButtonBorder: brandColors.border,
      defaultButtonText: brandColors.textPrimary,
      dividerBackground: brandColors.border,
      inputBackground: brandColors.background,
      inputBorder: brandColors.border,
      inputBorderHover: brandColors.borderFocus,
      inputBorderFocus: brandColors.primary,
      inputText: brandColors.textPrimary,
      inputLabelText: brandColors.textSecondary,
      inputPlaceholder: brandColors.textSecondary,
      messageText: brandColors.textSecondary,
      messageTextDanger: brandColors.error,
      anchorTextColor: brandColors.primary,
      anchorTextHoverColor: brandColors.primaryHover,
    },
    space: {
      spaceSmall: '4px',
      spaceMedium: '8px',
      spaceLarge: '16px',
      labelBottomMargin: '8px',
      anchorBottomMargin: '4px',
      emailInputSpacing: '4px',
      socialAuthSpacing: '12px',
      buttonPadding: '10px 15px',
      inputPadding: '10px 15px',
    },
    fontSizes: {
      baseBodySize: '14px',
      baseInputSize: '14px',
      baseLabelSize: '14px',
      baseButtonSize: '14px',
    },
    fonts: {
      bodyFontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      buttonFontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      inputFontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      labelFontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    borderWidths: {
      buttonBorderWidth: '1px',
      inputBorderWidth: '1px',
    },
    radii: {
      borderRadiusButton: '0.375rem',
      buttonBorderRadius: '0.375rem',
      inputBorderRadius: '0.375rem',
    },
  },
  // Dark theme variant
  dark: {
    colors: {
      brand: brandColors.primary,
      brandAccent: brandColors.primaryHover,
      brandButtonText: brandColors.textLight,
      defaultButtonBackground: '#374151', // Gray-700
      defaultButtonBackgroundHover: '#4B5563', // Gray-600
      defaultButtonBorder: '#4B5563', // Gray-600
      defaultButtonText: '#F9FAFB', // Gray-50
      dividerBackground: '#374151', // Gray-700
      inputBackground: '#1F2937', // Gray-800
      inputBorder: '#374151', // Gray-700
      inputBorderHover: '#4B5563', // Gray-600
      inputBorderFocus: brandColors.primary,
      inputText: '#F9FAFB', // Gray-50
      inputLabelText: '#D1D5DB', // Gray-300
      inputPlaceholder: '#9CA3AF', // Gray-400
      messageText: '#D1D5DB', // Gray-300
      messageTextDanger: '#F87171', // Red-400
      anchorTextColor: '#60A5FA', // Blue-400
      anchorTextHoverColor: '#93C5FD', // Blue-300
    },
    // Keep the same spacing, font sizes, fonts, border widths, and radii as the default theme
  },
}
