// vitest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/vitest-dom
import '@testing-library/jest-dom';

import { vi } from 'vitest';

// Mock localStorage for tests with a simple implementation
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

Object.defineProperty(global, 'localStorage', {
  value: new LocalStorageMock(),
  writable: true,
});

// Jest compatibility layer - provide jest globals for existing tests
// Vitest provides these via 'vi' but we polyfill 'jest' for backward compatibility
global.jest = vi;

// Mock CSS imports - Vite/Vitest handles CSS imports natively
