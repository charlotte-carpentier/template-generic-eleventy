/* ┌─────────────────────────────────────────────────────────┐
   │ CORE › Netlify Identity Initialization                  │
   │ Auto-redirect to admin after authentication             │
   │ Path: src/assets/scripts/core/                          │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Netlify Identity authentication handler
 * Redirects users to /admin/ after successful login
 * @see {@link https://docs.netlify.com/visitor-access/identity/|Netlify Identity}
 */

(function initNetlifyIdentity() {
  'use strict';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Configuration
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  const ADMIN_PATH = '/admin/';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Initialization
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (!window.netlifyIdentity) {
    console.warn('[Netlify Identity] SDK not loaded');
    return;
  }

  window.netlifyIdentity.on('init', (user) => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = ADMIN_PATH;
      });
    }
  });
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
