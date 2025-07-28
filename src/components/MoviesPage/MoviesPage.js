import React, { useState } from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';
import { localStorageUtils } from '../../utils/localStorageUtils';
import { securityUtils } from '../../utils/securityUtils';
import { tmdbAPI } from '../../services/tmdbAPI';
import Notification from '../Notification/Notification';

// Enhanced Movies Page Component with proper StreamList integration
const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
  };

  const hideNotification = () => {
    setNotification('');
  };

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
      showNotification(`Found ${results.length} movies for "${searchQuery}"`);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search movies');
      setMovies([]);
      showNotification('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Enhanced function to actually add movies to StreamList
  const addToStreamList = (movie) => {
    try {
      // Load existing streams
      const existingStreams = localStorageUtils.loadStreams();
      
      // Check for duplicates (by title)
      const isDuplicate = existingStreams.some(stream => 
        stream.title.toLowerCase() === movie.title.toLowerCase()
      );
      
      if (isDuplicate) {
        showNotification(`"${movie.title}" is already in your StreamList!`);
        return;
      }

      // Convert movie to stream format
      const newStream = {
        id: Date.now() + Math.random(), // Unique ID
        title: securityUtils.sanitizeInput(movie.title),
        platform: 'Unknown', // Movies don't have platform info
        genre: getGenreNames(movie.genre_ids).join(', '), // Convert genre IDs to names
        priority: 'medium', // Default priority
        description: securityUtils.sanitizeInput(movie.overview || 'Added from movie search'),
        completed: false,
        dateAdded: new Date().toLocaleDateString(),
        dateUpdated: new Date().toLocaleDateString(),
        // Additional movie-specific data
        movieData: {
          tmdbId: movie.id,
          releaseDate: movie.release_date,
          voteAverage: movie.vote_average,
          posterPath: movie.poster_path,
          addedFromMovieSearch: true
        }
      };

      // Add to existing streams
      const updatedStreams = [newStream, ...existingStreams];
      
      // Save back to localStorage
      const success = localStorageUtils.saveStreams(updatedStreams);
      
      if (success) {
        console.log('Movie added to StreamList:', movie.title);
        showNotification(`✅ "${movie.title}" added to your StreamList!`);
      } else {
        throw new Error('Failed to save to storage');
      }
    } catch (error) {
      console.error('Error adding to StreamList:', error);
      showNotification(`❌ Failed to add "${movie.title}" to StreamList. Please try again.`);
    }
  };

  // Helper function to convert genre IDs to names
  const getGenreNames = (genreIds) => {
    const genreMap = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
      99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
    };
    
    if (!Array.isArray(genreIds)) return ['Unknown'];
    
    return genreIds.map(id => genreMap[id] || 'Unknown').filter(genre => genre !== 'Unknown');
  };

  // Enhanced function to add to specific watchlist priority
  const addToStreamListWithPriority = (movie, priority = 'medium') => {
    try {
      const existingStreams = localStorageUtils.loadStreams();
      
      const isDuplicate = existingStreams.some(stream => 
        stream.title.toLowerCase() === movie.title.toLowerCase()
      );
      
      if (isDuplicate) {
        showNotification(`"${movie.title}" is already in your StreamList!`);
        return;
      }

      const newStream = {
        id: Date.now() + Math.random(),
        title: securityUtils.sanitizeInput(movie.title),
        platform: 'To Be Determined',
        genre: getGenreNames(movie.genre_ids).join(', '),
        priority: priority,
        description: securityUtils.sanitizeInput(
          movie.overview ? 
          `${movie.overview.substring(0, 200)}${movie.overview.length > 200 ? '...' : ''}` : 
          'Added from movie discovery'
        ),
        completed: false,
        dateAdded: new Date().toLocaleDateString(),
        dateUpdated: new Date().toLocaleDateString(),
        movieData: {
          tmdbId: movie.id,
          releaseDate: movie.release_date,
          voteAverage: movie.vote_average,
          posterPath: movie.poster_path,
          addedFromMovieSearch: true
        }
      };

      const updatedStreams = [newStream, ...existingStreams];
      const success = localStorageUtils.saveStreams(updatedStreams);
      
      if (success) {
        showNotification(`✅ "${movie.title}" added with ${priority} priority!`);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error adding to StreamList:', error);
      showNotification(`❌ Failed to add "${movie.title}". Please try again.`);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Movie Discovery</h1>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem' }}>
        <Icons.API /> Search movies and add them directly to your StreamList
      </p>
      
      {/* Search Form */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for movies to add to your watchlist..."
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
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            color: '#4a5568',
            background: 'rgba(102, 126, 234, 0.1)',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <Icons.Movie /> Found {movies.length} movies for "{searchQuery}" - Click to add to your StreamList!
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
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        borderRadius: '8px' 
                      }}
                    />
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%', 
                      fontSize: '3rem',
                      color: '#cbd5e0',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <Icons.Movie />
                      <span style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                        No Image Available
                      </span>
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
                    <span style={{
                      ...styles.streamBadge,
                      background: movie.vote_average >= 7 ? '#48bb78' : 
                                movie.vote_average >= 5 ? '#ffa726' : '#ff6b6b'
                    }}>
                      <Icons.Star /> {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                  {getGenreNames(movie.genre_ids).length > 0 && (
                    <span style={styles.streamBadge}>
                      <Icons.Genre /> {getGenreNames(movie.genre_ids)[0]}
                    </span>
                  )}
                </div>

                {movie.overview && (
                  <div style={styles.movieDescription}>
                    {movie.overview}
                  </div>
                )}

                {/* Enhanced Add to StreamList Options */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginTop: '1rem'
                }}>
                  <button
                    onClick={() => addToStreamList(movie)}
                    style={{
                      ...styles.button,
                      fontSize: '0.9rem',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <Icons.Add />
                    Add to StreamList
                  </button>
                  
                  {/* Priority Options */}
                  <div style={{
                    display: 'flex',
                    gap: '0.25rem',
                    justifyContent: 'space-between'
                  }}>
                    <button
                      onClick={() => addToStreamListWithPriority(movie, 'high')}
                      style={{
                        ...styles.buttonSecondary,
                        background: '#ff6b6b',
                        fontSize: '0.8rem',
                        padding: '0.5rem',
                        flex: 1
                      }}
                      title="Add as High Priority"
                    >
                      🔥 High
                    </button>
                    <button
                      onClick={() => addToStreamListWithPriority(movie, 'medium')}
                      style={{
                        ...styles.buttonSecondary,
                        background: '#ffa726',
                        fontSize: '0.8rem',
                        padding: '0.5rem',
                        flex: 1
                      }}
                      title="Add as Medium Priority"
                    >
                      ⭐ Med
                    </button>
                    <button
                      onClick={() => addToStreamListWithPriority(movie, 'low')}
                      style={{
                        ...styles.buttonSecondary,
                        background: '#4caf50',
                        fontSize: '0.8rem',
                        padding: '0.5rem',
                        flex: 1
                      }}
                      title="Add as Low Priority"
                    >
                      📅 Low
                    </button>
                  </div>
                </div>
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
            Search for movies and add them directly to your StreamList with your preferred priority level. 
            Movies will include genre information and ratings to help you decide what to watch next.
          </p>
          
          <div style={{
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{
              color: '#4a5568',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <Icons.API /> Integration Features
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#718096'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>✅ Direct integration with your StreamList</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Automatic duplicate detection</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Priority level selection (High/Med/Low)</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ Genre and rating information included</li>
              <li>✅ Cached search results for performance</li>
            </ul>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification 
          message={notification} 
          onClose={hideNotification}
        />
      )}
    </div>
  );
};

export default MoviesPage;