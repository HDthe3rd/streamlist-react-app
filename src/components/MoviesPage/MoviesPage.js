// src/components/MoviesPage/MoviesPage.js - Enhanced with Cart Integration
import { useState } from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';
import { localStorageUtils } from '../../utils/localStorageUtils';
import { securityUtils } from '../../utils/securityUtils';
import { cartUtils } from '../../utils/cartUtils';
import { tmdbAPI } from '../../services/tmdbAPI';
import Notification from '../Notification/Notification';

// Enhanced Movies Page Component with cart integration
const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated'));
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Enhanced function to add movies to StreamList
  const addToStreamList = (movie) => {
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
        priority: 'medium',
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
        showNotification(`📺 "${movie.title}" added to your StreamList!`);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error adding to StreamList:', error);
      showNotification(`❌ Failed to add "${movie.title}" to StreamList. Please try again.`);
    }
  };

  // New function to add movies to cart
  const addToCart = (movie, accessType = 'rental') => {
    try {
      cartUtils.addMovieToCart(movie, accessType);
      const price = accessType === 'rental' ? cartUtils.PRICING.MOVIE_RENTAL : cartUtils.PRICING.MOVIE_PURCHASE;
      
      showNotification(
        `🛒 "${movie.title}" (${accessType}) added to cart for ${cartUtils.formatCurrency(price)}!`
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification(`❌ Failed to add "${movie.title}" to cart. Please try again.`);
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

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Movie Discovery & Shopping</h1>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem' }}>
        <Icons.API /> Search movies, add to your StreamList, or purchase/rent directly
      </p>
      
      {/* Search Form */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for movies to add to StreamList or Cart..."
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

      {/* Pricing Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
        maxWidth: '800px',
        margin: '0 auto 2rem auto'
      }}>
        <div style={{
          ...styles.streamBadge,
          background: 'linear-gradient(135deg, #4299e1, #667eea)',
          padding: '1rem',
          justifyContent: 'center',
          fontSize: '0.9rem'
        }}>
          📅 Rentals from {cartUtils.formatCurrency(cartUtils.PRICING.MOVIE_RENTAL)}
        </div>
        <div style={{
          ...styles.streamBadge,
          background: 'linear-gradient(135deg, #48bb78, #38a169)',
          padding: '1rem',
          justifyContent: 'center',
          fontSize: '0.9rem'
        }}>
          💾 Purchases from {cartUtils.formatCurrency(cartUtils.PRICING.MOVIE_PURCHASE)}
        </div>
        <div style={{
          ...styles.streamBadge,
          background: 'linear-gradient(135deg, #ffa726, #ff9800)',
          padding: '1rem',
          justifyContent: 'center',
          fontSize: '0.9rem'
        }}>
          📺 StreamList FREE
        </div>
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
            <Icons.Movie /> Found {movies.length} movies for "{searchQuery}" 
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
                {/* Movie Poster */}
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

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginTop: '1.25rem',
                  padding: '0 0.5rem'
                }}>
                  {/* Add to StreamList - Free */}
                  <button
                    onClick={() => addToStreamList(movie)}
                    style={{
                      ...styles.buttonSuccess,
                      fontSize: '0.9rem',
                      padding: '0.875rem 1.25rem'
                    }}
                  >
                    <Icons.Add />
                    Add to StreamList (FREE)
                  </button>
                  
                  {/* Purchase/Rental Options */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem'
                  }}>
                    <button
                      onClick={() => addToCart(movie, 'rental')}
                      style={{
                        ...styles.buttonSecondary,
                        fontSize: '0.85rem',
                        padding: '0.75rem 0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.375rem',
                        minHeight: '80px'
                      }}
                    >
                      <Icons.Calendar />
                      <span>Rent</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {cartUtils.formatCurrency(cartUtils.PRICING.MOVIE_RENTAL)}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => addToCart(movie, 'purchase')}
                      style={{
                        ...styles.button,
                        fontSize: '0.85rem',
                        padding: '0.75rem 0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.375rem',
                        minHeight: '80px'
                      }}
                    >
                      <Icons.Save />
                      <span>Buy</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {cartUtils.formatCurrency(cartUtils.PRICING.MOVIE_PURCHASE)}
                      </span>
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
          <h2 style={styles.comingSoonTitle}>Movie Discovery & Shopping</h2>
          <p style={styles.comingSoonText}>
            Search for movies and choose how you want to enjoy them:
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
            textAlign: 'left'
          }}>
            <div style={{
              background: 'rgba(72, 187, 120, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '2px solid rgba(72, 187, 120, 0.2)'
            }}>
              <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>
                📺 Add to StreamList (FREE)
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#718096' }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ Track movies you want to watch</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Organize by priority</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Add personal notes</li>
                <li>✓ Completely free</li>
              </ul>
            </div>
            
            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '2px solid rgba(102, 126, 234, 0.2)'
            }}>
              <h3 style={{ color: '#4299e1', marginBottom: '1rem' }}>
                📅 Rent Movies
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#718096' }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ Stream for 48 hours</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ HD quality</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Instant access</li>
                <li>✓ From {cartUtils.formatCurrency(cartUtils.PRICING.MOVIE_RENTAL)}</li>
              </ul>
            </div>
            
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '2px solid rgba(255, 107, 107, 0.2)'
            }}>
              <h3 style={{ color: '#e53e3e', marginBottom: '1rem' }}>
                💾 Purchase Movies
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#718096' }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ Own forever</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ 4K UHD quality</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Download offline</li>
                <li>✓ From {cartUtils.formatCurrency(cartUtils.PRICING.MOVIE_PURCHASE)}</li>
              </ul>
            </div>
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