# Implementation Plan

- [x] 1. Create song configuration and registry system
  - Create `songConfig.ts` file with TypeScript interfaces for song metadata
  - Define `AVAILABLE_SONGS` array with all three music files (yugure_avenue, devil_in_electric_city, gong)
  - Add helper functions for song validation and lookup by ID
  - Write unit tests for song configuration utilities
  - _Requirements: 1.1, 2.2, 4.3_

- [x] 2. Implement song selector dropdown component
  - Create `songSelector.ts` file with dropdown HTML element creation
  - Implement song selection change event handling
  - Add methods for setting and getting current song selection
  - Style the dropdown to match existing UI aesthetic
  - Write unit tests for song selector component functionality
  - _Requirements: 1.1, 1.3, 2.1, 2.3, 3.3_

- [x] 3. Enhance music component with song switching capability
  - Modify `music.ts` to support dynamic song source changes
  - Add `changeSong()` method that updates audio element source
  - Implement proper cleanup when switching between songs
  - Add error handling for failed song loads with fallback behavior
  - Write unit tests for song switching functionality
  - _Requirements: 1.2, 1.3, 4.4_

- [x] 4. Integrate Chrome storage for song preference persistence
  - Add Chrome storage utilities for saving and loading selected song
  - Implement storage save operation when user selects new song
  - Add storage load operation during music player initialization
  - Handle storage errors gracefully with fallback to default song
  - Write unit tests for storage integration with mocked Chrome APIs
  - _Requirements: 1.4, 4.1, 4.2, 4.3_

- [x] 5. Update music player index to integrate song selector
  - Modify `musicPlayer/index.ts` to include song selector component
  - Wire up song selector change events to music component song switching
  - Initialize song selector with stored preference or default song
  - Ensure proper component lifecycle and cleanup
  - Update existing `togglePlay()` function to work with dynamic songs
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [x] 6. Add import statements for new music files
  - Add import statements for `devil_in_electric_city.mp3` and `gong.mp3` in song configuration
  - Ensure all music files are properly accessible via Chrome extension URLs
  - Verify that Vite build process includes all music files in output
  - _Requirements: 1.1, 1.2_

- [x] 7. Write integration tests for complete song selector functionality
  - Create integration test that verifies song selection changes audio source
  - Test that song selection persists across component re-initialization
  - Verify that song selector integrates properly with existing play/pause controls
  - Test error scenarios like missing files or invalid stored preferences
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.1, 4.1, 4.2, 4.3, 4.4_

- [x] 8. Update component styling and ensure UI consistency
  - Add CSS styles for song selector dropdown in main SCSS files
  - Ensure song selector aligns properly with existing music controls
  - Test responsive behavior and visual integration with toolbar
  - Verify accessibility features like keyboard navigation and ARIA labels
  - _Requirements: 2.1, 2.3, 3.2, 3.3_