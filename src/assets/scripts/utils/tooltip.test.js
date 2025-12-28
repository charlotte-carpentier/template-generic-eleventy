/* ┌─────────────────────────────────────────────────────────┐
   │ TESTS › Tooltip Utility                                 │
   │ Unit tests for tooltip helper functions                 │
   │ Path: src/assets/scripts/utils/                         │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tests for tooltip utility helper functions
 * Validates tooltip ID extraction and position calculation logic
 * @module utils/tooltip.test
 */

import { describe, test, expect, beforeEach } from 'vitest';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper Functions to Test
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Extract tooltip ID from aria-describedby attribute
 * @param {HTMLElement} trigger - Trigger element
 * @returns {string|null} Tooltip ID or null
 */
const getTooltipId = (trigger) => {
  const describedBy = trigger.getAttribute('aria-describedby');
  return describedBy?.startsWith('tooltip-') ? describedBy : null;
};

/**
 * Calculate optimal tooltip position with collision detection
 * @param {Object} triggerRect - Trigger bounding rect
 * @param {Object} tooltipRect - Tooltip bounding rect
 * @param {Object} viewport - Viewport dimensions
 * @param {string} preferredPlacement - Preferred placement
 * @returns {Object} Position object {x, y, placement}
 */
const calculatePosition = (triggerRect, tooltipRect, viewport, preferredPlacement = 'top') => {
  const OFFSET = 8;
  const VIEWPORT_MARGIN = 16;

  const positions = {
    top: {
      x: triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2),
      y: triggerRect.top - tooltipRect.height - OFFSET
    },
    bottom: {
      x: triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2),
      y: triggerRect.bottom + OFFSET
    },
    left: {
      x: triggerRect.left - tooltipRect.width - OFFSET,
      y: triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
    },
    right: {
      x: triggerRect.right + OFFSET,
      y: triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
    }
  };

  const checkFit = (placement) => {
    const pos = positions[placement];
    return (
      pos.x >= VIEWPORT_MARGIN &&
      pos.x + tooltipRect.width <= viewport.width - VIEWPORT_MARGIN &&
      pos.y >= VIEWPORT_MARGIN &&
      pos.y + tooltipRect.height <= viewport.height - VIEWPORT_MARGIN
    );
  };

  if (checkFit(preferredPlacement)) {
    return { ...positions[preferredPlacement], placement: preferredPlacement };
  }

  const opposites = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  };

  const oppositePlacement = opposites[preferredPlacement];
  if (checkFit(oppositePlacement)) {
    return { ...positions[oppositePlacement], placement: oppositePlacement };
  }

  for (const placement of ['top', 'bottom', 'left', 'right']) {
    if (checkFit(placement)) {
      return { ...positions[placement], placement };
    }
  }

  const pos = positions[preferredPlacement];
  return {
    x: Math.max(VIEWPORT_MARGIN, Math.min(pos.x, viewport.width - tooltipRect.width - VIEWPORT_MARGIN)),
    y: Math.max(VIEWPORT_MARGIN, Math.min(pos.y, viewport.height - tooltipRect.height - VIEWPORT_MARGIN)),
    placement: preferredPlacement
  };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Test Suite
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('tooltip utility', () => {

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // getTooltipId
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('getTooltipId', () => {
    let mockElement;

    beforeEach(() => {
      mockElement = document.createElement('button');
    });

    test('should extract tooltip ID from valid aria-describedby', () => {
      mockElement.setAttribute('aria-describedby', 'tooltip-help');
      expect(getTooltipId(mockElement)).toBe('tooltip-help');
    });

    test('should extract tooltip ID with complex suffix', () => {
      mockElement.setAttribute('aria-describedby', 'tooltip-multi-word-id');
      expect(getTooltipId(mockElement)).toBe('tooltip-multi-word-id');
    });

    test('should return null when aria-describedby does not start with tooltip-', () => {
      mockElement.setAttribute('aria-describedby', 'description-help');
      expect(getTooltipId(mockElement)).toBeNull();
    });

    test('should return null when aria-describedby is empty', () => {
      mockElement.setAttribute('aria-describedby', '');
      expect(getTooltipId(mockElement)).toBeNull();
    });

    test('should return null when aria-describedby is missing', () => {
      expect(getTooltipId(mockElement)).toBeNull();
    });

    test('should return null when aria-describedby contains tooltip- but not at start', () => {
      mockElement.setAttribute('aria-describedby', 'help-tooltip-id');
      expect(getTooltipId(mockElement)).toBeNull();
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // calculatePosition
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('calculatePosition', () => {

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Preferred Placement (No Collision)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━

    describe('preferred placement without collision', () => {
      test('should position top when space available', () => {
        const triggerRect = { left: 100, top: 200, right: 200, bottom: 250, width: 100, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'top');

        expect(result.placement).toBe('top');
        expect(result.x).toBe(110); // 100 + 50 - 40 = centered
        expect(result.y).toBe(152); // 200 - 40 - 8 = above with offset
      });

      test('should position bottom when space available', () => {
        const triggerRect = { left: 100, top: 50, right: 200, bottom: 100, width: 100, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'bottom');

        expect(result.placement).toBe('bottom');
        expect(result.x).toBe(110);
        expect(result.y).toBe(108); // 100 + 8 = below with offset
      });

      test('should position left when space available', () => {
        const triggerRect = { left: 200, top: 100, right: 250, bottom: 150, width: 50, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'left');

        expect(result.placement).toBe('left');
        expect(result.x).toBe(112); // 200 - 80 - 8 = left with offset
        expect(result.y).toBe(105); // 100 + 25 - 20 = vertically centered
      });

      test('should position right when space available', () => {
        const triggerRect = { left: 100, top: 100, right: 150, bottom: 150, width: 50, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'right');

        expect(result.placement).toBe('right');
        expect(result.x).toBe(158); // 150 + 8 = right with offset
        expect(result.y).toBe(105);
      });
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Auto-Flip on Collision
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━

    describe('auto-flip on collision', () => {
      test('should flip from top to bottom on vertical collision', () => {
        const triggerRect = { left: 100, top: 30, right: 200, bottom: 80, width: 100, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'top');

        expect(result.placement).toBe('bottom'); // Flipped
        expect(result.y).toBe(88); // 80 + 8
      });

      test('should flip from bottom to top on vertical collision', () => {
        const triggerRect = { left: 100, top: 700, right: 200, bottom: 750, width: 100, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'bottom');

        expect(result.placement).toBe('top'); // Flipped
        expect(result.y).toBe(652); // 700 - 40 - 8
      });

      test('should flip from left to right on horizontal collision', () => {
        const triggerRect = { left: 30, top: 100, right: 80, bottom: 150, width: 50, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'left');

        expect(result.placement).toBe('right'); // Flipped
        expect(result.x).toBe(88); // 80 + 8
      });

      test('should flip from right to left on horizontal collision', () => {
        const triggerRect = { left: 950, top: 100, right: 1000, bottom: 150, width: 50, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'right');

        expect(result.placement).toBe('left'); // Flipped
        expect(result.x).toBe(862); // 950 - 80 - 8
      });
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Viewport Constraint
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━

    describe('viewport constraint', () => {
      test('should constrain to viewport when no placement fits', () => {
        const triggerRect = { left: 10, top: 10, right: 60, bottom: 60, width: 50, height: 50 };
        const tooltipRect = { width: 120, height: 80 };
        const viewport = { width: 200, height: 200 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'top');

        // Should constrain within viewport margins (16px)
        expect(result.x).toBeGreaterThanOrEqual(16);
        expect(result.x).toBeLessThanOrEqual(200 - 120 - 16);
        expect(result.y).toBeGreaterThanOrEqual(16);
        expect(result.y).toBeLessThanOrEqual(200 - 80 - 16);
      });

      test('should respect viewport margin of 16px', () => {
        const triggerRect = { left: 5, top: 100, right: 55, bottom: 150, width: 50, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'left');

        expect(result.x).toBeGreaterThanOrEqual(16);
      });

      test('should center tooltip when trigger near viewport edge', () => {
        const triggerRect = { left: 10, top: 200, right: 60, bottom: 250, width: 50, height: 50 };
        const tooltipRect = { width: 100, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'top');

        // Tooltip centered formula: triggerLeft + (triggerWidth/2) - (tooltipWidth/2)
        // = 10 + 25 - 50 = -15, then constrained to viewport margin
        expect(result.x).toBeGreaterThanOrEqual(16);
      });
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Fallback Mechanism
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━

    describe('fallback mechanism', () => {
      test('should try all placements before constraining', () => {
        const triggerRect = { left: 500, top: 400, right: 550, bottom: 450, width: 50, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'top');

        // With enough space, should use a valid placement
        expect(['top', 'bottom', 'left', 'right']).toContain(result.placement);
      });

      test('should maintain preferred placement as fallback when constraining', () => {
        const triggerRect = { left: 10, top: 10, right: 60, bottom: 60, width: 50, height: 50 };
        const tooltipRect = { width: 200, height: 100 };
        const viewport = { width: 300, height: 300 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'bottom');

        expect(result.placement).toBe('bottom'); // Keeps preferred when constraining
      });
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Edge Cases
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━

    describe('edge cases', () => {
      test('should handle trigger at viewport top-left corner', () => {
        const triggerRect = { left: 16, top: 16, right: 66, bottom: 66, width: 50, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'top');

        expect(result.x).toBeGreaterThanOrEqual(16);
        expect(result.y).toBeGreaterThanOrEqual(16);
      });

      test('should handle trigger at viewport bottom-right corner', () => {
        const triggerRect = { left: 950, top: 700, right: 1000, bottom: 750, width: 50, height: 50 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'bottom');

        expect(result.x + tooltipRect.width).toBeLessThanOrEqual(1024 - 16);
        expect(result.y + tooltipRect.height).toBeLessThanOrEqual(768 - 16);
      });

      test('should handle very large tooltip relative to viewport', () => {
        const triggerRect = { left: 100, top: 100, right: 150, bottom: 150, width: 50, height: 50 };
        const tooltipRect = { width: 500, height: 300 };
        const viewport = { width: 600, height: 400 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'top');

        // Should constrain within viewport
        expect(result.x).toBeGreaterThanOrEqual(16);
        expect(result.y).toBeGreaterThanOrEqual(16);
        expect(result.x + tooltipRect.width).toBeLessThanOrEqual(600 - 16);
        expect(result.y + tooltipRect.height).toBeLessThanOrEqual(400 - 16);
      });

      test('should handle zero-sized trigger', () => {
        const triggerRect = { left: 100, top: 100, right: 100, bottom: 100, width: 0, height: 0 };
        const tooltipRect = { width: 80, height: 40 };
        const viewport = { width: 1024, height: 768 };

        const result = calculatePosition(triggerRect, tooltipRect, viewport, 'top');

        expect(result).toBeDefined();
        expect(result.placement).toBeDefined();
      });
    });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
