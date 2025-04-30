# Migration Plan: Vite to Next.js for Stiletto Web

## 1. Project Analysis
- Current stack: Vite + React + TypeScript
- Routing: `react-router` in `src/router.tsx` and `src/pages/`
- Components: `src/components/`
- Static assets: `public/`, `build/`, `design/`, `img/`, `json/`
- i18n: `react-i18next` with translations in `public/locales/`
- Styling: Tailwind CSS, PostCSS
- E2E tests: Cypress in `cypress/`

## 2. Migration Steps

### 2.1. Initialize Next.js Project
- Create a new Next.js app with TypeScript: `npx create-next-app@latest --typescript`
- Install and configure Tailwind CSS and PostCSS
- Copy custom Tailwind/PostCSS config from the Vite project

### 2.2. Migrate Pages and Routing
- Move each file from `src/pages/` to `/pages` or `/app` in Next.js
- Convert `react-router` routes to Next.js file-based routing
- For dynamic routes, use `[param].tsx` files
- Replace `useNavigate`, `useLocation`, `useParams` with Next.js `useRouter`
- Remove `src/router.tsx` and migrate its logic to Next.js routing

### 2.3. Migrate Components
- Copy all files from `src/components/` to the new project
- Update import paths and aliases in `tsconfig.json` or `jsconfig.json`
- Replace `react-helmet` with `next/head` for meta tags and SEO

### 2.4. Migrate Static Assets
- Move all static files (images, JSON, etc.) to the Next.js `public/` directory
- Update asset references to use `/public` root

### 2.5. Internationalization (i18n)
- Install and configure `next-i18next` or Next.js built-in i18n
- Move translation files from `public/locales/` to the new structure
- Update translation hooks and usage in components/pages

### 2.6. Environment Variables
- Rename Vite env variables (`VITE_...`) to Next.js format (`NEXT_PUBLIC_...`)
- Update all code to use `process.env.NEXT_PUBLIC_...`

### 2.7. E2E and Testing
- Update Cypress config to point to the Next.js dev server
- Update test selectors and routes as needed

### 2.8. Data Fetching and SSR/SSG
- Identify which pages require SSR, SSG, or client-side rendering
- Use `getServerSideProps`, `getStaticProps`, or React Server Components as appropriate
- Refactor data fetching logic to Next.js conventions

### 2.9. Miscellaneous
- Review and update all usage of router-dependent hooks and effects
- Ensure all meta tags, SEO, and analytics are migrated to Next.js best practices
- Remove Vite-specific files and configs

## 3. Migration Checklist
- [ ] Create Next.js project and configure Tailwind/PostCSS
- [ ] Migrate pages and routing
- [ ] Migrate components and update imports
- [ ] Migrate static assets
- [ ] Configure and migrate i18n
- [ ] Update environment variables
- [ ] Update Cypress and E2E tests
- [ ] Refactor data fetching for SSR/SSG
- [ ] Manual and automated QA

---

This plan is designed for an AI to follow step by step, ensuring a complete and robust migration from Vite to Next.js for the Stiletto Web project.
