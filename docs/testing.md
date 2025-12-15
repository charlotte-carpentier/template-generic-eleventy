---
title: Testing Guide
description: Guide for writing and running tests in HAT
type: documentation
created: 2025-12-15
tags: [testing, vitest, unit-tests]
---

## Framework

**Vitest 4.0.15** - Modern testing framework built on Vite

---

## Test Structure

### File Organization

Tests use colocation pattern (test files next to source):

```text
src/assets/scripts/utils/
├── debounce.js
├── debounce.test.js
├── dismiss.js
├── dismiss.test.js
└── pagination.js
    pagination.test.js
```

### Naming Convention

- Test files: `[name].test.js`
- Test suites: `describe('[name] utility', () => {})`
- Test cases: `test('should [behavior]', () => {})`

---

## File Template

```javascript
/* ┌─────────────────────────────────────────────────────────┐
   │ TESTS › [Name] Utility                                  │
   │ Unit tests for [name] function                          │
   │ Path: src/assets/scripts/utils/                         │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tests for [name] utility
 * Validates [key behaviors to test]
 * @module utils/[name].test
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { functionName } from './[name].js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Test Suite
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('[name] utility', () => {
  beforeEach(() => {
    // Setup before each test
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Cleanup after each test
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Category 1
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('category 1', () => {
    test('should [expected behavior]', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Test Categories

### Standard Categories

Organize tests by behavior type:

#### 1. Basic Behavior

- Core functionality
- Default parameters
- Return values

#### 2. Edge Cases

- Boundary values (0, null, undefined)
- Empty inputs
- Invalid inputs
- Error handling

#### 3. Real-World Use Cases

- Actual usage scenarios
- Integration patterns
- Performance validation

#### 4. Context/Arguments (if applicable)

- Argument preservation
- Context (`this`) preservation
- Multiple argument types

---

## Running Tests

### Commands

```bash
# Watch mode (auto-rerun on save)
npm test

# UI mode (visual interface)
npm run test:ui

# Run once (CI mode)
npm run test:run

# Coverage report
npm run test:coverage
```

### Watch Mode Usage

```text
Press h to show help
Press a to rerun all tests
Press f to rerun only failed tests
Press q to quit
```

---

## Vitest API

### Core Functions

```javascript
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Test suite grouping
describe('utility name', () => {
  // Individual test
  test('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

### Lifecycle Hooks

```javascript
beforeEach(() => {
  // Runs before each test in describe block
});

afterEach(() => {
  // Runs after each test in describe block
});

beforeAll(() => {
  // Runs once before all tests
});

afterAll(() => {
  // Runs once after all tests
});
```

### Assertions

```javascript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality (objects/arrays)

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(number).toBeGreaterThan(3);
expect(number).toBeLessThan(5);
expect(number).toBeCloseTo(0.3);        // Floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays/Iterables
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledTimes(2);
expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
expect(() => fn()).toThrow('Error message');
```

---

## Mocking with vi

### Mock Functions

```javascript
import { vi } from 'vitest';

// Create mock function
const mockFn = vi.fn();

// Mock implementation
const mockFn = vi.fn(() => 'return value');

// Mock implementation once
mockFn.mockImplementationOnce(() => 'first call');

// Check calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(2);

// Access call data
mockFn.mock.calls[0];        // First call arguments
mockFn.mock.results[0].value; // First call return value
```

### Timers

```javascript
import { vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.restoreAllMocks();
});

// Advance time
vi.advanceTimersByTime(1000);  // Advance 1 second

// Run all timers
vi.runAllTimers();

// Run only pending timers
vi.runOnlyPendingTimers();
```

---

## Best Practices

### Test Organization

```javascript
// Good: Grouped by behavior
describe('pagination utility', () => {
  describe('basic behavior', () => {
    test('should calculate total pages', () => {});
    test('should handle zero items', () => {});
  });
  
  describe('edge cases', () => {
    test('should handle division by zero', () => {});
  });
});

// Bad: Flat structure
describe('pagination utility', () => {
  test('test 1', () => {});
  test('test 2', () => {});
  test('test 3', () => {});
});
```

### Test Names

```javascript
// Good: Descriptive behavior
test('should debounce function calls with 300ms delay', () => {});
test('should preserve this context when called', () => {});

// Bad: Vague
test('works', () => {});
test('test debounce', () => {});
```

### Arrange-Act-Assert Pattern

```javascript
test('should add two numbers', () => {
  // Arrange: Setup test data
  const a = 2;
  const b = 3;
  
  // Act: Execute function
  const result = add(a, b);
  
  // Assert: Verify result
  expect(result).toBe(5);
});
```

### One Assertion Focus

```javascript
// Good: Single behavior per test
test('should return sum', () => {
  expect(add(2, 3)).toBe(5);
});

test('should handle negative numbers', () => {
  expect(add(-2, 3)).toBe(1);
});

// Acceptable: Related assertions
test('should preserve arguments and context', () => {
  const context = { value: 42 };
  fn.call(context, 'arg');
  
  expect(fn).toHaveBeenCalledWith('arg');
  expect(fn.mock.instances[0]).toBe(context);
});
```

---

## Coverage

### Configuration

Coverage thresholds set in `vitest.config.js`:

```javascript
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80
  }
}
```

### Coverage Report

```bash
npm run test:coverage
```

Generates reports in:

- Terminal (text format)
- `coverage/index.html` (visual report)

### Excluded Files

```javascript
coverage: {
  exclude: [
    'node_modules/',
    '*.config.js',
    '.eleventy.js',
    '**/*.test.js'
  ]
}
```

---

## Debugging Tests

### Console Output

```javascript
test('debug test', () => {
  console.log('Current value:', value);
  expect(value).toBe(expected);
});
```

### UI Mode

```bash
npm run test:ui
```

Opens browser interface with:

- Visual test tree
- Console output per test
- Source code view
- Re-run individual tests

### VSCode Integration

Install "Vitest" extension:

- Run tests in editor
- Debug breakpoints
- Inline results

---

## Common Patterns

### Testing Async Functions

```javascript
test('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

### Testing Errors

```javascript
test('should throw error on invalid input', () => {
  expect(() => {
    functionThatThrows();
  }).toThrow('Error message');
});
```

### Testing DOM Manipulation

```javascript
test('should add class to element', () => {
  const element = document.createElement('div');
  addClass(element, 'active');
  
  expect(element.classList.contains('active')).toBe(true);
});
```

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
