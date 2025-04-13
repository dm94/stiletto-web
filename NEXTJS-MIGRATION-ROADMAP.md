# Next.js Migration Roadmap for Stiletto Web

This document outlines the strategy for migrating the Stiletto Web application from its current React/Vite setup to Next.js. The roadmap includes rendering strategies for each route, migration steps, and architecture recommendations. This migration will enhance SEO, performance, and developer experience while maintaining all existing functionality.

## Current Architecture Overview

The current application is:
- Built with React 19.1.0
- Using react-router for client-side routing
- Bundled with Vite
- Using i18next for internationalization
- Styled with Tailwind CSS
- Fetching data from GitHub raw content and custom API endpoints

## Migration Benefits

- **Improved SEO**: Server-side rendering for better search engine visibility
- **Performance**: Faster initial page loads with server rendering and automatic code splitting
- **Built-in API Routes**: Simplify backend communication with API routes
- **Image Optimization**: Automatic image optimization with next/image
- **Internationalization**: Built-in i18n routing support
- **Static Generation**: Generate static pages where appropriate for maximum performance

## Rendering Strategy by Route

| Route | Rendering Strategy | Rationale |
|-------|-------------------|------------|
| `/` (Home) | **SSG** | Static content that rarely changes; can be revalidated periodically |
| `/profile` | **CSR** | User-specific content that requires client-side authentication |
| `/crafter` | **ISR** | Calculator with static item data that occasionally updates; interactive UI |
| `/members` | **CSR** | Dynamic user data that requires authentication |
| `/clanlist` | **SSR** | Dynamic data that benefits from SEO; changes frequently |
| `/walkerlist` | **ISR** | Semi-static data that updates occasionally |
| `/maps` | **CSR** | Interactive map with client-side state management |
| `/trades` | **SSR** | Dynamic trade data that benefits from SEO |
| `/diplomacy` | **CSR** | Interactive UI with authenticated user data |
| `/auctions` | **SSR** | Time-sensitive data that needs to be current |
| `/others` | **SSG** | Static utility pages |
| `/map/:id` | **CSR** | Interactive map with client-side state management |
| `/map` | **CSR** | Map creation interface with client-side state |
| `/tech/:tree` | **ISR** | Tech tree data that changes infrequently |
| `/tech/` | **ISR** | Tech tree overview that changes infrequently |
| `/privacy` | **SSG** | Static content |
| `/item/:name` | **ISR** | Item details that change infrequently; benefits from SEO |
| `/wiki/` | **ISR** | Wiki content that changes occasionally; benefits from SEO |
| `/not-found` | **SSG** | Static error page |

**Legend:**
- **SSR**: Server-Side Rendering - Generates HTML on each request
- **SSG**: Static Site Generation - Pre-renders at build time
- **ISR**: Incremental Static Regeneration - Static generation with revalidation
- **CSR**: Client-Side Rendering - Renders in the browser

## Migration Steps

### 1. Project Setup (Week 1)

- [x] Initialize Next.js project
  ```bash
  pnpm exec create-next-app@latest stiletto-web-next --typescript --tailwind --no-eslint
  ```
- [x] Configure TypeScript
  - Migrate tsconfig.json settings from current project
  - Set up path aliases for improved imports
- [x] Set up Tailwind CSS
  - Migrate custom colors and theme extensions from current config
  - Configure desert theme styling
- [x] Set up Biome for linting and formatting
  ```bash
  pnpm install --save-dev @biomejs/biome
  ```
- [x] Create biome.json configuration file (migrate settings from current project)
  - Copy existing rules and configurations
  - Adjust for Next.js specific patterns
- [ ] Configure environment variables
  - Create .env.local file with Next.js prefixed variables (NEXT_PUBLIC_*)
  - Migrate from Vite environment variables
  ```
  # .env.local example
  NEXT_PUBLIC_RESOURCES_URL=...
  NEXT_PUBLIC_DISCORD_CLIENT_ID=...
  NEXT_PUBLIC_PLAUSIBLE_URL=...
  ```
