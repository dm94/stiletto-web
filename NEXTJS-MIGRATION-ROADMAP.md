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

| Route | Rendering Strategy | Implementation Status | Rationale |
|-------|-------------------|----------------------|------------|
| `/` (Home) | **SSG** | ✅ Completed | Static content that rarely changes; can be revalidated periodically |
| `/profile` | **CSR** | 🔄 In Progress | User-specific content that requires client-side authentication |
| `/crafter` | **CSR** | ✅ Completed | Calculator with interactive UI requiring client-side state management |
| `/members` | **CSR** | 🔄 In Progress | Dynamic user data that requires authentication |
| `/clanlist` | **SSR** | ✅ Completed | Dynamic data that benefits from SEO; changes frequently |
| `/walkerlist` | **CSR** | ✅ Completed | Semi-static data that updates occasionally |
| `/maps` | **CSR** | ✅ Completed | Interactive map with client-side state management |
| `/trades` | **SSR** | 🔄 In Progress | Dynamic trade data that benefits from SEO |
| `/diplomacy` | **CSR** | 🔄 In Progress | Interactive UI with authenticated user data |
| `/auctions` | **SSR** | 🔄 In Progress | Time-sensitive data that needs to be current |
| `/others` | **SSG** | 🔄 In Progress | Static utility pages |
| `/map/:id` | **CSR** | ✅ Completed | Interactive map with client-side state management |
| `/map` | **CSR** | ✅ Completed | Map creation interface with client-side state |
| `/tech/:tree` | **ISR** | ✅ Completed | Tech tree data that changes infrequently |
| `/tech/` | **ISR** | ✅ Completed | Tech tree overview that changes infrequently |
| `/privacy` | **SSG** | ✅ Completed | Static content |
| `/item/:name` | **ISR** | 🔄 In Progress | Item details that change infrequently; benefits from SEO |
| `/wiki/` | **ISR** | ✅ Completed | Wiki content that changes occasionally; benefits from SEO |
| `/not-found` | **SSG** | ✅ Completed | Static error page |

**Legend:**
- **SSR**: Server-Side Rendering - Generates HTML on each request
- **SSG**: Static Site Generation - Pre-renders at build time
- **ISR**: Incremental Static Regeneration - Static generation with revalidation
- **CSR**: Client-Side Rendering - Renders in the browser

## Route Optimization Strategies

Each rendering strategy requires specific optimization techniques to maximize performance. This section outlines optimization strategies for each route type.

### SSG Routes (Static Site Generation)

| Route | Optimization Strategies |
|-------|------------------------|
| `/` (Home) | - Preload critical assets with `<link rel="preload">` <br> - Implement font optimization with `next/font` <br> - Use image placeholders for faster perceived loading <br> - Implement progressive hydration |
| `/privacy` | - Minimize JavaScript with mostly static content <br> - Implement content security policy <br> - Use static image optimization |
| `/others` | - Share static components across routes <br> - Implement code splitting for any interactive elements |
| `/not-found` | - Keep bundle size minimal <br> - Optimize for Core Web Vitals |

**Implementation Tips:**
- Use `next/image` with proper sizing and formats (WebP/AVIF)
- Implement route-based code splitting
- Set appropriate cache headers (Cache-Control: public, max-age=31536000, immutable)
- Use `next/script` with strategy="afterInteractive" for non-critical scripts
- Analyze and remove unused CSS/JS with bundle analyzer

### SSR Routes (Server-Side Rendering)

| Route | Optimization Strategies |
|-------|------------------------|
| `/clanlist` | - Implement streaming SSR <br> - Use React Suspense for data loading <br> - Optimize database queries <br> - Implement stale-while-revalidate caching |
| `/trades` | - Implement edge caching with short TTL <br> - Use SWR for client-side updates <br> - Optimize for largest contentful paint |
| `/auctions` | - Implement real-time updates with WebSockets <br> - Use optimistic UI updates <br> - Implement skeleton loading states |

