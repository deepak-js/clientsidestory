# ClientsideStory

ClientsideStory is a B2B SaaS platform for client onboarding, replacing multiple tools (Google Forms, Calendly, Gmail, PandaDoc, Razorpay, Notion, CRM) with a streamlined workflow.

## Overview

ClientsideStory helps agencies and freelancers manage their client relationships with:

- Public profile pages for showcasing work and collecting leads
- Client testimonials management
- Success metrics display
- Contact form and messaging system
- Custom branding with accent colors and profile images

## Features

### Public Profile

- Professional profile page at clientsidestory.app/[username]
- Custom accent colors and branding
- Success metrics display
- Client testimonials showcase
- Contact form for lead generation
- Social sharing capabilities
- SEO optimization with structured data

### Dashboard

- Profile management
- Testimonials management
- Messages dashboard
- Metrics tracking
- Settings and customization

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/clientsidestory.git
   cd clientsidestory
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Run database migrations:
   Execute the SQL scripts in the `database/migrations` directory in your Supabase SQL editor.

5. Start the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions and API clients
- `public/` - Static assets
- `database/` - Database migrations and schemas

## Development Phases

The project is being developed in phases:

1. **Phase 1**: Core functionality (profile setup, database tables)
2. **Phase 2**: User dashboard enhancement (stories, settings)
3. **Phase 3**: Public profile enhancement (SEO, social sharing, contact form)
4. **Phase 4**: Advanced features (analytics, custom domains)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