- [ ] Configure i18next with Next.js
  - Install next-i18next or use Next.js built-in internationalization
  - Set up middleware for language detection and routing
- [ ] Set up project structure
  ```
  /app
    /api
    /(routes)
      /[locale]
        /(pages)
  /components
    /ui          # Reusable UI components
    /layouts     # Layout components
    /features    # Feature-specific components
  /lib
    /services    # API and data fetching services
    /utils       # Utility functions
    /hooks       # Custom React hooks
    /context     # Context providers
  /public
    /locales     # i18n translation files
    /img         # Images and assets
    /json        # Static JSON data
  ```

### 2. Core Components Migration (Week 2)

- [ ] Migrate shared components (Menu, Footer, etc.)
  - Convert to TypeScript if not already
  - Adapt for Next.js Link component instead of react-router
  - Ensure components work with Server Components where appropriate
- [ ] Create layout components for Next.js app router
  - Create root layout.tsx with metadata configuration
  - Implement nested layouts for different sections
  - Set up error.tsx and loading.tsx components
- [ ] Set up authentication context/providers
  - Implement NextAuth.js for Discord authentication
  - Create session provider and hooks
  - Migrate existing authentication logic from DiscordConnection component
- [ ] Implement i18n routing with middleware
  - Create middleware.ts for language detection and routing
  - Set up locale negotiation based on user preferences
  - Migrate from i18next to Next.js i18n or next-i18next

### 3. API Routes Implementation (Week 2-3)

- [ ] Create API routes for backend communication
  - Implement `/api/auth/[...nextauth].ts` for authentication
  - Create API routes for existing endpoints
  - Implement rate limiting and error handling
- [ ] Implement data fetching utilities using Next.js patterns
  - Create service functions using React Server Components
  - Implement caching strategies with Next.js cache()
  - Set up revalidation for ISR pages
  - Migrate existing fetch calls from services.ts
- [ ] Set up environment variables
  - Configure .env.local with Next.js variables
  - Set up runtime configuration

### 4. Page Migration (Week 3-5)

- [ ] Migrate static pages first (Home, Privacy, etc.)
  - Implement as Server Components with static generation
  - Set up metadata for SEO optimization
  - Migrate Helmet metadata to Next.js metadata API
- [ ] Implement SSR pages (ClanList, Trades, etc.)
  - Use Server Components with dynamic data fetching
  - Implement loading states and error boundaries
  - Set up revalidation strategies for frequently changing data
- [ ] Implement ISR pages (Wiki, Item details, etc.)
  - Configure revalidation intervals based on data update frequency
  - Implement on-demand revalidation for content updates
  - Set up dynamic routes with generateStaticParams
- [ ] Migrate interactive CSR pages (Maps, Crafter, etc.)
  - Use Client Components with "use client" directive
  - Implement hybrid approach with Server Components where possible
  - Ensure client-side libraries (Leaflet) work properly with Next.js

### 5. Advanced Features (Week 5-6)

- [ ] Implement image optimization with next/image
  - Replace standard img tags with next/image components
  - Configure image domains in next.config.js
  - Optimize banner and icon images
- [ ] Set up dynamic metadata for SEO
  - Implement generateMetadata functions for dynamic routes
  - Create reusable metadata patterns for similar pages
  - Migrate Helmet metadata to Next.js metadata API
- [ ] Configure caching strategies
  - Implement SWR for client-side data fetching
  - Set up React Cache for server components
  - Configure revalidation strategies for different data types
- [ ] Implement error boundaries and loading states
  - Create error.tsx components for graceful error handling
  - Implement loading.tsx components for improved UX
  - Add Suspense boundaries for streaming content

### 6. Testing and Optimization (Week 6-7)

- [ ] Migrate Cypress tests
  - Update selectors and test patterns for Next.js
  - Configure Cypress for Next.js environment
  - Migrate existing test files from cypress/e2e
