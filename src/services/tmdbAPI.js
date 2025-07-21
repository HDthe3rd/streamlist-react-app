// Mock TMDB API service (replace with real API key in production)
export const tmdbAPI = {
  baseURL: 'https://api.themoviedb.org/3',
  imageBaseURL: 'https://image.tmdb.org/t/p/w500',
  apiKey: 'your_tmdb_api_key_here',
  
  searchMovies: async (query) => {
    if (!tmdbAPI.apiKey || tmdbAPI.apiKey === 'your_tmdb_api_key_here') {
      return tmdbAPI.getMockMovieData(query);
    }
    
    try {
      const response = await fetch(
        `${tmdbAPI.baseURL}/search/movie?api_key=${tmdbAPI.apiKey}&query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        poster_path: movie.poster_path ? `${tmdbAPI.imageBaseURL}${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `${tmdbAPI.imageBaseURL}${movie.backdrop_path}` : null,
        genre_ids: movie.genre_ids
      }));
    } catch (error) {
      console.error('TMDB API error:', error);
      throw new Error('Failed to search movies. Please try again.');
    }
  },
  
  getMockMovieData: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockMovies = [
          {
            id: 1,
            title: `${query} Movie 1`,
            overview: `This is a great movie about ${query}. It features amazing cinematography.`,
            release_date: '2024-01-15',
            vote_average: 8.5,
            poster_path: null,
            backdrop_path: null,
            genre_ids: [28, 12]
          },
          {
            id: 2,
            title: `${query} Movie 2`,
            overview: `Another excellent film featuring ${query}. This sequel surpasses the original.`,
            release_date: '2024-03-22',
            vote_average: 7.8,
            poster_path: null,
            backdrop_path: null,
            genre_ids: [35, 18]
          }
        ];
        resolve(mockMovies);
      }, 1000);
    });
  }
};