**Implementation Tips:**
- Use `fetchCache` and `revalidate` options in fetch requests
- Implement React Server Components for data-heavy parts
- Use edge functions for geographically distributed rendering
- Implement HTTP/2 Server Push for critical resources
- Use `next/dynamic` with `ssr: false` for non-critical components

### ISR Routes (Incremental Static Regeneration)

| Route | Optimization Strategies |
|-------|------------------------|
| `/tech/:tree` | - Set optimal revalidation intervals (e.g., 1 hour) <br> - Implement on-demand revalidation for content updates <br> - Use shared layouts for faster navigation between trees |
| `/tech/` | - Implement data prefetching for linked tech trees <br> - Use SVG for tech tree visualization <br> - Optimize for interaction to next paint |
| `/wiki/` | - Implement content-based revalidation <br> - Use `next/link` prefetching <br> - Implement search indexing optimization |
| `/item/:name` | - Generate static paths for popular items <br> - Implement fallback pages for less common items <br> - Use structured data for SEO |

**Implementation Tips:**
- Use `generateStaticParams` for common dynamic routes
- Implement fallback strategies (`blocking` or `true`)
- Use metadata API for dynamic SEO optimization
- Implement partial revalidation where possible
- Use CDN caching with cache tags for targeted invalidation

### CSR Routes (Client-Side Rendering)

| Route | Optimization Strategies |
|-------|------------------------|
| `/profile` | - Implement lazy loading for profile sections <br> - Use React Query for data caching <br> - Optimize authentication token handling |
| `/crafter` | - Use web workers for complex calculations <br> - Implement virtualized lists for large item catalogs <br> - Use memoization for expensive calculations |
| `/members` | - Implement pagination with cursor-based navigation <br> - Use optimistic UI updates <br> - Implement proper error boundaries |
| `/maps` | - Lazy load map libraries <br> - Implement tile-based loading <br> - Use WebGL acceleration where available <br> - Implement proper memory management |
| `/map/:id` | - Implement progressive loading of map features <br> - Use IndexedDB for offline capability <br> - Optimize marker clustering |
| `/map` | - Implement autosave functionality <br> - Use compression for map data <br> - Optimize canvas rendering |
| `/diplomacy` | - Implement virtualized tables <br> - Use optimistic UI updates <br> - Implement proper loading states |
| `/walkerlist` | - Implement filtering on the client <br> - Use memoization for list rendering <br> - Implement proper image loading strategies |

**Implementation Tips:**
- Use `use client` directive only where necessary
- Implement code splitting with `next/dynamic`
- Use lightweight state management (Zustand/Jotai)
- Implement proper loading and error states
- Use React DevTools profiler to identify and fix performance bottlenecks
- Implement proper browser caching strategies

### Cross-Cutting Optimization Strategies

- **Bundle Optimization**:
  - Implement tree shaking and dead code elimination
  - Use dynamic imports for route-specific code
  - Monitor and optimize Third-Party JavaScript

- **Asset Optimization**:
  - Implement responsive images with srcset
  - Use modern image formats (WebP, AVIF)
  - Implement font optimization with font-display: swap

- **Performance Monitoring**:
  - Implement Real User Monitoring (RUM)
  - Set up Core Web Vitals tracking
  - Use Lighthouse CI in the deployment pipeline

- **Caching Strategy**:
  - Implement stale-while-revalidate pattern
  - Use HTTP caching headers appropriately
  - Implement service workers for offline capability

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
- [x] Configure environment variables
  - Create .env.local file with Next.js prefixed variables (NEXT_PUBLIC_*)
  - Migrate from Vite environment variables
  ```
  # .env.local example
  NEXT_PUBLIC_RESOURCES_URL=...
  NEXT_PUBLIC_DISCORD_CLIENT_ID=...
  NEXT_PUBLIC_PLAUSIBLE_URL=...
  ```
- [x] Configure i18next with Next.js
  - Install next-i18next for internationalization
  - Set up middleware for language detection and routing
