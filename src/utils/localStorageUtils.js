// src/utils/localStorageUtils.js
import { securityUtils } from './securityUtils';

// Enhanced LocalStorage utility functions with security improvements
export const localStorageUtils = {
  // Save streams with encryption and validation
  saveStreams: (streams) => {
    try {
      // Validate input
      if (!Array.isArray(streams)) {
        console.error('saveStreams: Expected array, got', typeof streams);
        return false;
      }

      // Sanitize each stream object
      const sanitizedStreams = streams.map(stream => ({
        id: stream.id,
        title: securityUtils.sanitizeInput(stream.title || ''),
        platform: securityUtils.sanitizeInput(stream.platform || ''),
        genre: securityUtils.sanitizeInput(stream.genre || ''),
        priority: ['low', 'medium', 'high'].includes(stream.priority) ? stream.priority : 'medium',
        description: securityUtils.sanitizeInput(stream.description || ''),
        completed: Boolean(stream.completed),
        dateAdded: stream.dateAdded || new Date().toLocaleDateString(),
        dateUpdated: stream.dateUpdated || new Date().toLocaleDateString()
      }));

      // Use secure storage with 30-day expiry
      securityUtils.secureStorage.setItem('streamlist_data', sanitizedStreams);
      console.log('Streams saved securely:', sanitizedStreams.length, 'items');
      return true;
    } catch (error) {
      console.error('Error saving streams to localStorage:', error);
      return false;
    }
  },
  
  // Load streams with validation and security checks
  loadStreams: () => {
    try {
      // Use secure storage with 30-day expiry (30 * 24 * 60 * 60 * 1000 ms)
      const streams = securityUtils.secureStorage.getItem('streamlist_data', 30 * 24 * 60 * 60 * 1000);
      
      if (!streams) {
        console.log('No saved streams found');
        return [];
      }

      if (!Array.isArray(streams)) {
        console.error('Invalid streams data format, expected array');
        // Clear corrupted data
        securityUtils.secureStorage.removeItem('streamlist_data');
        return [];
      }

      // Validate each stream object
      const validStreams = streams.filter(stream => {
        return stream && 
               typeof stream.id !== 'undefined' && 
               typeof stream.title === 'string' &&
               stream.title.trim().length > 0;
      });

      if (validStreams.length !== streams.length) {
        console.warn(`Filtered out ${streams.length - validStreams.length} invalid stream entries`);
        // Save the cleaned data back
        localStorageUtils.saveStreams(validStreams);
      }

      console.log('Streams loaded from secure storage:', validStreams.length, 'items');
      return validStreams;
    } catch (error) {
      console.error('Error loading streams from localStorage:', error);
      return [];
    }
  },
  
  // Clear streams with confirmation
  clearStreams: () => {
    try {
      securityUtils.secureStorage.removeItem('streamlist_data');
      console.log('Streams cleared from secure storage');
      return true;
    } catch (error) {
      console.error('Error clearing streams from localStorage:', error);
      return false;
    }
  },
  
  // Enhanced movie cache with better security and validation
  saveMovieCache: (searchTerm, results) => {
    try {
      if (!searchTerm || typeof searchTerm !== 'string') {
        console.error('Invalid search term for movie cache');
        return false;
      }

      if (!Array.isArray(results)) {
        console.error('Invalid results for movie cache, expected array');
        return false;
      }

      const sanitizedTerm = securityUtils.sanitizeInput(searchTerm.trim().toLowerCase());
      if (sanitizedTerm.length === 0) {
        console.error('Empty search term after sanitization');
        return false;
      }

      // Get existing cache or create new one
      const cache = securityUtils.secureStorage.getItem('movie_cache', 24 * 60 * 60 * 1000) || {};
      
      // Limit cache size - keep only last 50 searches
      const cacheKeys = Object.keys(cache);
      if (cacheKeys.length >= 50) {
        // Remove oldest entries
        const sortedKeys = cacheKeys.sort((a, b) => {
          const aTime = cache[a]?.timestamp || 0;
          const bTime = cache[b]?.timestamp || 0;
          return aTime - bTime;
        });
        
        // Remove oldest 10 entries
        for (let i = 0; i < 10; i++) {
          delete cache[sortedKeys[i]];
        }
      }

      // Sanitize results
      const sanitizedResults = results.map(movie => ({
        id: movie.id,
        title: securityUtils.sanitizeInput(movie.title || ''),
        overview: securityUtils.sanitizeInput(movie.overview || ''),
        release_date: movie.release_date || '',
        vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
        poster_path: movie.poster_path || null,
        backdrop_path: movie.backdrop_path || null,
        genre_ids: Array.isArray(movie.genre_ids) ? movie.genre_ids : []
      }));

      cache[sanitizedTerm] = {
        results: sanitizedResults,
        timestamp: Date.now(),
        expires: Date.now() + (1000 * 60 * 30) // 30 minutes
      };
      
      securityUtils.secureStorage.setItem('movie_cache', cache);
      console.log(`Movie cache saved for: "${sanitizedTerm}" (${sanitizedResults.length} results)`);
      return true;
    } catch (error) {
      console.error('Error saving movie cache:', error);
      return false;
    }
  },
  
  // Load movie cache with validation
  loadMovieCache: (searchTerm) => {
    try {
      if (!searchTerm || typeof searchTerm !== 'string') {
        return null;
      }

      const sanitizedTerm = securityUtils.sanitizeInput(searchTerm.trim().toLowerCase());
      if (sanitizedTerm.length === 0) {
        return null;
      }

      const cache = securityUtils.secureStorage.getItem('movie_cache', 24 * 60 * 60 * 1000) || {};
      const cached = cache[sanitizedTerm];
      
      if (!cached) {
        return null;
      }

      // Check if cache entry has expired
      if (cached.expires && cached.expires <= Date.now()) {
        // Remove expired entry
        delete cache[sanitizedTerm];
        securityUtils.secureStorage.setItem('movie_cache', cache);
        console.log(`Expired cache entry removed for: "${sanitizedTerm}"`);
        return null;
      }

      // Validate cached results
      if (!Array.isArray(cached.results)) {
        console.warn(`Invalid cached results for: "${sanitizedTerm}"`);
        delete cache[sanitizedTerm];
        securityUtils.secureStorage.setItem('movie_cache', cache);
        return null;
      }

      console.log(`Using cached results for: "${sanitizedTerm}" (${cached.results.length} results)`);
      return cached.results;
    } catch (error) {
      console.error('Error loading movie cache:', error);
      return null;
    }
  },

  // Clear expired cache entries
  cleanupMovieCache: () => {
    try {
      const cache = securityUtils.secureStorage.getItem('movie_cache', 24 * 60 * 60 * 1000) || {};
      const now = Date.now();
      let cleanedCount = 0;

      Object.keys(cache).forEach(key => {
        const entry = cache[key];
        if (!entry || !entry.expires || entry.expires <= now) {
          delete cache[key];
          cleanedCount++;
        }
      });

      if (cleanedCount > 0) {
        securityUtils.secureStorage.setItem('movie_cache', cache);
        console.log(`Cleaned up ${cleanedCount} expired cache entries`);
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning up movie cache:', error);
      return 0;
    }
  },

  // Get storage usage statistics
  getStorageStats: () => {
    try {
      const streams = localStorageUtils.loadStreams();
      const cache = securityUtils.secureStorage.getItem('movie_cache', 24 * 60 * 60 * 1000) || {};
      
      return {
        streamsCount: streams.length,
        cacheEntriesCount: Object.keys(cache).length,
        totalStorageUsed: JSON.stringify({ streams, cache }).length,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        streamsCount: 0,
        cacheEntriesCount: 0,
        totalStorageUsed: 0,
        lastUpdated: new Date().toISOString(),
        error: error.message
      };
    }
  },

  // Export data for backup/debugging
  exportData: () => {
    try {
      const streams = localStorageUtils.loadStreams();
      const cache = securityUtils.secureStorage.getItem('movie_cache', 24 * 60 * 60 * 1000) || {};
      
      const exportData = {
        streams,
        movieCache: cache,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `streamlist-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Data exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    }
  },

  // Import data from backup
  importData: (jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }

      let importedCount = 0;

      // Import streams
      if (Array.isArray(data.streams)) {
        const success = localStorageUtils.saveStreams(data.streams);
        if (success) {
          importedCount += data.streams.length;
          console.log(`Imported ${data.streams.length} streams`);
        }
      }

      // Import movie cache
      if (data.movieCache && typeof data.movieCache === 'object') {
        securityUtils.secureStorage.setItem('movie_cache', data.movieCache);
        const cacheCount = Object.keys(data.movieCache).length;
        importedCount += cacheCount;
        console.log(`Imported ${cacheCount} cache entries`);
      }

      console.log(`Data import completed. Total items: ${importedCount}`);
      return { success: true, importedCount };
    } catch (error) {
      console.error('Error importing data:', error);
      return { success: false, error: error.message };
    }
  }
};