- [ ] Performance testing and optimization
  - Run Lighthouse audits for Core Web Vitals
  - Optimize bundle size with Next.js Bundle Analyzer
  - Implement code splitting and lazy loading
- [ ] Accessibility testing
  - Audit with axe or similar tools
  - Ensure proper ARIA attributes and keyboard navigation
  - Test with screen readers
- [ ] Cross-browser compatibility testing
  - Test in Chrome, Firefox, Safari, and Edge
  - Ensure responsive design works across devices
  - Test with different network conditions

### 7. Deployment (Week 7-8)

- [ ] Configure CI/CD pipeline
  - Set up GitHub Actions workflow for automated builds
  - Configure environment variables in CI/CD pipeline
  - Implement automated testing in the pipeline
- [ ] Set up production environment
  - Configure Next.js production build settings
  - Set up environment variables for production
  - Implement proper error logging and monitoring
- [ ] Deploy to Vercel or other hosting platform
  - Configure Vercel project settings
  - Set up custom domains and SSL certificates
  - Configure serverless functions if needed
- [ ] Monitor performance and fix issues
  - Implement real-time monitoring with Vercel Analytics
  - Set up error tracking with Sentry or similar
  - Configure performance monitoring for Core Web Vitals

## Architecture Changes

### Routing

Migrate from react-router to Next.js App Router:

```typescript
// Current: src/router.tsx with react-router
<Route path="/wiki/" element={<Wiki />} />

// Next.js: app/[locale]/wiki/page.tsx
export default function WikiPage() {
  // Server component code
}
```

Routing implementation details:
- Replace BrowserRouter with Next.js App Router
- Convert all routes in src/router.tsx to file-based routes
- Implement dynamic routes with square brackets (e.g., [id])
- Set up catch-all routes for fallback pages
- Create not-found.tsx for 404 handling

### Data Fetching

Replace direct fetch calls with Next.js data fetching methods:

```typescript
// Current: src/functions/services.ts
export const getItems = async (): Promise<Item[]> => {
  // Fetch logic
};

// Next.js: app/[locale]/wiki/page.tsx
export async function generateStaticParams() {
  // For ISR/SSG routes
}

async function getItems() {
  // Server component data fetching
}
```

Data fetching implementation details:
- Move fetch logic from services.ts to server components
- Implement caching with React cache() for shared data
- Use SWR or React Query for client-side data fetching
- Implement revalidation strategies based on data type:
  - Static data (items, markers): Long cache with ISR
  - Dynamic data (trades, clans): Short cache with frequent revalidation
  - User data: Client-side fetching with authentication
- Create API routes for backend communication

### State Management

Separate client and server state:

- Use React Server Components for data fetching and rendering
- Use Client Components for interactive elements
- Consider using React Context or a state management library for complex state

State management implementation details:
- Create dedicated Client Components for interactive UI elements
- Implement "use client" directive for components with client-side state
- Migrate existing state management patterns:
  - Local component state: Keep as-is with useState/useReducer
  - Shared state: Implement React Context providers
  - Complex state: Consider Zustand or Jotai for lightweight state management
- Separate data fetching from UI state management
- Implement proper loading and error states

### Internationalization

Migrate from i18next to Next.js i18n routing:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // i18n routing logic
}
```

## Challenges and Considerations

1. **Authentication**: Migrate Discord authentication to Next.js Auth.js
2. **Interactive Maps**: Ensure Leaflet integration works with SSR
3. **Data Caching**: Implement efficient caching strategies for API data
4. **Bundle Size**: Monitor and optimize bundle size during migration
5. **SEO**: Ensure proper metadata for all pages

## Conclusion

Migrating to Next.js will provide significant benefits for the Stiletto Web application, including improved SEO, performance, and developer experience. By following this roadmap and implementing the appropriate rendering strategies for each route, the migration can be completed systematically while maintaining all existing functionality.