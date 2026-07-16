# Palette's Journal - Critical UX & Accessibility Learnings

This journal documents critical UX and accessibility insights discovered during design and development.

## 2025-07-16 - Custom Select Box Keyboard Accessibility and Focus Restoration
**Learning:** Custom dropdown/select boxes often suffer from poor accessibility because focus remains trapped on the trigger button or is lost when selecting/dismissing options. Auto-focusing the search text input upon opening, allowing arrow key navigation to jump directly to options, and restoring focus to the trigger button upon select or Escape press creates an incredibly fluid and keyboard-friendly user experience that perfectly aligns with WAI-ARIA practices.
**Action:** Always implement robust focus trap/restoration and arrow-key/Escape key listener bindings when designing custom components that emulate native select/dropdown menus.
