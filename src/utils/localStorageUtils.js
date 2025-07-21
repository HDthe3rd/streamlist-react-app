// LocalStorage utility functions
export const localStorageUtils = {
  saveStreams: (streams) => {
    try {
      localStorage.setItem('streamlist_data', JSON.stringify(streams));
      console.log('Streams saved to localStorage:', streams.length, 'items');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  loadStreams: () => {
    try {
      const saved = localStorage.getItem('streamlist_data');
      if (saved) {
        const streams = JSON.parse(saved);
        console.log('Streams loaded from localStorage:', streams.length, 'items');
        return streams;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return [];
  },
  
  clearStreams: () => {
    try {
      localStorage.removeItem('streamlist_data');
      console.log('LocalStorage cleared');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
  
  saveMovieCache: (searchTerm, results) => {
    try {
      const cache = JSON.parse(localStorage.getItem('movie_cache') || '{}');
      cache[searchTerm] = {
        results,
        timestamp: Date.now(),
        expires: Date.now() + (1000 * 60 * 30)
      };
      localStorage.setItem('movie_cache', JSON.stringify(cache));
      console.log(`Movie cache saved for: "${searchTerm}"`);
    } catch (error) {
      console.error('Error saving movie cache:', error);
    }
  },
  
  loadMovieCache: (searchTerm) => {
    try {
      const cache = JSON.parse(localStorage.getItem('movie_cache') || '{}');
      const cached = cache[searchTerm];
      if (cached && cached.expires > Date.now()) {
        console.log(`Using cached results for: "${searchTerm}"`);
        return cached.results;
      }
    } catch (error) {
      console.error('Error loading movie cache:', error);
    }
    return null;
  }
};