/* ┌─────────────────────────────────────────────────────────┐
   │ CORE › Google Analytics Initialization                  │
   │ GA4 tracking with consent integration                   │
   │ Path: src/assets/scripts/core/                          │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Google Analytics 4 initialization with consent mode
 * Reads GA4 measurement ID from script data attributes
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4|Google Analytics 4}
 * @see {@link https://developers.google.com/tag-platform/security/guides/consent|Consent Mode v2}
 */

(function initAnalytics() {
  'use strict';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Configuration
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  const COOKIE_FLAGS = 'SameSite=None;Secure';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Initialization
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  const script = document.currentScript;

  if (!script) {
    console.error('[Analytics] Cannot access script element');
    return;
  }

  const measurementId = script.dataset.measurementId;

  if (!measurementId) {
    console.error('[Analytics] Missing required data-measurement-id attribute');
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  // Configure GA4
  gtag('js', new Date());
  gtag('config', measurementId, {
    anonymize_ip: true,
    cookie_flags: COOKIE_FLAGS
  });
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
