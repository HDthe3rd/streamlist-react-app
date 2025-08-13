import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';
import { localStorageUtils } from '../../utils/localStorageUtils';
import { securityUtils } from '../../utils/securityUtils';
import Notification from '../Notification/Notification';

// Memoized Stream Item Component for better performance
const StreamItem = memo(({ 
  stream, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  onToggleComplete,
  editFormData,
  onEditInputChange 
}) => {
  const editFormRef = useRef(null);

  // Scroll to edit form when editing starts
  useEffect(() => {
    if (isEditing && editFormRef.current) {
      setTimeout(() => {
        editFormRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [isEditing]);

  // Memoize style calculations
  const itemStyle = useMemo(() => ({
    ...styles.streamItem,
    ...(stream.completed ? styles.streamItemCompleted : {}),
    ...(isEditing ? styles.streamItemEditing : {})
  }), [stream.completed, isEditing]);

  const titleStyle = useMemo(() => ({
    ...styles.streamTitle,
    ...(stream.completed ? styles.streamTitleCompleted : {})
  }), [stream.completed]);

  // Memoize priority badge color
  const priorityBadgeColor = useMemo(() => {
    switch (stream.priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa726';
      default: return '#4caf50';
    }
  }, [stream.priority]);

  const priorityText = useMemo(() => {
    switch (stream.priority) {
      case 'high': return '🔥 HIGH';
      case 'medium': return '⭐ MEDIUM';
      default: return '📅 LOW';
    }
  }, [stream.priority]);

  // Event handlers with useCallback for performance
  const handleEdit = useCallback(() => onEdit(stream), [onEdit, stream]);
  const handleDelete = useCallback(() => onDelete(stream.id, stream.title), [onDelete, stream.id, stream.title]);
  const handleToggleComplete = useCallback(() => onToggleComplete(stream.id, stream.title), [onToggleComplete, stream.id, stream.title]);

  return (
    <div style={itemStyle}>
      <div style={styles.streamHeader}>
        <div style={titleStyle}>
          {stream.title}
          {stream.movieData?.addedFromMovieSearch && (
            <span style={{
              fontSize: '0.8rem',
              background: 'rgba(102, 126, 234, 0.2)',
              color: '#4a5568',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              marginLeft: '0.5rem'
            }}>
              🎬 From Movie Search
            </span>
          )}
        </div>
        
        <div style={styles.streamActions}>
          <button
            onClick={handleToggleComplete}
            style={{
              ...styles.buttonSuccess,
              background: stream.completed 
                ? 'linear-gradient(135deg, #ffa726, #ff9800)' 
                : 'linear-gradient(135deg, #48bb78, #38a169)'
            }}
          >
            {stream.completed ? <Icons.Incomplete /> : <Icons.Complete />}
            {stream.completed ? 'Undo' : 'Complete'}
          </button>
          
          {!isEditing && (
            <>
              <button onClick={handleEdit} style={styles.buttonSecondary}>
                <Icons.Edit />
                Edit
              </button>
              
              <button onClick={handleDelete} style={styles.deleteButton}>
                <Icons.Delete />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div style={styles.streamMeta}>
        {stream.platform && (
          <span style={styles.streamBadge}>
            <Icons.Platform /> {stream.platform}
          </span>
        )}
        {stream.genre && (
          <span style={styles.streamBadge}>
            <Icons.Genre /> {stream.genre}
          </span>
        )}
        <span style={{ ...styles.streamBadge, background: priorityBadgeColor }}>
          <Icons.Priority /> {priorityText}
        </span>
        <span style={styles.streamBadge}>
          <Icons.Date /> Added: {stream.dateAdded}
        </span>
        {stream.dateUpdated !== stream.dateAdded && (
          <span style={styles.streamBadge}>
            <Icons.Date /> Updated: {stream.dateUpdated}
          </span>
        )}
        {stream.movieData?.voteAverage && (
          <span style={{
            ...styles.streamBadge,
            background: stream.movieData.voteAverage >= 7 ? '#48bb78' : 
                      stream.movieData.voteAverage >= 5 ? '#ffa726' : '#ff6b6b'
          }}>
            <Icons.Star /> {stream.movieData.voteAverage}/10
          </span>
        )}
      </div>

      {stream.description && (
        <div style={styles.streamDescription}>
          {stream.description}
        </div>
      )}

      {/* Edit Form with smooth scrolling */}
      {isEditing && (
        <div ref={editFormRef} style={styles.editForm}>
          <h4 style={{ color: '#4a5568', marginBottom: '1rem' }}>Edit Stream</h4>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              name="title"
              type="text"
              value={editFormData.title || ''}
              onChange={onEditInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Platform</label>
            <input
              name="platform"
              type="text"
              value={editFormData.platform || ''}
              onChange={onEditInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Genre</label>
            <input
              name="genre"
              type="text"
              value={editFormData.genre || ''}
              onChange={onEditInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Priority</label>
            <select
              name="priority"
              value={editFormData.priority || 'medium'}
              onChange={onEditInputChange}
              style={styles.select}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={editFormData.description || ''}
              onChange={onEditInputChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.editFormActions}>
            <button
              onClick={onSave}
              style={styles.buttonSuccess}
              disabled={!editFormData.title?.trim()}
            >
              <Icons.Save />
              Save Changes
            </button>
            <button onClick={onCancel} style={styles.deleteButton}>
              <Icons.Cancel />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Performance-optimized StreamListPage Component with fixes
const StreamListPage = () => {
  const [streams, setStreams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [notification, setNotification] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterBy, setFilterBy] = useState('all');

  // Form state with explicit initial values
  const initialFormState = {
    title: '',
    platform: '',
    genre: '',
    priority: 'medium',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for form inputs to help with clearing
  const titleInputRef = useRef(null);

  // Debounced localStorage save
  const debouncedSave = useMemo(() => {
    let timeoutId;
    return (streams) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (streams.length > 0) {
          localStorageUtils.saveStreams(streams);
        }
      }, 500);
    };
  }, []);

  // Load data on mount
  useEffect(() => {
    const savedStreams = localStorageUtils.loadStreams();
    if (savedStreams.length > 0) {
      setStreams(savedStreams);
      showNotification(`Loaded ${savedStreams.length} items from previous session`);
    }
  }, []);

  // Debounced save when streams change
  useEffect(() => {
    if (streams.length > 0) {
      debouncedSave(streams);
    }
  }, [streams, debouncedSave]);

  // Memoized filtered and sorted streams
  const filteredAndSortedStreams = useMemo(() => {
    let filtered = streams;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = streams.filter(stream =>
        stream.title.toLowerCase().includes(term) ||
        (stream.platform && stream.platform.toLowerCase().includes(term)) ||
        (stream.genre && stream.genre.toLowerCase().includes(term)) ||
        (stream.description && stream.description.toLowerCase().includes(term))
      );
    }

    // Filter by completion status
    if (filterBy === 'completed') {
      filtered = filtered.filter(stream => stream.completed);
    } else if (filterBy === 'incomplete') {
      filtered = filtered.filter(stream => !stream.completed);
    }

    // Sort streams
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dateAdded':
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });
  }, [streams, searchTerm, sortBy, filterBy]);

  // Memoized statistics
  const statistics = useMemo(() => {
    const total = streams.length;
    const completed = streams.filter(s => s.completed).length;
    return {
      total,
      completed,
      remaining: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [streams]);

  // Optimized event handlers with useCallback
  const showNotification = useCallback((message) => {
    setNotification(message);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification('');
  }, []);

  // Enhanced form input handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const sanitizedValue = securityUtils.sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  // Enhanced clear form function
  const clearForm = useCallback(() => {
    console.log('Clearing form...');
    
    // Reset form data to initial state
    setFormData(initialFormState);
    setErrors({});
    
    // Force form inputs to clear by directly setting values
    const inputs = document.querySelectorAll('form input, form textarea, form select');
    inputs.forEach(input => {
      if (input.name === 'title' || input.name === 'platform' || input.name === 'genre' || input.name === 'description') {
        input.value = '';
      } else if (input.name === 'priority') {
        input.value = 'medium';
      }
    });
    
    // Focus back to title input
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
    
    console.log('Form cleared successfully');
  }, []);

  // Enhanced add stream function
  const handleAddStream = useCallback(async () => {
    console.log('Adding stream with data:', formData);
    setIsSubmitting(true);
    
    try {
      // Validate form
      const validation = securityUtils.validateStreamData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        showNotification('Please fix the errors in the form');
        return;
      }

      const newStream = {
        id: Date.now() + Math.random(), // Better ID generation
        ...formData,
        completed: false,
        dateAdded: new Date().toLocaleDateString(),
        dateUpdated: new Date().toLocaleDateString()
      };
      
      setStreams(prev => [newStream, ...prev]);
      showNotification(`✅ "${newStream.title}" added to your stream list!`);
      
      console.log('Stream added successfully:', newStream.title);
      
      // Clear form after successful addition - with delay to ensure state update
      setTimeout(() => {
        clearForm();
      }, 100);
      
    } catch (error) {
      console.error('Error adding stream:', error);
      showNotification('❌ Error adding stream. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, showNotification, clearForm]);

  const handleEdit = useCallback((stream) => {
    setEditingId(stream.id);
    setEditFormData({
      title: stream.title,
      platform: stream.platform,
      genre: stream.genre,
      priority: stream.priority,
      description: stream.description
    });
  }, []);

  const handleEditInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const sanitizedValue = securityUtils.sanitizeInput(value);
    setEditFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  }, []);

  const handleSaveEdit = useCallback(() => {
    const validation = securityUtils.validateStreamData(editFormData);
    if (!validation.isValid) {
      showNotification('Please fix validation errors');
      return;
    }

    setStreams(prev => prev.map(stream => 
      stream.id === editingId 
        ? { ...stream, ...editFormData, dateUpdated: new Date().toLocaleDateString() }
        : stream
    ));
    setEditingId(null);
    setEditFormData({});
    showNotification('✅ Stream updated successfully!');
  }, [editFormData, editingId, showNotification]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditFormData({});
  }, []);

  const handleDelete = useCallback((id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setStreams(prev => prev.filter(stream => stream.id !== id));
      showNotification(`🗑️ "${title}" removed from your list`);
    }
  }, [showNotification]);

  const handleToggleComplete = useCallback((id, title) => {
    setStreams(prev => prev.map(stream => 
      stream.id === id 
        ? { ...stream, completed: !stream.completed, dateUpdated: new Date().toLocaleDateString() }
        : stream
    ));
    const stream = streams.find(s => s.id === id);
    const action = stream?.completed ? 'marked as incomplete' : 'completed';
    showNotification(`${stream?.completed ? '↩️' : '✅'} "${title}" ${action}!`);
  }, [streams, showNotification]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setStreams([]);
      localStorageUtils.clearStreams();
      showNotification('🧹 All data cleared');
    }
  }, [showNotification]);

  // Enhanced search function with better feedback
  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      showNotification(`🔍 Searching for "${searchTerm}"`);
    } else {
      showNotification('📋 Showing all streams');
    }
  }, [searchTerm, showNotification]);

  // Enhanced reset function to show full queue
  const showFullQueue = useCallback(() => {
    setSearchTerm('');
    setFilterBy('all');
    setSortBy('dateAdded');
    showNotification('📋 Showing your complete streaming queue');
  }, [showNotification]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (e.target.name === 'search') {
        handleSearch();
      } else if (e.target.type !== 'textarea') {
        e.preventDefault();
        handleAddStream();
      }
    }
  }, [handleSearch, handleAddStream]);

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>My Enhanced Streaming List</h1>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem' }}>
        <Icons.Database /> Performance-optimized with secure data storage
      </p>
      
      {/* Statistics Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={styles.streamBadge}>
          📊 Total: {statistics.total}
        </div>
        <div style={styles.streamBadge}>
          ✅ Completed: {statistics.completed}
        </div>
        <div style={styles.streamBadge}>
          ⏳ Remaining: {statistics.remaining}
        </div>
        <div style={styles.streamBadge}>
          📈 {statistics.completionRate}% Complete
        </div>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr auto 1fr 1fr',
        gap: '1rem',
        marginBottom: '2rem',
        alignItems: 'end'
      }}>
        <input
          name="search"
          type="text"
          placeholder="Search streams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button
            onClick={handleSearch}
            style={{
              ...styles.buttonSecondary, 
              height: 'fit-content', 
              padding: '1rem 1.25rem',
              minWidth: '100px'
            }}
          >
            <Icons.Search />
            Search
          </button>
          <button
            onClick={showFullQueue}
            style={{
              ...styles.button, 
              height: 'fit-content', 
              padding: '1rem 1.25rem', 
              fontSize: '0.9rem',
              minWidth: '120px'
            }}
            title="Show complete queue"
          >
            <Icons.Home />
            Full Queue
          </button>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.select}
        >
          <option value="dateAdded">Sort by Date Added</option>
          <option value="title">Sort by Title</option>
          <option value="priority">Sort by Priority</option>
        </select>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Streams</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {/* Enhanced Add New Stream Form */}
      <form style={styles.streamForm} onSubmit={(e) => e.preventDefault()}>
        <h3 style={{ textAlign: 'center', color: '#4a5568', marginBottom: '1.5rem' }}>
          Add New Stream
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div style={styles.inputGroup}>
            <input
              ref={titleInputRef}
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter title *"
              style={styles.input}
            />
            {errors.title && <span style={{ color: '#e53e3e', fontSize: '0.8rem' }}>{errors.title}</span>}
          </div>

          <input
            name="platform"
            type="text"
            value={formData.platform}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Platform"
            style={styles.input}
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input
            name="genre"
            type="text"
            value={formData.genre}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Genre"
            style={styles.input}
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description/Notes"
            style={{...styles.textarea, minHeight: '40px'}}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '1rem',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap'
        }}>
          <button 
            type="button"
            onClick={handleAddStream}
            style={{
              ...styles.button,
              border: '2px solid #667eea',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              fontWeight: '600',
              minWidth: '140px',
              position: 'relative',
              overflow: 'hidden'
            }}
            disabled={isSubmitting || !formData.title.trim()}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            <Icons.Add />
            {isSubmitting ? 'Adding...' : 'Add Stream'}
          </button>
          
          <button 
            type="button"
            onClick={clearForm}
            style={{
              ...styles.buttonSecondary,
              minWidth: '120px'
            }}
            disabled={isSubmitting}
          >
            <Icons.Cancel />
            Clear Form
          </button>
          
          {streams.length > 0 && (
            <button 
              type="button"
              onClick={handleClearAll} 
              style={{
                ...styles.deleteButton,
                minWidth: '110px'
              }}
            >
              <Icons.Delete />
              Clear All
            </button>
          )}
        </div>
      </form>

      {/* Stream List Display */}
      {filteredAndSortedStreams.length > 0 && (
        <div style={styles.streamList}>
          <div style={styles.streamListHeader}>
            <h3 style={styles.streamListTitle}>
              {searchTerm || filterBy !== 'all' ? 'Filtered Results' : 'Your Complete Streaming Queue'} ({filteredAndSortedStreams.length} items)
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredAndSortedStreams.map((stream) => (
              <StreamItem
                key={stream.id}
                stream={stream}
                isEditing={editingId === stream.id}
                onEdit={handleEdit}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
                editFormData={editFormData}
                onEditInputChange={handleEditInputChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Enhanced No results message */}
      {filteredAndSortedStreams.length === 0 && streams.length > 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
          <Icons.Search style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <p>No streams found matching your search criteria.</p>
          <button 
            onClick={showFullQueue}
            style={styles.button}
          >
            <Icons.Home />
            Show Full Queue
          </button>
        </div>
      )}

      {/* Empty state */}
      {streams.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
          <Icons.Stream style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <p>Your streaming queue is empty. Add some movies or shows to get started!</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
            💡 Tip: You can also discover and add movies from the Movies page!
          </p>
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

export default StreamListPage;