/* ┌─────────────────────────────────────────────────────────┐
   │ TESTS › Debounce Utility                                │
   │ Unit tests for debounce function                        │
   │ Path: src/assets/scripts/utils/                         │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tests for debounce utility
 * Validates trailing-edge debouncing, timer reset, argument/context preservation
 * @module utils/debounce.test
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce.js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Test Suite
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('debounce utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Basic Behavior
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('basic behavior', () => {
    test('should delay function execution by default delay (300ms)', () => {
      const fn = vi.fn();
      const debounced = debounce(fn);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should delay function execution by custom delay', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 500);

      debounced();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should not execute function before delay completes', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 300);

      debounced();
      vi.advanceTimersByTime(299);

      expect(fn).not.toHaveBeenCalled();
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Timer Reset
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('timer reset', () => {
    test('should reset timer on multiple calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 300);

      debounced();
      vi.advanceTimersByTime(100);

      debounced();
      vi.advanceTimersByTime(100);

      debounced();
      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should only execute once after rapid calls stop', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 300);

      for (let i = 0; i < 10; i++) {
        debounced();
        vi.advanceTimersByTime(50);
      }

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should allow function execution after delay completes', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 300);

      debounced();
      vi.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);

      debounced();
      vi.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Arguments Preservation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('arguments preservation', () => {
    test('should pass arguments to debounced function', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 300);

      debounced('arg1', 'arg2', 'arg3');
      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    test('should use last call arguments when multiple calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 300);

      debounced('first');
      vi.advanceTimersByTime(100);

      debounced('second');
      vi.advanceTimersByTime(100);

      debounced('third');
      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('third');
    });

    test('should handle no arguments', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 300);

      debounced();
      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledWith();
    });

    test('should handle multiple argument types', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 300);

      debounced(42, 'text', true, null, undefined, { key: 'value' });
      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledWith(42, 'text', true, null, undefined, { key: 'value' });
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Context Preservation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('context preservation', () => {
    test('should preserve this context', () => {
      const context = { value: 42 };
      const fn = vi.fn(function() {
        return this.value;
      });

      const debounced = debounce(fn, 300);
      debounced.call(context);

      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalled();
      expect(fn.mock.results[0].value).toBe(42);
    });

    test('should preserve this context with arguments', () => {
      const context = { multiplier: 3 };
      const fn = vi.fn(function(value) {
        return value * this.multiplier;
      });

      const debounced = debounce(fn, 300);
      debounced.call(context, 10);

      vi.advanceTimersByTime(300);

      expect(fn.mock.results[0].value).toBe(30);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Real-World Use Cases
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('real-world use cases', () => {
    test('should handle resize event simulation', () => {
      const handleResize = vi.fn();
      const debouncedResize = debounce(handleResize, 150);

      for (let i = 0; i < 20; i++) {
        debouncedResize();
        vi.advanceTimersByTime(10);
      }

      expect(handleResize).not.toHaveBeenCalled();

      vi.advanceTimersByTime(150);
      expect(handleResize).toHaveBeenCalledTimes(1);
    });

    test('should handle input event simulation', () => {
      const handleInput = vi.fn();
      const debouncedInput = debounce(handleInput, 300);

      'hello'.split('').forEach((char) => {
        debouncedInput(char);
        vi.advanceTimersByTime(50);
      });

      expect(handleInput).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(handleInput).toHaveBeenCalledTimes(1);
      expect(handleInput).toHaveBeenCalledWith('o');
    });

    test('should handle scroll event simulation', () => {
      const handleScroll = vi.fn();
      const debouncedScroll = debounce(handleScroll, 200);

      for (let i = 0; i < 30; i++) {
        debouncedScroll();
        vi.advanceTimersByTime(20);
      }

      expect(handleScroll).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(handleScroll).toHaveBeenCalledTimes(1);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Edge Cases
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('edge cases', () => {
    test('should handle delay of 0', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 0);

      debounced();
      vi.advanceTimersByTime(0);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should handle very long delay', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 10000);

      debounced();
      vi.advanceTimersByTime(9999);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should handle function that throws error', () => {
      const fn = vi.fn(() => {
        throw new Error('Test error');
      });
      const debounced = debounce(fn, 300);

      debounced();

      expect(() => {
        vi.advanceTimersByTime(300);
      }).toThrow('Test error');
    });

    test('should handle function that returns value', () => {
      const fn = vi.fn(() => 'result');
      const debounced = debounce(fn, 300);

      debounced();
      vi.advanceTimersByTime(300);

      expect(fn.mock.results[0].value).toBe('result');
    });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
