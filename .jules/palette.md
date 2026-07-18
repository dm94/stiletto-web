# Palette's Journal

## 2025-07-20 - [Accessible Language & Dialog Focus Management]
**Learning:** Dialogs and modals in multi-language applications require immediate focus management upon activation to ensure keyboard navigation starts from within the interactive dialog context rather than trailing at the document body level. In addition, proper ARIA labeling of modal structures ensures that assistive technologies can immediately describe the dialog context to the user.
**Action:** Always provide dialog elements with proper roles (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) and use React hooks to focus interactive elements (such as the primary CTA or the first interactive element) immediately on mount. Always attach a window listener for the `Escape` key to allow fast dismissals.
