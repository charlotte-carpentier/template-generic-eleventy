/* ┌─────────────────────────────────────────────────────────┐
   │ CORE › Axeptio Initialization                           │
   │ Cookie consent SDK loader with Google Consent Mode      │
   │ Path: src/assets/scripts/core/                          │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Axeptio Cookie Consent SDK initialization
 * Reads configuration from script data attributes and loads SDK asynchronously
 * @see {@link https://developers.axeptio.eu/|Axeptio Developers}
 * @see {@link https://developers.google.com/tag-platform/security/guides/consent|Google Consent Mode v2}
 */

(function initAxeptio() {
  'use strict';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Configuration
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  const SDK_URL = '//static.axept.io/sdk.js';
  const DEFAULT_COOKIES_VERSION = 'base';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Initialization
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  const script = document.currentScript;

  if (!script) {
    console.error('[Axeptio] Cannot access script element');
    return;
  }

  const clientId = script.dataset.clientId;
  const cookiesVersion = script.dataset.cookiesVersion || DEFAULT_COOKIES_VERSION;

  if (!clientId) {
    console.error('[Axeptio] Missing required data-client-id attribute');
    return;
  }

  // Configure Axeptio settings
  window.axeptioSettings = {
    clientId: clientId,
    cookiesVersion: cookiesVersion,
    googleConsentMode: {
      default: {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500
      }
    }
  };

  // Load SDK asynchronously
  const loadSDK = () => {
    const sdkScript = document.createElement('script');
    sdkScript.async = true;
    sdkScript.src = SDK_URL;
    script.parentNode.insertBefore(sdkScript, script);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSDK);
  } else {
    loadSDK();
  }
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
