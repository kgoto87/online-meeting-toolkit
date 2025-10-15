# Project Structure

## Root Directory
- `src/`: All source code
- `dist/`: Build output (generated)
- `src/public/`: Static assets and manifest
- `.kiro/`: Kiro configuration and steering rules

## Source Organization

### Entry Points
- `src/main.ts`: Content script entry point
- `src/background.ts`: Service worker entry point
- `src/options/`: Options page (HTML, TS, SCSS)

### Core Architecture
- `src/parts/`: Modular UI components
  - `container/`: Main widget container with drag/drop events
  - `timer/`: Timer functionality with time units and controls
  - `emoji/`: Emoji display system
  - `musicPlayer/`: Audio player component
- `src/shortcuts/`: Keyboard shortcut handling
- `src/styles/`: Global SCSS styles and reset
- `src/state.ts`: Global application state management

### Component Structure Pattern
Each part follows this pattern:
- `index.ts`: Main component export
- Individual feature files (e.g., `time.ts`, `startButton.ts`)
- Test files with `.test.ts` suffix
- Nested subdirectories for complex components (e.g., `timeUnit/`)

### Assets Organization
- `src/public/assets/fonts/`: Custom font files
- `src/public/assets/icons/`: Extension icons
- `src/public/assets/musics/`: Audio files with type definitions
- `src/public/manifest.json`: Chrome extension manifest

## Naming Conventions
- **Files**: camelCase for TypeScript files
- **Components**: Default exports from index files
- **Classes**: PascalCase (e.g., `MouseEvents`, `Time`)
- **Functions**: camelCase factory functions (e.g., `createPredefinedButton`)
- **CSS Classes**: kebab-case with BEM-like structure

## Import Patterns
- Relative imports for local files
- Default exports for main component files
- Path aliases configured: `@/*` maps to `src/*`