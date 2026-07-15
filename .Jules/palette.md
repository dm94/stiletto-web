# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-02-18 - Keyboard Search Shortcuts in Navigation Header
**Learning:** Adding a universal keyboard shortcut makes navigation extremely rapid and user-friendly, especially in complex tool websites. While `⌘K` / `Ctrl+K` is common in document editors, browser defaults and system accessibility mappings use `Ctrl+K` for the browser's own search bar. Therefore, using `/` (forward slash) is much more compatible, standard for web applications, and less intrusive, as long as input/textarea fields are properly ignored when typing.
**Action:** Implement visual hint badges (`/`) alongside search inputs that fade out or hide when the input gets focused or has content. Always ignore shortcuts when active element is an input, textarea or contenteditable element.
