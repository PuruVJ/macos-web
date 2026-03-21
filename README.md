# macos-electron

`macos-electron` is a full Electron desktop adaptation of the original `macos-web` project. It keeps the macOS-style desktop metaphor, wallpaper system, menu bar, dock, and floating app windows, but now runs as a packaged desktop app instead of a browser-only site.

## Upstream Credit

This project is derived from the original [`PuruVJ/macos-web`](https://github.com/PuruVJ/macos-web) by [PuruVJ](https://github.com/PuruVJ).

- Original concept, visual direction, and core desktop experience came from `macos-web`
- This repo migrates that foundation to a full Electron app with a new React-based renderer stack

## Current Stack

- Electron 41
- Vite 8
- React 19
- TanStack Router
- Zustand
- React Query
- Axios
- React Native Web
- Uniwind
- Vitest
- Playwright

## Development

```bash
pnpm install
pnpm dev
```

## Validation

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm test:smoke
```

## What Changed

- Replaced the previous Svelte web app implementation
- Added Electron `main` and `preload` processes
- Moved the renderer to React + Vite
- Added desktop-safe IPC through `window.desktop`
- Ported desktop state to Zustand
- Added router, query, test, and packaging infrastructure

## Notes

- This project is an unofficial macOS-inspired UI experiment and is not affiliated with Apple.
- The repo targets a real desktop runtime first, not a hosted web deployment.
