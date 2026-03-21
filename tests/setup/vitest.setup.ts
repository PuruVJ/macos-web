import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

const matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: query.includes('prefers-color-scheme: dark') ? false : false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: matchMedia,
});

Object.defineProperty(window, 'desktop', {
  configurable: true,
  value: {
    getPlatform: vi.fn(async () => 'win32'),
    getVersion: vi.fn(async () => '41.0.3'),
    openExternal: vi.fn(async () => undefined),
    minimize: vi.fn(async () => undefined),
    maximizeToggle: vi.fn(async () => undefined),
    close: vi.fn(async () => undefined),
  },
});

Object.defineProperty(window, 'ResizeObserver', {
  configurable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

beforeEach(() => {
  localStorage.clear();
  document.body.className = '';
});

afterEach(() => {
  cleanup();
});
