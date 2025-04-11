# ClientsideStory Design System

## Brand Overview

ClientsideStory is an AI-powered platform for client onboarding, billing, communication, and project management. The brand is professional yet approachable, innovative, efficient, and maintains a human touch despite its technological focus.

## Color Palette

### Primary Colors

- **Deep Indigo** (#3730A3)
  - Main brand color
  - Use for primary buttons, key UI elements, and brand identification

- **Vibrant Teal** (#0EA5E9)
  - Secondary brand color
  - Use for accents, highlights, and secondary elements

### Secondary Colors

- **Soft Lavender** (#C4B5FD)
  - Complementary color to Deep Indigo
  - Use for backgrounds, cards, and subtle UI elements

- **Warm Coral** (#F97316)
  - Accent color
  - Use for calls-to-action and important highlights

### Neutral Colors

- **Rich Black** (#111827)
  - Primary text color
  - Use for headings and important text

- **Slate Gray** (#64748B)
  - Secondary text color
  - Use for body text and less prominent UI elements

- **Light Gray** (#F1F5F9)
  - Background color
  - Use for page backgrounds, cards, and containers

- **Pure White** (#FFFFFF)
  - Use for backgrounds and text on dark elements

## Typography

### Primary Font: Inter

- A clean, modern sans-serif with excellent readability
- Use for body text, UI elements, and general content
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Secondary Font: Manrope

- A slightly more distinctive sans-serif with geometric touches
- Use for headings, feature text, and brand elements
- Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Monospace Font: Fira Code

- Use for code snippets, technical information, or to emphasize certain elements
- Weights: 400 (Regular), 500 (Medium)

## Text Styles

### Headings

- **H1**: Manrope Bold, 36px/40px, Rich Black
- **H2**: Manrope SemiBold, 30px/36px, Rich Black
- **H3**: Manrope SemiBold, 24px/32px, Rich Black
- **H4**: Manrope Medium, 20px/28px, Rich Black
- **H5**: Manrope Medium, 18px/24px, Rich Black
- **H6**: Manrope Medium, 16px/24px, Rich Black

### Body Text

- **Body Large**: Inter Regular, 18px/28px, Slate Gray
- **Body**: Inter Regular, 16px/24px, Slate Gray
- **Body Small**: Inter Regular, 14px/20px, Slate Gray
- **Caption**: Inter Regular, 12px/16px, Slate Gray

### UI Elements

- **Button Text**: Inter Medium, 14px/20px
- **Input Text**: Inter Regular, 16px/24px
- **Label Text**: Inter Medium, 14px/20px
- **Menu Item**: Inter Medium, 14px/20px
- **Tooltip**: Inter Regular, 12px/16px

## Components

### Buttons

- **Primary Button**
  - Background: Deep Indigo
  - Text: White
  - Hover: Darker shade of Deep Indigo
  - Border Radius: 8px
  - Padding: 10px 16px

- **Secondary Button**
  - Background: White
  - Text: Deep Indigo
  - Border: 1px solid Deep Indigo
  - Hover: Light Indigo background
  - Border Radius: 8px
  - Padding: 10px 16px

- **Tertiary Button**
  - Background: Transparent
  - Text: Deep Indigo
  - Hover: Light Indigo background
  - Border Radius: 8px
  - Padding: 10px 16px

- **Danger Button**
  - Background: Warm Coral
  - Text: White
  - Hover: Darker shade of Warm Coral
  - Border Radius: 8px
  - Padding: 10px 16px

### Cards

- Background: White
- Border: 1px solid Light Gray
- Border Radius: 12px
- Shadow: 0 4px 6px -1px rgba(55, 48, 163, 0.1), 0 2px 4px -1px rgba(55, 48, 163, 0.06)
- Padding: 24px

### Forms

- **Input Field**
  - Background: White
  - Border: 1px solid Light Gray
  - Border Radius: 8px
  - Focus: Border color changes to Vibrant Teal
  - Padding: 10px 16px

- **Checkbox**
  - Unchecked: 1px solid Slate Gray
  - Checked: Deep Indigo background with white checkmark
  - Border Radius: 4px

- **Radio Button**
  - Unchecked: 1px solid Slate Gray
  - Checked: Deep Indigo outer ring with Deep Indigo dot
  - Border Radius: 50%

### Alerts and Notifications

- **Success**
  - Background: Light Green
  - Icon/Border: Green
  - Text: Dark Green

- **Error**
  - Background: Light Red
  - Icon/Border: Warm Coral
  - Text: Dark Red

- **Warning**
  - Background: Light Yellow
  - Icon/Border: Yellow
  - Text: Dark Yellow

- **Info**
  - Background: Light Blue
  - Icon/Border: Vibrant Teal
  - Text: Dark Blue

## AI Elements

- **AI Chat Interface**
  - Background: Gradient from Light Gray to Soft Lavender
  - AI Message Bubbles: White with Soft Lavender border
  - User Message Bubbles: Deep Indigo with White text

- **AI Indicators**
  - Icon: Sparkle or brain icon in Vibrant Teal
  - Animation: Subtle pulse effect
  - Typography: AI-generated content in Fira Code font

## Iconography

- Style: Simple, outlined icons with occasional filled variants for emphasis
- Size: Based on 24px grid system
- Color: Matches text color or uses brand colors for emphasis
- Recommended Set: Phosphor Icons or Lucide Icons

## Illustrations

- Style: Abstract geometric shapes with gradients using brand colors
- Theme: Flowing connections between elements to represent workflow and communication
- Animation: Subtle animations for key illustrations to add life to the interface

## Spacing System

- 4px base unit
- Common spacing values: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px

## Responsive Breakpoints

- Mobile: 0-639px
- Tablet: 640px-1023px
- Desktop: 1024px+

## Accessibility

- All color combinations must meet WCAG 2.1 AA standards for contrast
- Interactive elements must have clear focus states
- Text should be resizable without breaking layouts
- All functionality should be accessible via keyboard
