# AGENTS.md

## Project Overview

Stiletto Web is a Vite + React + TypeScript frontend for Last Oasis community tools, including crafting, clan management, interactive maps, trading, tech tree navigation, wiki pages, and perk calculation.

Use the repository configuration as the source of truth when documentation conflicts. In particular, `README.md` still contains older stack notes, while `package.json`, `vite.config.ts`, `playwright.config.ts`, and `biome.json` reflect the current setup.

Current stack:

- React 19
- React Router 7
- TypeScript with strict compiler settings
- Vite 8
- Tailwind CSS 4 with custom CSS layers in `src/styles/style.css`
- Biome for formatting and linting
- i18next with HTTP backend and browser language detection
- Playwright for end-to-end coverage
- Leaflet / React-Leaflet for maps
- `vite-plugin-pwa` for PWA support

## Repository Map

- App entry: `src/index.tsx`
- App shell: `src/CrafterApp.tsx`
- Language-aware wrapper: `src/components/LanguageRouter.tsx`
- Route table: `src/router.tsx`
- Reusable UI: `src/components/*`
- Page-level screens: `src/pages/*`
- Shared hooks: `src/hooks/*`
- Request helpers: `src/functions/requests/*`
- Shared services and utilities: `src/functions/*`
- Shared types and DTOs: `src/types/*`
- User/session context: `src/store/userStore.tsx`
- Runtime config: `src/config/*`
- Static game data: `public/json/**`
- Locales: `public/locales/<lang>/{translation,items}.json`
- Optional wiki markdown content: `wiki/**`
- E2E tests: `playwright/e2e/*.spec.ts`

## Environment Setup

Requirements:

- Node.js `>=22.x`
- pnpm `10.26.2`

Install dependencies:

```bash
pnpm install
```

Create a local env file from `.env.example`.

Core environment variables:

- `VITE_API_URL`
- `VITE_RESOURCES_URL`
- `VITE_DISCORD_CLIENT_ID`
- `VITE_PUBLIC_URL`

Optional analytics and metadata variables:

- `VITE_PLAUSIBLE_URL`
- `VITE_PUBLIC_POSTHOG_KEY`
- `VITE_PUBLIC_POSTHOG_HOST`
- `VITE_VERSION`

## Development Commands

- Start dev server: `pnpm dev`
- Alternative dev command: `pnpm start`
- Build production bundle: `pnpm build`
- Preview the production bundle: `pnpm preview`
- Generate sitemap files manually: `pnpm generate:sitemap`
- Format `src`: `pnpm format`
- Lint `src` with autofixes: `pnpm lint`
- Type-check the app: `pnpm exec tsc -b`

Important command behavior:

- `pnpm build` triggers `prebuild`, which regenerates sitemap files under `public/`.
- `pnpm lint` uses `--write`, so it modifies files on disk.
- `pnpm format` also writes changes to disk.
- Playwright uses `playwright.config.ts` and starts the dev server through `npm run dev`; keep the `dev` script working when changing tooling.

## Testing Instructions

Primary automated coverage is Playwright E2E:

- Run all E2E tests: `pnpm test`
- Equivalent command: `pnpm playwright`
- Open Playwright UI: `pnpm playwright:ui`

Testing notes:

- Test root: `playwright/e2e`
- Config: `playwright.config.ts`
- Local base URL: `http://localhost:5173`
- Browser projects: chromium, firefox, webkit
- CI retries failed Playwright tests and uploads the HTML report artifact

For focused work, run a single spec with Playwright directly, for example:

```bash
pnpm exec playwright test playwright/e2e/wiki.spec.ts
```

## Architecture Notes

Application shell and routing:

- `src/index.tsx` renders `BrowserRouter`, then `LanguageRouter`, then `CrafterApp`.
- `LanguageRouter` allows both localized and non-localized paths.
- `src/router.tsx` lazily loads nearly all route components with `React.lazy`.

Language and translations:

