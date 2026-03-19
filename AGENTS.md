# AGENTS.md

## Project Overview

Stiletto Web is a Vite + React + TypeScript frontend for Last Oasis community tools (crafting, clan management, maps, trading, tech tree, wiki, perks calculator, etc.).

Key stack:

- React 19 + React Router
- TypeScript (strict)
- Vite 7
- Biome (format + lint)
- i18next (translation + item namespaces)
- Playwright (E2E)
- Leaflet / React-Leaflet (interactive maps)

Main app and routing:

- Entry: `src/index.tsx`
- App shell: `src/CrafterApp.tsx`
- Routes: `src/router.tsx`
- Pages: `src/pages/*`
- Reusable UI: `src/components/*`
- API request layer: `src/functions/requests/*`
- Shared types: `src/types/*`
- Global user context: `src/store/userStore.tsx`

Static game data and i18n:

- Game JSON data: `public/json/**`
- Locales: `public/locales/<lang>/{translation,items}.json`

## Environment and Setup

Requirements:

- Node.js `>=22.x`
- pnpm `10.26.2` (repository packageManager)

Install:

```bash
pnpm install
```

Create local env file from `.env.example` and set at least:

- `VITE_API_URL`
- `VITE_RESOURCES_URL`
- `VITE_DISCORD_CLIENT_ID`
- `VITE_PUBLIC_URL` (used by sitemap generation)
- `VITE_PUBLIC_POSTHOG_KEY` / `VITE_PUBLIC_POSTHOG_HOST` when analytics is needed

## Development Commands

- Start dev server: `pnpm dev`
- Alternative start command: `pnpm start`
- Build production bundle: `pnpm build`
- Preview production build: `pnpm preview`
- Generate sitemap manually: `pnpm generate:sitemap`
- Format source: `pnpm format`
- Lint source (auto-fixes enabled): `pnpm lint`
- Type check: `pnpm exec tsc -b`

Important command behavior:

- `pnpm build` runs `prebuild` first, which regenerates `public/sitemap.xml`.
- `pnpm lint` uses `--write`, so it modifies files.

## Testing

Primary tests are Playwright E2E tests:

- Run all E2E tests: `pnpm test`
- Equivalent command: `pnpm playwright`
- Playwright UI mode: `pnpm playwright:ui`

Test locations and config:

- Specs: `playwright/e2e/*.spec.ts`
- Config: `playwright.config.ts`
- Local test base URL: `http://localhost:5173`

Cross-browser projects are enabled (chromium, firefox, webkit).

## Build and Deployment

- Vite build output directory: `build/` (see `vite.config.ts`).
- SPA routing for hosting is configured in `vercel.json` (`/[^.]+ -> /`).
- Production domain references appear as `https://stiletto.deeme.dev`.

CI signals:

- GitHub workflow `.github/workflows/playwright.yml` installs dependencies with pnpm and runs Playwright on pushes/PRs to `master`.

## Architecture Notes for Agents

Request/API pattern:

- API base values are read from `src/config/config.ts`.
- Most HTTP helpers are grouped in `src/functions/requests/*`.
- Authenticated requests read token from storage via shared helpers in `src/functions/services.ts`.

Routing + language:

- The app runs inside `BrowserRouter`, then wraps with `LanguageRouter`.
- Language detection and translation loading are configured in `src/i18n.ts`.
- Paths can include localized prefixes.

State:

- User/session state is managed through React context in `src/store/userStore.tsx`.

SEO/Sitemap:

- `generate-sitemap.mjs` builds `public/sitemap.xml` from static routes plus `public/json/items_min.json` and `public/json/creatures_min.json`.

## Code Style and Conventions

Follow existing codebase conventions:

- TypeScript-first, strict typing.
- Functional components and hooks.
- Path aliases from `tsconfig.app.json` / `vite.config.ts` (`@components`, `@pages`, `@functions`, etc.).
- Biome governs formatting/linting (`biome.json`).
- Prefer clear names and small focused modules.

When editing:

- Keep imports organized and consistent with existing alias usage.
- Reuse existing request utilities and DTO types instead of duplicating shapes.
- Update relevant locale files when changing user-facing copy.
- For route/page changes, confirm lazy routing behavior in `src/router.tsx`.

## Safe Change Checklist

Before finishing a change, run:

```bash
pnpm lint
pnpm exec tsc -b
pnpm test
pnpm build
```

If a change impacts i18n, also verify locale JSON keys and loading paths.

If a change impacts maps/wiki/crafter data, verify corresponding `public/json/**` consumers still render correctly.

## Pull Request Guidance

- Keep scope focused.
- Ensure lint, type-check, tests, and build pass locally.
- Mention any env var additions/changes.
- Mention generated asset changes explicitly (for example `public/sitemap.xml` after build).
