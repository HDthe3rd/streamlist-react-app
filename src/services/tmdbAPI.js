import { securityUtils } from '../utils/securityUtils';

// Enhanced TMDB API service with security and rate limiting
export const tmdbAPI = {
  baseURL: 'https://api.themoviedb.org/3',
  imageBaseURL: 'https://image.tmdb.org/t/p/w500',
  apiKey: process.env.REACT_APP_TMDB_API_KEY || 'your_tmdb_api_key_here',
  
  // Rate limiting for API calls
  rateLimitedFetch: async (url) => {
    const rateLimitKey = 'tmdb_api';
    // Allow 40 requests per minute (TMDB allows 40 per 10 seconds)
    if (!securityUtils.rateLimiter.isAllowed(rateLimitKey, 40, 60000)) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      return response;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Request timed out. Please check your connection.');
      }
      throw error;
    }
  },
  
  searchMovies: async (query) => {
    // Validate and sanitize input
    const sanitizedQuery = securityUtils.sanitizeInput(query);
    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }
    
    if (sanitizedQuery.length > 100) {
      throw new Error('Search query is too long');
    }
    
    // Use mock data if no API key configured
    if (!tmdbAPI.apiKey || tmdbAPI.apiKey === 'your_tmdb_api_key_here') {
      console.log('Using mock data - configure REACT_APP_TMDB_API_KEY for real API');
      return tmdbAPI.getMockMovieData(sanitizedQuery);
    }
    
    try {
      const response = await tmdbAPI.rateLimitedFetch(
        `${tmdbAPI.baseURL}/search/movie?api_key=${tmdbAPI.apiKey}&query=${encodeURIComponent(sanitizedQuery)}&include_adult=false&language=en-US&page=1`
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your TMDB API configuration.');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait before searching again.');
        } else {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      
      if (!data.results) {
        throw new Error('Invalid API response format');
      }
      
      // Transform and validate the response data
      return data.results.map(movie => ({
        id: movie.id,
        title: securityUtils.sanitizeInput(movie.title || 'Unknown Title'),
        overview: securityUtils.sanitizeInput(movie.overview || 'No description available'),
        release_date: movie.release_date || '',
        vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
        poster_path: movie.poster_path ? `${tmdbAPI.imageBaseURL}${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `${tmdbAPI.imageBaseURL}${movie.backdrop_path}` : null,
        genre_ids: Array.isArray(movie.genre_ids) ? movie.genre_ids : []
      })).slice(0, 20); // Limit to 20 results for performance
      
    } catch (error) {
      console.error('TMDB API error:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('Rate limit')) {
        throw new Error('Too many searches. Please wait a moment before trying again.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Failed to search movies. Please try again.');
      }
    }
  },
  
  getMockMovieData: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockMovies = [
          {
            id: 1,
            title: `${query} Adventure`,
            overview: `An exciting adventure movie featuring ${query}. This thrilling story takes you on a journey of discovery and excitement.`,
            release_date: '2024-01-15',
            vote_average: 8.5,
            poster_path: null,
            backdrop_path: null,
            genre_ids: [28, 12] // Action, Adventure
          },
          {
            id: 2,
            title: `The ${query} Chronicles`,
            overview: `A epic tale about ${query} that spans generations. This sequel surpasses the original with stunning visuals and compelling storytelling.`,
            release_date: '2024-03-22',
            vote_average: 7.8,
            poster_path: null,
            backdrop_path: null,
            genre_ids: [35, 18] // Comedy, Drama
          },
          {
            id: 3,
            title: `${query}: Origins`,
            overview: `The origin story of ${query} that you've been waiting for. Discover how it all began in this prequel that explains everything.`,
            release_date: '2024-05-10',
            vote_average: 9.1,
            poster_path: null,
            backdrop_path: null,
            genre_ids: [878, 53] // Sci-Fi, Thriller
          },
          {
            id: 4,
            title: `Return to ${query}`,
            overview: `The beloved characters return in this heartwarming sequel about ${query}. A perfect blend of nostalgia and fresh storytelling.`,
            release_date: '2024-07-04',
            vote_average: 8.2,
            poster_path: null,
            backdrop_path: null,
            genre_ids: [10751, 16] // Family, Animation
          }
        ];
        resolve(mockMovies);
      }, 1000); // Simulate network delay
    });
  },
  
  // Get movie details by ID
  getMovieDetails: async (movieId) => {
    if (!movieId || isNaN(movieId)) {
      throw new Error('Invalid movie ID');
    }
    
    if (!tmdbAPI.apiKey || tmdbAPI.apiKey === 'your_tmdb_api_key_here') {
      // Return mock detailed data
      return {
        id: movieId,
        title: 'Mock Movie Details',
        overview: 'This is mock movie detail data. Configure your API key to see real details.',
        runtime: 120,
        genres: [{ id: 28, name: 'Action' }],
        production_companies: [{ name: 'Mock Studios' }]
      };
    }
    
    try {
      const response = await tmdbAPI.rateLimitedFetch(
        `${tmdbAPI.baseURL}/movie/${movieId}?api_key=${tmdbAPI.apiKey}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to get movie details: ${response.status}`);
      }
      
      const movieDetails = await response.json();
      
      // Sanitize the response
      return {
        ...movieDetails,
        title: securityUtils.sanitizeInput(movieDetails.title || ''),
        overview: securityUtils.sanitizeInput(movieDetails.overview || ''),
        tagline: securityUtils.sanitizeInput(movieDetails.tagline || '')
      };
      
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw new Error('Failed to load movie details');
    }
  },
  
  // Validate API key
  validateApiKey: async () => {
    if (!tmdbAPI.apiKey || tmdbAPI.apiKey === 'your_tmdb_api_key_here') {
      return { valid: false, message: 'No API key configured' };
    }
    
    try {
      const response = await fetch(
        `${tmdbAPI.baseURL}/authentication?api_key=${tmdbAPI.apiKey}`
      );
      
      return {
        valid: response.ok,
        message: response.ok ? 'API key is valid' : 'Invalid API key'
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Could not validate API key'
      };
    }
  }
};