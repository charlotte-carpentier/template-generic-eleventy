/* ┌─────────────────────────────────────────────────────────┐
   │ TESTS › Active Link Utility                             │
   │ Unit tests for URL normalization function               │
   │ Path: src/assets/scripts/utils/                         │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tests for active link utility URL normalization
 * Validates URL parsing, trailing slash handling, and edge cases
 * @module utils/active-link.test
 */

import { describe, test, expect } from 'vitest';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper Function to Test
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Normalize URL for comparison (handles trailing slashes)
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL without trailing slash
 */
const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname === '/'
      ? '/'
      : urlObj.pathname.replace(/\/$/, '');
    return `${urlObj.origin}${pathname}`;
  } catch {
    return url;
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Test Suite
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('active-link utility', () => {

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Basic Normalization
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('basic normalization', () => {
    test('should remove trailing slash from pathname', () => {
      expect(normalizeUrl('https://example.com/about/')).toBe('https://example.com/about');
    });

    test('should preserve URL without trailing slash', () => {
      expect(normalizeUrl('https://example.com/about')).toBe('https://example.com/about');
    });

    test('should preserve root path with single slash', () => {
      expect(normalizeUrl('https://example.com/')).toBe('https://example.com/');
    });

    test('should normalize deeply nested paths', () => {
      expect(normalizeUrl('https://example.com/blog/2025/article/')).toBe('https://example.com/blog/2025/article');
    });

    test('should handle multiple trailing slashes', () => {
      expect(normalizeUrl('https://example.com/about///')).toBe('https://example.com/about//');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Protocol and Domain
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('protocol and domain', () => {
    test('should preserve HTTPS protocol', () => {
      expect(normalizeUrl('https://example.com/page/')).toBe('https://example.com/page');
    });

    test('should preserve HTTP protocol', () => {
      expect(normalizeUrl('http://example.com/page/')).toBe('http://example.com/page');
    });

    test('should preserve subdomain', () => {
      expect(normalizeUrl('https://blog.example.com/post/')).toBe('https://blog.example.com/post');
    });

    test('should preserve port number', () => {
      expect(normalizeUrl('http://localhost:3000/admin/')).toBe('http://localhost:3000/admin');
    });

    test('should handle different domains', () => {
      expect(normalizeUrl('https://different-domain.org/path/')).toBe('https://different-domain.org/path');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Hash Fragments
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('hash fragments', () => {
    test('should ignore hash fragments', () => {
      expect(normalizeUrl('https://example.com/page/#section')).toBe('https://example.com/page');
    });

    test('should ignore hash with trailing slash', () => {
      expect(normalizeUrl('https://example.com/page/#section/')).toBe('https://example.com/page');
    });

    test('should handle empty hash', () => {
      expect(normalizeUrl('https://example.com/page/#')).toBe('https://example.com/page');
    });

    test('should handle complex hash with special characters', () => {
      expect(normalizeUrl('https://example.com/page/#section-123-title')).toBe('https://example.com/page');
    });

    test('should handle hash on root path', () => {
      expect(normalizeUrl('https://example.com/#top')).toBe('https://example.com/');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Query Parameters
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('query parameters', () => {
    test('should ignore query parameters', () => {
      expect(normalizeUrl('https://example.com/search?q=test')).toBe('https://example.com/search');
    });

    test('should ignore multiple query parameters', () => {
      expect(normalizeUrl('https://example.com/page?foo=bar&baz=qux')).toBe('https://example.com/page');
    });

    test('should ignore query parameters with trailing slash', () => {
      expect(normalizeUrl('https://example.com/page/?id=123')).toBe('https://example.com/page');
    });

    test('should handle query parameters on root path', () => {
      expect(normalizeUrl('https://example.com/?ref=newsletter')).toBe('https://example.com/');
    });

    test('should handle empty query parameters', () => {
      expect(normalizeUrl('https://example.com/page?')).toBe('https://example.com/page');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Combined Query and Hash
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('combined query and hash', () => {
    test('should ignore both query parameters and hash', () => {
      expect(normalizeUrl('https://example.com/page?id=1#section')).toBe('https://example.com/page');
    });

    test('should handle query and hash with trailing slash', () => {
      expect(normalizeUrl('https://example.com/page/?id=1#section')).toBe('https://example.com/page');
    });

    test('should handle complex query and hash combination', () => {
      expect(normalizeUrl('https://example.com/article/?sort=date&order=desc#comments')).toBe('https://example.com/article');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Invalid URLs
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('invalid URLs', () => {
    test('should return original string when URL is invalid', () => {
      expect(normalizeUrl('not-a-valid-url')).toBe('not-a-valid-url');
    });

    test('should return original string when missing protocol', () => {
      expect(normalizeUrl('example.com/page')).toBe('example.com/page');
    });

    test('should return original string when malformed', () => {
      expect(normalizeUrl('ht!tp://bad-url')).toBe('ht!tp://bad-url');
    });

    test('should return empty string as-is', () => {
      expect(normalizeUrl('')).toBe('');
    });

    test('should handle undefined gracefully', () => {
      expect(normalizeUrl(undefined)).toBe(undefined);
    });

    test('should handle null gracefully', () => {
      expect(normalizeUrl(null)).toBe(null);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Special Characters
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('special characters in pathname', () => {
    test('should preserve encoded characters', () => {
      expect(normalizeUrl('https://example.com/path%20with%20spaces/')).toBe('https://example.com/path%20with%20spaces');
    });

    test('should preserve dashes and underscores', () => {
      expect(normalizeUrl('https://example.com/my-page_name/')).toBe('https://example.com/my-page_name');
    });

    test('should preserve numbers in path', () => {
      expect(normalizeUrl('https://example.com/article-123/')).toBe('https://example.com/article-123');
    });

    test('should handle UTF-8 characters (URL-encoded)', () => {
      expect(normalizeUrl('https://example.com/café/')).toBe('https://example.com/caf%C3%A9');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Real-World URLs
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('real-world URLs', () => {
    test('should normalize typical blog post URL', () => {
      expect(normalizeUrl('https://blog.example.com/2025/01/my-article/')).toBe('https://blog.example.com/2025/01/my-article');
    });

    test('should normalize product page with ID', () => {
      expect(normalizeUrl('https://shop.example.com/products/item-123/')).toBe('https://shop.example.com/products/item-123');
    });

    test('should normalize documentation URL', () => {
      expect(normalizeUrl('https://docs.example.com/api/reference/')).toBe('https://docs.example.com/api/reference');
    });

    test('should normalize localhost development URL', () => {
      expect(normalizeUrl('http://localhost:8080/admin/users/')).toBe('http://localhost:8080/admin/users');
    });

    test('should normalize GitHub-style URL', () => {
      expect(normalizeUrl('https://github.com/user/repo/issues/')).toBe('https://github.com/user/repo/issues');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Edge Cases
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('edge cases', () => {
    test('should return protocol-relative URL unchanged (invalid URL)', () => {
      expect(normalizeUrl('//example.com/page/')).toBe('//example.com/page/');
    });

    test('should handle single character path', () => {
      expect(normalizeUrl('https://example.com/a/')).toBe('https://example.com/a');
    });

    test('should handle very long pathname', () => {
      const longPath = 'a/'.repeat(50);
      expect(normalizeUrl(`https://example.com/${longPath}`)).toBe(`https://example.com/${longPath.slice(0, -1)}`);
    });

    test('should strip authentication credentials (browser security)', () => {
      expect(normalizeUrl('https://user:pass@example.com/secure/')).toBe('https://example.com/secure');
    });

    test('should handle IP address as domain', () => {
      expect(normalizeUrl('http://192.168.1.1/admin/')).toBe('http://192.168.1.1/admin');
    });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
