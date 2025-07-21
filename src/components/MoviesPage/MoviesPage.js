import React, { useState } from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';
import { localStorageUtils } from '../../utils/localStorageUtils';
import { tmdbAPI } from '../../services/tmdbAPI';

// Enhanced Movies Page Component with TMDB API Integration
const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    setHasSearched(true);
    
    try {
      console.log('Searching for movies:', searchQuery);
      
      // Check cache first
      const cachedResults = localStorageUtils.loadMovieCache(searchQuery);
      if (cachedResults) {
        setMovies(cachedResults);
        setLoading(false);
        return;
      }
      
      // Search using API or mock data
      const results = await tmdbAPI.searchMovies(searchQuery);
      setMovies(results);
      
      // Cache results
      localStorageUtils.saveMovieCache(searchQuery, results);
      
      console.log('Search results:', results.length, 'movies found');
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const addToStreamList = (movie) => {
    // This would integrate with the main StreamList state in a real app
    console.log('Adding to stream list:', movie.title);
    alert(`"${movie.title}" would be added to your StreamList!`);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Movie Discovery</h1>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem' }}>
        <Icons.API /> Search movies using TMDB API integration
      </p>
      
      {/* Search Form */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for movies..."
          style={styles.searchInput}
        />
        <button
          onClick={handleSearch}
          style={styles.searchButton}
          disabled={loading || !searchQuery.trim()}
        >
          <Icons.Search />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorMessage}>
          <Icons.Error /> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingSpinner}>
          <Icons.Loading /> Searching for movies...
        </div>
      )}

      {/* No Results Message */}
      {hasSearched && !loading && movies.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
          <Icons.Search style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <p>No movies found for "{searchQuery}". Try a different search term.</p>
        </div>
      )}

      {/* Movies Grid */}
      {movies.length > 0 && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#4a5568' }}>
            Found {movies.length} movies for "{searchQuery}"
          </div>
          
          <div style={styles.moviesGrid}>
            {movies.map((movie) => (
              <div
                key={movie.id}
                style={styles.movieCard}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.movieCardHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Movie Poster Placeholder */}
                <div style={styles.moviePoster}>
                  {movie.poster_path ? (
                    <img 
                      src={movie.poster_path} 
                      alt={movie.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%', 
                      fontSize: '3rem',
                      color: '#cbd5e0'
                    }}>
                      <Icons.Movie />
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div style={styles.movieTitle}>{movie.title}</div>
                
                <div style={styles.movieMeta}>
                  {movie.release_date && (
                    <span style={styles.streamBadge}>
                      <Icons.Calendar /> {new Date(movie.release_date).getFullYear()}
                    </span>
                  )}
                  {movie.vote_average && (
                    <span style={styles.streamBadge}>
                      <Icons.Star /> {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>

                {movie.overview && (
                  <div style={styles.movieDescription}>
                    {movie.overview}
                  </div>
                )}

                <button
                  onClick={() => addToStreamList(movie)}
                  style={styles.buttonSecondary}
                >
                  <Icons.Add />
                  Add to StreamList
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Instructions for first time users */}
      {!hasSearched && (
        <div style={styles.comingSoon}>
          <div style={styles.comingSoonIcon}>
            <Icons.Search />
          </div>
          <h2 style={styles.comingSoonTitle}>Movie Search & Discovery</h2>
          <p style={styles.comingSoonText}>
            Use the search bar above to discover movies from The Movie Database (TMDB). 
            Search results are cached locally for improved performance. 
            Note: This uses mock data for demonstration unless a real API key is configured.
          </p>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;