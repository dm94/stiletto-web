# Migration from Cypress to Playwright

## Migration Structure

The Cypress test suite has been migrated to Playwright maintaining the same functionality but adapting it to Playwright's syntax and paradigms.

## Migrated Files

- `tests/crafter.spec.ts`: Tests for the Crafter functionality
- `tests/clanlist.spec.ts`: Tests for the clan list
- `tests/utils/fixtures.ts`: Utilities for intercepting network requests and other common functions

## Configuration

The Playwright configuration is located in `playwright.config.ts` at the root of the project.

## Installation

To install Playwright, run:

```bash
npm install -D @playwright/test
npx playwright install
```

## Running Tests

To run all tests:

```bash
npx playwright test
```

To run a specific test:

```bash
npx playwright test tests/crafter.spec.ts
```

To run tests in UI mode:

```bash
npx playwright test --ui
```

## Differences from Cypress

1. **Syntax**: Playwright uses `async/await` for all asynchronous operations.
2. **Selectors**: Although the same `data-cy` selectors are maintained, the way to access them is different.
3. **Network Interception**: Instead of `cy.intercept()`, `page.route()` is used.
4. **Assertions**: Instead of `should()`, `expect().to...` is used.
5. **Waits**: Playwright has an automatic waiting system, but also offers explicit methods.

## Pending Migration

The following test files are still pending migration:

- `cypress/e2e/logged/profile.spec.js`
- `cypress/e2e/map.spec.js`
- `cypress/e2e/techtree.spec.js`
- `cypress/e2e/trades.spec.js`
- `cypress/e2e/wiki.spec.js`

## Recommendations

1. Migrate the remaining tests following the same pattern.
2. Update `package.json` to include scripts for running Playwright.
3. Consider removing Cypress once all tests have been migrated and are working correctly.