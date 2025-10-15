# Technology Stack

## Core Technologies
- **TypeScript**: Primary language with strict type checking enabled
- **Chrome Extension Manifest V3**: Modern extension architecture
- **Vite**: Build tool and bundler for development and production
- **SCSS**: CSS preprocessing with modern compiler API
- **Vitest**: Testing framework with jsdom environment

## Build System
- **Bundler**: Vite with custom rollup configuration
- **Entry Points**: Multiple entry points (main.ts, background.ts, options/index.ts)
- **Asset Handling**: Custom asset file naming for Chrome extension structure
- **TypeScript Config**: ESNext target with strict mode and path aliases

## Key Dependencies
- `@types/chrome`: Chrome extension API types
- `sass-embedded`: Modern SCSS compiler
- `jsdom`: DOM testing environment
- `@testing-library/user-event`: User interaction testing

## Common Commands
```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test-once

# Build for production
npm run build
```

## Build Output Structure
- `dist/main.js`: Content script entry point
- `dist/background.js`: Service worker
- `dist/options/`: Options page files
- `dist/assets/`: Static assets (fonts, music, icons)

## Chrome Extension Architecture
- **Content Script**: Injected into web pages (main.ts)
- **Service Worker**: Background script for extension lifecycle
- **Options Page**: User preferences interface
- **Web Accessible Resources**: Fonts and audio files