- [x] Set up project structure
  ```
  /app
    /api
    /crafter
    /map
    /tech
    /item
    /wiki
    /not-found.tsx
    /layout.tsx
    /page.tsx
  /components
    /Crafter     # Crafter-specific components
    /ClanMaps    # Map-related components
    /TechTree    # Tech tree components
    /Wiki        # Wiki components
    /ui          # Reusable UI components
    /layouts     # Layout components
  /functions
    /services    # API and data fetching services
    /utils       # Utility functions
    /requests    # API request functions
  /public
    /locales     # i18n translation files
    /img         # Images and assets
    /json        # Static JSON data
  ```

### 2. Core Components Migration

- [x] Migrate shared components (Menu, Footer, etc.)
  - Converted to TypeScript
  - Adapted for Next.js Link component instead of react-router
  - Implemented components compatible with Server Components where appropriate
- [x] Create layout components for Next.js app router
  - Created root layout.tsx with metadata configuration
  - Implemented nested layouts (e.g., CrafterLayout.tsx)
  - Set up not-found.tsx for 404 handling
- [x] Set up authentication context/providers
  - Implemented Discord authentication integration
  - Created I18nProvider component for language context
  - Configured user session management
- [x] Implement i18n routing with middleware
  - Created middleware.ts for language detection and routing
  - Set up locale negotiation based on user preferences
  - Configured matcher pattern to exclude static files and API routes
  - Implemented redirect logic for paths without locale prefix

### 3. Authentication and API Integration

- [x] Set up API routes
  - Created API route handlers for backend functionality
  - Implemented middleware for API routes
  - Set up error handling for API routes
- [x] Implement authentication flow
  - Implemented Discord authentication integration
  - Created protected routes and middleware
  - Implemented user session management
- [x] Migrate data fetching
  - Converted fetch calls to use Next.js data fetching methods
  - Implemented data fetching strategies for different rendering methods
  - Set up initial caching strategies for API data

### 4. Page Migration

- [x] Migrate static pages first (Home, Privacy, etc.)
  - Implemented as Server Components with static generation
  - Set up metadata for SEO optimization using HeaderMeta component
  - Migrated Helmet metadata to Next.js metadata API
- [ ] Implement SSR pages (ClanList, Trades, etc.)
  - Use Server Components with dynamic data fetching
  - Implement loading states and error boundaries
  - Set up revalidation strategies for frequently changing data
- [ ] Implement ISR pages (Wiki, Item details, etc.)
  - Configure revalidation intervals based on data update frequency
  - Implement on-demand revalidation for content updates
  - Set up dynamic routes with generateStaticParams
- [x] Migrate interactive CSR pages (Maps, Crafter, etc.)
  - Implemented Client Components with "use client" directive
  - Created hybrid approach with Server Components where possible
  - Ensured client-side libraries work properly with Next.js

### 5. Advanced Features

- [x] Implement image optimization with next/image
  - Replaced standard img tags with next/image components
  - Configured image domains in next.config.js
  - Optimized banner and icon images
- [x] Set up dynamic metadata for SEO
  - Implemented generateMetadata functions for dynamic routes
  - Created reusable metadata patterns for similar pages
  - Migrated Helmet metadata to Next.js metadata API as seen in layout.tsx
- [x] Configure caching strategies
  - Implemented SWR for client-side data fetching
  - Set up React Cache for server components
  - Configured revalidation strategies for different data types
- [x] Implement error boundaries and loading states
  - Created error.tsx components for graceful error handling
  - Implemented loading.tsx components for improved UX
  - Added Suspense boundaries for streaming content

### 6. Testing and Optimization

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

### 7. Deployment

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

## Challenges and Considerations

1. **Authentication**: ✅ Migrated Discord authentication integration
2. **Interactive Maps**: ✅ Ensured Leaflet integration works with SSR
3. **Data Caching**: ✅ Implemented efficient caching strategies for API data
4. **Bundle Size**: 🔄 Monitoring and optimizing bundle size during migration
5. **SEO**: ✅ Ensured proper metadata for all pages

## Conclusion

Migrating to Next.js will provide significant benefits for the Stiletto Web application, including improved SEO, performance, and developer experience. By following this roadmap and implementing the appropriate rendering strategies for each route, the migration can be completed systematically while maintaining all existing functionality.