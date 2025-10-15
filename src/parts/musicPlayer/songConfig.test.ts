import { describe, it, expect } from 'vitest';
import {
  AVAILABLE_SONGS,
  DEFAULT_SONG_ID,
  isValidSongId,
  getSongById,
  getValidSongId,
  getAllSongIds
} from './songConfig';

describe('songConfig', () => {
  describe('AVAILABLE_SONGS', () => {
    it('should contain all expected songs', () => {
      expect(AVAILABLE_SONGS).toHaveLength(4);
      
      const songIds = AVAILABLE_SONGS.map(song => song.id);
      expect(songIds).toContain('yugure_avenue');
      expect(songIds).toContain('devil_in_electric_city');
      expect(songIds).toContain('old_futuristic_space');
      expect(songIds).toContain('reunion_promise');
    });

    it('should have valid song configuration structure', () => {
      AVAILABLE_SONGS.forEach(song => {
        expect(song).toHaveProperty('id');
        expect(song).toHaveProperty('displayName');
        expect(song).toHaveProperty('filename');
        expect(song).toHaveProperty('importPath');
        
        expect(typeof song.id).toBe('string');
        expect(typeof song.displayName).toBe('string');
        expect(typeof song.filename).toBe('string');
        expect(typeof song.importPath).toBe('string');
        
        expect(song.id).toBeTruthy();
        expect(song.displayName).toBeTruthy();
        expect(song.filename).toBeTruthy();
        expect(song.importPath).toBeTruthy();
      });
    });

    it('should have unique song IDs', () => {
      const songIds = AVAILABLE_SONGS.map(song => song.id);
      const uniqueIds = new Set(songIds);
      expect(uniqueIds.size).toBe(songIds.length);
    });

    it('should have filenames that match IDs with .mp3 extension', () => {
      AVAILABLE_SONGS.forEach(song => {
        expect(song.filename).toBe(`${song.id}.mp3`);
      });
    });
  });

  describe('DEFAULT_SONG_ID', () => {
    it('should be the first song in the registry', () => {
      expect(DEFAULT_SONG_ID).toBe(AVAILABLE_SONGS[0].id);
    });

    it('should be a valid song ID', () => {
      expect(isValidSongId(DEFAULT_SONG_ID)).toBe(true);
    });
  });

  describe('isValidSongId', () => {
    it('should return true for valid song IDs', () => {
      expect(isValidSongId('yugure_avenue')).toBe(true);
      expect(isValidSongId('devil_in_electric_city')).toBe(true);
      expect(isValidSongId('old_futuristic_space')).toBe(true);
      expect(isValidSongId('reunion_promise')).toBe(true);
    });

    it('should return false for invalid song IDs', () => {
      expect(isValidSongId('invalid_song')).toBe(false);
      expect(isValidSongId('')).toBe(false);
      expect(isValidSongId('YUGURE_AVENUE')).toBe(false); // case sensitive
    });

    it('should handle edge cases', () => {
      expect(isValidSongId('yugure_avenue.mp3')).toBe(false); // with extension
      expect(isValidSongId(' yugure_avenue ')).toBe(false); // with spaces
    });
  });

  describe('getSongById', () => {
    it('should return correct song configuration for valid IDs', () => {
      const yugureSong = getSongById('yugure_avenue');
      expect(yugureSong).toBeDefined();
      expect(yugureSong?.id).toBe('yugure_avenue');
      expect(yugureSong?.displayName).toBe('Yugure Avenue');
      expect(yugureSong?.filename).toBe('yugure_avenue.mp3');

      const devilSong = getSongById('devil_in_electric_city');
      expect(devilSong).toBeDefined();
      expect(devilSong?.id).toBe('devil_in_electric_city');
      expect(devilSong?.displayName).toBe('Devil in Electric City');

      // Test with second song as well
      expect(devilSong?.filename).toBe('devil_in_electric_city.mp3');
    });

    it('should return undefined for invalid IDs', () => {
      expect(getSongById('invalid_song')).toBeUndefined();
      expect(getSongById('')).toBeUndefined();
      expect(getSongById('YUGURE_AVENUE')).toBeUndefined();
    });
  });

  describe('getValidSongId', () => {
    it('should return the same ID for valid song IDs', () => {
      expect(getValidSongId('yugure_avenue')).toBe('yugure_avenue');
      expect(getValidSongId('devil_in_electric_city')).toBe('devil_in_electric_city');
      expect(getValidSongId('old_futuristic_space')).toBe('old_futuristic_space');
      expect(getValidSongId('reunion_promise')).toBe('reunion_promise');
    });

    it('should return default song ID for invalid IDs', () => {
      expect(getValidSongId('invalid_song')).toBe(DEFAULT_SONG_ID);
      expect(getValidSongId('')).toBe(DEFAULT_SONG_ID);
      expect(getValidSongId('YUGURE_AVENUE')).toBe(DEFAULT_SONG_ID);
    });

    it('should return default song ID for undefined input', () => {
      expect(getValidSongId(undefined)).toBe(DEFAULT_SONG_ID);
    });
  });

  describe('getAllSongIds', () => {
    it('should return all song IDs in order', () => {
      const allIds = getAllSongIds();
      expect(allIds).toEqual(['yugure_avenue', 'devil_in_electric_city', 'old_futuristic_space', 'reunion_promise']);
    });

    it('should return array with same length as AVAILABLE_SONGS', () => {
      const allIds = getAllSongIds();
      expect(allIds).toHaveLength(AVAILABLE_SONGS.length);
    });

    it('should return array of strings', () => {
      const allIds = getAllSongIds();
      allIds.forEach(id => {
        expect(typeof id).toBe('string');
        expect(id).toBeTruthy();
      });
    });
  });
});