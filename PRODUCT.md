# Product

Stiletto Web is an unofficial community toolbox for the survival MMO **Last Oasis**. It is not affiliated with Donkey Crew. Production site: https://stiletto.deeme.dev

## Users

All Last Oasis players, with no single privileged group:

- **Solo players and traders** checking recipes, prices, trade offers and auction timers.
- **Clan members and leaders** managing rosters, walker lists, shared maps, and diplomacy (allies, enemies, NAP).
- **Players looking things up** in the item, creature and tech-tree reference.

The audience is international and largely non-English. The site ships 11 languages through Crowdin, so English is the source language, not the expected one.

## Purpose

Give players the reference and planning work the game itself does not provide, fast enough to use mid-session:

- Calculate what a build costs, at any quantity, and share the result.
- Look up an item, creature, tech node or perk cost.
- Find resources and markers on an interactive map and share that map with a clan.
- Watch trade offers and auction timers.
- Run clan administration: members, walkers, diplomacy.

## Platform

`web` — responsive web app, installable as a PWA. No native clients.

## Constraints

- **Readability of dense game data comes first.** Recipes, stats and long item tables must stay legible and scannable at small sizes. Density is a feature here, not a defect.
- **Quick lookups, often on a second screen or phone during play.** Primary actions must be reachable without reading the page; slow first paints and buried controls cost real play time.
- **Text length varies by language.** German, Russian and Portuguese labels are often noticeably longer than English. Layouts must survive that without clipping or breaking.
- **Maps are the heavy surface.** Leaflet map views load tiles and many markers; keep the surrounding chrome cheap.
- **Clan features require a connected Discord account.** Public tools (crafter, wiki, tech tree, public map) must stay usable signed out.
- **The dark theme is product identity, not a preference toggle.** There is no light mode.

## Terminology

Use the game's vocabulary, not generic web-app wording:

- **Crafter / crafting calculator** — the recipe cost calculator, not "builder" or "estimator".
- **Walker** — clan-owned mobile base; a "walker list" is inventory, not navigation.
- **Diplomacy** — relations toward other clans: ally, enemy, NAP (non-aggression pact).
- **Tech tree**, **perk**, **quality**, **rarity** — keep the in-game names and casing.
- **Clan** — the unit of membership and sharing; never "team", "group" or "organization".

## Evidence on hand

- Live implementation: `src/pages/*`, `src/components/*`, `src/styles/style.css` (the real source of color and type decisions).
- Generated token record: `design.md` at the repository root (produced from the running site, not hand-authored).
- Game data: `public/json/**` (`items_min.json`, `creatures_min.json`, `maps.min.json`, `colors.min.json`, `markers.min.json`), refreshed daily from `Stiletto-lo/loDataExtractor`.
- Copy in 11 languages: `public/locales/<lang>/{translation,items}.json` plus `wiki/**`.
- Brand imagery: `design/crafter.jpg`, Okami display font in `src/fonts/okami.otf`.
- No user research, testimonials or analytics-backed personas are recorded here. Decisions about audience come from the feature set, not from interviews.

## Brand commitments

Confirmed to keep in future design work:

- Dark, warm canvas `#2e2a26` with sand text `#e0c9a6`; headings in sand `#c2a57c`.
- Tribal orange `#d95f32` for links and hover; nature green `#22c55e` for the positive/brand accent.
- `Okami` for display headings, `ui-sans-serif` for running text; heading weight 500.
- 8px spacing base, modest 6–8px radii, tinted rather than pure-black shadows.

Visual detail lives in the design system record, not here. `init` does not choose palettes or fonts; the values above are existing commitments, not new proposals.

## Open decisions

- Whether `design.md` should be renamed to `DESIGN.md` so the recorded system is found on case-sensitive filesystems and CI, not only on Windows.
- Whether mobile layouts should keep full table density (horizontal scroll) or collapse columns per viewport; not settled.
- The generated `design.md` records several near-duplicate button styles and a white `#ffffff` surface that conflicts with the "no bright white surfaces" note. Which of those are intentional has not been confirmed.