- `src/i18n.ts` loads `translation` and `items` namespaces from `/locales/{{lng}}/{{ns}}.json`.
- Supported languages are defined in `src/config/languages.ts`.
- If you add or rename user-facing text, update the appropriate locale JSON files.
- If you add routes that should exist under localized prefixes, verify both routing and sitemap output.

State and auth:

- User state lives in `src/store/userStore.tsx`.
- Tokens and related values are stored through helpers in `src/functions/services.ts`.
- Authenticated requests generally live in `src/functions/requests/*`.

Styling:

- Tailwind CSS 4 is enabled by `@import "tailwindcss";` in `src/styles/style.css`.
- The project also relies on custom CSS variables, `@layer` definitions, and some utility classes in that stylesheet.
- `tailwind.config.js` is minimal; do not assume older Tailwind configuration patterns are in active use.

SEO and sitemap:

- `generate-sitemap.mjs` generates `public/sitemap.xml`, `public/sitemap-static.xml`, `public/sitemap-items.xml`, and `public/sitemap-creatures.xml`.
- Sitemap content depends on static routes plus `public/json/items_min.json` and `public/json/creatures_min.json`.
- If you add, rename, or remove public routes, update `STATIC_ROUTES` in `generate-sitemap.mjs`.

Analytics and consent:

- Plausible script injection is handled in `src/functions/page-tracking.ts`.
- PostHog is initialized in `src/components/PostHogProvider.tsx`.
- Cookie consent gates analytics behavior via `src/components/VanillaCookieConsent.tsx`.

## Data and Content Workflows

Game data:

- Item and creature detail pages depend on JSON data under `public/json/`.
- Daily GitHub Actions in `.github/workflows/update-game-data-daily.yml` sync `items` and `creatures` data from `Stiletto-lo/loDataExtractor`.
- Be careful when editing generated game-data files manually, because automation may overwrite them later.

Routing-sensitive content:

- Wiki, item, creature, map, and tech pages are route-driven and commonly depend on both route params and static JSON content.
- Changes in route names should be reflected in tests, sitemap generation, and any deep links.

## Code Style and Conventions

Follow the current repository conventions:

- Prefer TypeScript-first changes with strict types.
- Use functional components and hooks.
- Keep modules focused and avoid duplicating DTOs or request shapes.
- Reuse path aliases from `tsconfig.app.json` and `vite.config.ts`.
- Let Biome manage formatting and import organization.
- Keep comments rare, concise, and in English.

When editing UI or behavior:

- Preserve lazy loading patterns in `src/router.tsx` unless there is a clear reason to change them.
- Update locale files for any new copy.
- Verify that analytics, auth, and route changes still behave correctly under language-prefixed URLs.
- Prefer existing request utilities over introducing ad hoc fetch logic.

## Build and Deployment

- Production output directory: `build/`
- SPA fallback routing for hosting: `vercel.json`
- Production site: `https://stiletto.deeme.dev`
- Vite PWA manifest is configured in `vite.config.ts`

Relevant CI workflows:

- `.github/workflows/playwright.yml` runs Playwright on pushes and pull requests to `main` and `master`
- `.github/workflows/update-game-data-daily.yml` opens automated PRs when upstream game data changes

## Safe Change Checklist

Run the full verification flow before finishing substantial code changes:

```bash
pnpm lint
pnpm exec tsc -b
pnpm test
pnpm build
```

Additional verification by change type:

- i18n change: verify locale keys and language-prefixed routes
- route change: verify `src/router.tsx`, `generate-sitemap.mjs`, and any affected Playwright specs
- data change: verify the relevant `public/json/**` consumers still render correctly
- analytics or consent change: verify both consent accepted and rejected flows

## Pull Request Guidance

- Keep the scope focused.
- Mention env var additions or changes explicitly.
- Mention generated file changes explicitly, especially sitemap files under `public/`.
- Ensure lint, type-check, tests, and build pass before merging.
