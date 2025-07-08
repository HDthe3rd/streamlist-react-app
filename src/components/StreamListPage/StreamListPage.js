import React, { useState } from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

const StreamListPage = () => {
  const [streams, setStreams] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    genre: '',
    priority: 'medium',
    description: ''
  });
  const [focusedInput, setFocusedInput] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Log input to console as required by specifications
    console.log(`Input changed - ${name}: ${value}`);
    console.log('Current form data:', { ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData.title.trim()) {
      const newStream = {
        id: Date.now(),
        ...formData,
        dateAdded: new Date().toLocaleDateString()
      };
      
      setStreams(prev => [newStream, ...prev]);
      console.log('New stream added:', newStream);
      console.log('Current stream list:', [...streams, newStream]);
      
      // Reset form
      setFormData({
        title: '',
        platform: '',
        genre: '',
        priority: 'medium',
        description: ''
      });
    }
  };

  const handleDelete = (id) => {
    setStreams(prev => prev.filter(stream => stream.id !== id));
    console.log('Stream deleted:', id);
    console.log('Updated stream list:', streams.filter(stream => stream.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'textarea') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>My Streaming List</h1>
      
      <div style={styles.streamForm}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Title *
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter movie or show title"
            style={{
              ...styles.input,
              ...(focusedInput === 'title' ? styles.inputFocus : {})
            }}
            onFocus={() => setFocusedInput('title')}
            onBlur={() => setFocusedInput(null)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Streaming Platform
          </label>
          <input
            name="platform"
            type="text"
            value={formData.platform}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Netflix, Hulu, Disney+"
            style={{
              ...styles.input,
              ...(focusedInput === 'platform' ? styles.inputFocus : {})
            }}
            onFocus={() => setFocusedInput('platform')}
            onBlur={() => setFocusedInput(null)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Genre
          </label>
          <input
            name="genre"
            type="text"
            value={formData.genre}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Action, Comedy, Drama"
            style={{
              ...styles.input,
              ...(focusedInput === 'genre' ? styles.inputFocus : {})
            }}
            onFocus={() => setFocusedInput('genre')}
            onBlur={() => setFocusedInput(null)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            style={{
              ...styles.select,
              ...(focusedInput === 'priority' ? styles.inputFocus : {})
            }}
            onFocus={() => setFocusedInput('priority')}
            onBlur={() => setFocusedInput(null)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Notes/Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add any notes about why you want to watch this..."
            style={{
              ...styles.textarea,
              ...(focusedInput === 'description' ? styles.inputFocus : {})
            }}
            onFocus={() => setFocusedInput('description')}
            onBlur={() => setFocusedInput(null)}
          />
        </div>

        <button 
          onClick={handleSubmit}
          style={styles.button}
          onMouseEnter={(e) => {
            Object.assign(e.target.style, styles.buttonHover);
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
          disabled={!formData.title.trim()}
        >
          <Icons.Add />
          Add to Stream List
        </button>
      </div>

      {streams.length > 0 && (
        <div style={styles.streamList}>
          <h3 style={{ color: '#4a5568', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Your Streaming Queue ({streams.length} items)
          </h3>
          {streams.map((stream) => (
            <div
              key={stream.id}
              style={styles.streamItem}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, styles.streamItemHover);
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={styles.streamTitle}>{stream.title}</div>
              <div style={styles.streamMeta}>
                {stream.platform && (
                  <span style={styles.streamBadge}>📺 {stream.platform}</span>
                )}
                {stream.genre && (
                  <span style={styles.streamBadge}>🎭 {stream.genre}</span>
                )}
                <span style={{
                  ...styles.streamBadge,
                  background: stream.priority === 'high' ? '#ff6b6b' : 
                            stream.priority === 'medium' ? '#ffa726' : '#4caf50'
                }}>
                  {stream.priority === 'high' ? '🔥' : 
                   stream.priority === 'medium' ? '⭐' : '📅'} {stream.priority.toUpperCase()}
                </span>
                <span style={styles.streamBadge}>🗓️ {stream.dateAdded}</span>
              </div>
              {stream.description && (
                <div style={styles.streamDescription}>
                  {stream.description}
                </div>
              )}
              <button
                onClick={() => handleDelete(stream.id)}
                style={styles.deleteButton}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ff3742';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ff4757';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <Icons.Delete /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreamListPage;