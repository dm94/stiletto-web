# Design System

## 1. Visual Theme & Atmosphere

High-contrast dark mode with vivid accents — feels modern, technical, and focused.

**Key Characteristics:**
- Okami as the heading font
- ui-sans-serif as the body font for all running text
- Heading weight 500
- Dark background (#2e2a26) as the primary canvas
- Primary accent `#22c55e` used for CTAs and brand highlights
- 2 shadow level(s) detected — tinted shadows
- Moderate border-radius (8px) — balanced and professional
- Tags: dark, soft, accented, serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#22c55e`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#d95f32`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#2e2a26`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#ffffff`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#e0c9a6`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#999999`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#1b1b1b`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#1b1b1b` | `--palette-1` | block | large | text-light |
| 2 | `#ffffff` | `--palette-2` | button | large | text-dark |
| 3 | `#22c55e` | `--palette-3` | button | medium | text-dark |
| 4 | `#d95f32` | `--palette-4` | text-accent | medium | text-light |
| 5 | `#eaeff2` | `--palette-5` | button | medium | text-dark |
| 6 | `#ef4444` | `--palette-6` | button | medium | text-light |
| 7 | `#30363c` | `--palette-7` | button | medium | text-light |
| 8 | `#4a3b31` | `--palette-8` | text-accent | small | text-light |
| 9 | `#e0c9a6` | `--palette-9` | text-accent | small | text-dark |
| 10 | `#c2a57c` | `--palette-10` | text-accent | small | text-dark |

## 3. Typography Rules

- **Heading Font:** `Okami`, sans-serif
- **Body Font:** `ui-sans-serif`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | Okami | 36px | 500 | 40px | normal |
| H2 | Okami | 30px | 500 | 36px | normal |
| H3 | ui-sans-serif | 20px | 600 | 28px | normal |
| Body | ui-sans-serif | 16px | 400 | 24px | normal |
| Small | ui-sans-serif | 14px | 500 | 20px | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `36px` | headings |
| H1 | `30px` | headings |
| H2 | `24px` | headings |
| H3 | `20px` | headings |
| H4 | `16.8px` | headings |
| Body L | `16px` | body / supporting text |
| Body | `14.4px` | body / supporting text |
| Small | `14px` | body / supporting text |
| XS | `13.12px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: #ffffff;
  color: #4a3b31;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 400;
  border: 0.666667px solid rgb(74, 59, 49);
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #4a3b31;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 8px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Outline Button

```css
.btn-outline {
  background: transparent;
  color: #ffffff;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 0.666667px solid rgb(74, 59, 49);
  cursor: pointer;
}
```

### Filled Button 2

```css
.btn-filled-2 {
  background: #d95f32;
  color: #ffffff;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button 3

```css
.btn-filled-3 {
  background: #22c55e;
  color: #ffffff;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button 4

```css
.btn-filled-4 {
  background: #ef4444;
  color: #ffffff;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

## 5. Layout Principles

- **Base spacing unit:** `8px` — use multiples (16px, 24px, 32px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `8px` | element |
| spacing-2 | `16px` | element |
| spacing-3 | `6.56px` | element |
| spacing-4 | `12px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-button | `8px` | button |
| radius-button | `6px` | button |
| radius-button | `6.4px` | button |
| radius-subtle | `4px` | subtle |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |
| Deep | `rgba(0, 0, 2, 0.3) 0px 10px 30px 0px` | Hero sections, deep layers |

> **Note:** This site uses chromatic (color-tinted) shadows rather than pure black — this is a deliberate brand choice that adds warmth to elevation.

## 7. Do's and Don'ts

### Do
- Use `#2e2a26` as the primary background color
- Use `Okami` for all headings and `ui-sans-serif` for body text
- Use `#22c55e` as the single dominant accent/CTA color
- Maintain `8px` as the base spacing unit — all gaps should be multiples
- Keep the overall feel dark — use dark surfaces throughout
- Use serif fonts for headlines to maintain editorial authority
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 500 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute Okami/ui-sans-serif with generic alternatives
- Don't use irregular spacing — stick to 8px grid
- Don't introduce bright white surfaces — they break the dark palette
- Don't mix in geometric sans-serif headlines — it breaks the editorial tone
- Don't use pure black (#000000) for text — use `#e0c9a6` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 8px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #2e2a26
Text:        #e0c9a6
Accent:      #22c55e
Secondary:   #d95f32
Border:      #1b1b1b
```

### Example Prompts

1. "Build a hero section with a `#2e2a26` background, `Okami` heading in `#e0c9a6`, and a `#22c55e` CTA button with 8px radius."
2. "Create a pricing card using background `#ffffff`, border `#1b1b1b`, `ui-sans-serif` for text, and 24px padding."
3. "Design a navigation bar — `#2e2a26` background, `#e0c9a6` links, `#22c55e` for active state."
4. "Build a feature grid with 3 columns, 24px gap, each card using the card component style."
5. "Create a footer with `#ffffff` background, `#e0c9a6` text, and 16px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 53 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--cc-bg` | `#fff` |
| `--cc-primary-color` | `#2c2f31` |
| `--cc-secondary-color` | `#5e6266` |
| `--cc-btn-primary-bg` | `#30363c` |
| `--cc-btn-primary-color` | `#fff` |
| `--cc-btn-primary-hover-bg` | `#000` |
| `--cc-btn-primary-hover-color` | `#fff` |
| `--cc-btn-secondary-bg` | `#eaeff2` |
| `--cc-btn-secondary-hover-bg` | `#d4dae0` |
| `--cc-btn-secondary-hover-color` | `#000` |
| `--cc-btn-secondary-hover-border-color` | `#d4dae0` |
| `--cc-separator-border-color` | `#f0f4f7` |
| `--cc-toggle-off-bg` | `#667481` |
| `--cc-toggle-on-knob-bg` | `#fff` |
| `--cc-toggle-readonly-bg` | `#d5dee2` |
| `--cc-toggle-readonly-knob-bg` | `#fff` |
| `--cc-cookie-category-block-bg` | `#f0f4f7` |
| `--cc-cookie-category-block-border` | `#f0f4f7` |
| `--cc-cookie-category-block-hover-bg` | `#e9eff4` |
| `--cc-cookie-category-block-hover-border` | `#e9eff4` |
| `--cc-cookie-category-expanded-block-hover-bg` | `#dee4e9` |
| `--cc-overlay-bg` | `#000000a6` |
| `--cc-footer-border-color` | `#e4eaed` |
| `--dark` | `#2e2a26` |
| `--sand` | `#c2a57c` |
| `--sand-light` | `#e0c9a6` |
| `--sand-dark` | `#4a3b31` |
| `--tribal` | `#d95f32` |
| `--nature` | `#5a7742` |
| `--charcoal` | `#1b1b1b` |

### Spacing Variables

| Variable | Value |
|---|---|
| `--cc-modal-border-radius` | `.5rem` |
| `--cc-btn-border-radius` | `.4rem` |
| `--cc-modal-margin` | `1rem` |
| `--cc-z-index` | `2147480000` |
| `--cc-pm-toggle-border-radius` | `4em` |

### Typography Variables

| Variable | Value |
|---|---|
| `--cc-font-family` | `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"` |
