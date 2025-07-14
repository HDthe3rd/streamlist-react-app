import React, { useState } from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';
import Notification from '../Notification/Notification';

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
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
  };

  const hideNotification = () => {
    setNotification('');
  };

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

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(`Edit input changed - ${name}: ${value}`);
  };

  const handleSubmit = () => {
    if (formData.title.trim()) {
      const newStream = {
        id: Date.now(),
        ...formData,
        completed: false,
        dateAdded: new Date().toLocaleDateString(),
        dateUpdated: new Date().toLocaleDateString()
      };
      
      setStreams(prev => [newStream, ...prev]);
      console.log('New stream added:', newStream);
      
      // Clear form as required
      setFormData({
        title: '',
        platform: '',
        genre: '',
        priority: 'medium',
        description: ''
      });
      
      showNotification(`"${newStream.title}" added to your stream list!`);
    }
  };

  const handleEdit = (stream) => {
    setEditingId(stream.id);
    setEditFormData({
      title: stream.title,
      platform: stream.platform,
      genre: stream.genre,
      priority: stream.priority,
      description: stream.description
    });
    console.log('Editing stream:', stream.title);
  };

  const handleSaveEdit = () => {
    setStreams(prev => prev.map(stream => 
      stream.id === editingId 
        ? { ...stream, ...editFormData, dateUpdated: new Date().toLocaleDateString() }
        : stream
    ));
    setEditingId(null);
    setEditFormData({});
    console.log('Stream updated:', editFormData.title);
    showNotification('Stream updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
    console.log('Edit cancelled');
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setStreams(prev => prev.filter(stream => stream.id !== id));
      console.log('Stream deleted:', title);
      showNotification(`"${title}" removed from your list`);
    }
  };

  const handleToggleComplete = (id, title) => {
    setStreams(prev => prev.map(stream => 
      stream.id === id 
        ? { ...stream, completed: !stream.completed, dateUpdated: new Date().toLocaleDateString() }
        : stream
    ));
    const stream = streams.find(s => s.id === id);
    const action = stream.completed ? 'marked as incomplete' : 'completed';
    console.log(`Stream ${action}:`, title);
    showNotification(`"${title}" ${action}!`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'textarea') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const completedCount = streams.filter(s => s.completed).length;
  const totalCount = streams.length;

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>My Enhanced Streaming List</h1>
      
      {/* Add New Stream Form */}
      <div style={styles.streamForm}>
        <h3 style={{ textAlign: 'center', color: '#4a5568', marginBottom: '1.5rem' }}>
          Add New Stream
        </h3>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Icons.Stream /> Title *
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
            <Icons.Platform /> Streaming Platform
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
            <Icons.Genre /> Genre
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
            <Icons.Priority /> Priority
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

      {/* Stream List Display */}
      {streams.length > 0 && (
        <div style={styles.streamList}>
          <div style={styles.streamListHeader}>
            <h3 style={styles.streamListTitle}>
              Your Streaming Queue
            </h3>
            <div style={styles.streamListStats}>
              <span>Total: {totalCount}</span>
              <span>Completed: {completedCount}</span>
              <span>Remaining: {totalCount - completedCount}</span>
            </div>
          </div>
          
          {streams.map((stream) => (
            <div
              key={stream.id}
              style={{
                ...styles.streamItem,
                ...(stream.completed ? styles.streamItemCompleted : {}),
                ...(editingId === stream.id ? styles.streamItemEditing : {})
              }}
              onMouseEnter={(e) => {
                if (editingId !== stream.id) {
                  Object.assign(e.target.style, styles.streamItemHover);
                }
              }}
              onMouseLeave={(e) => {
                if (editingId !== stream.id) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              <div style={styles.streamHeader}>
                <div style={{
                  ...styles.streamTitle,
                  ...(stream.completed ? styles.streamTitleCompleted : {})
                }}>
                  {stream.title}
                </div>
                
                <div style={styles.streamActions}>
                  <button
                    onClick={() => handleToggleComplete(stream.id, stream.title)}
                    style={{
                      ...styles.buttonSuccess,
                      background: stream.completed 
                        ? 'linear-gradient(135deg, #ffa726, #ff9800)' 
                        : 'linear-gradient(135deg, #48bb78, #38a169)'
                    }}
                    title={stream.completed ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {stream.completed ? <Icons.Incomplete /> : <Icons.Complete />}
                    {stream.completed ? 'Undo' : 'Complete'}
                  </button>
                  
                  {editingId !== stream.id && (
                    <>
                      <button
                        onClick={() => handleEdit(stream)}
                        style={styles.buttonSecondary}
                        title="Edit this stream"
                      >
                        <Icons.Edit />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(stream.id, stream.title)}
                        style={styles.deleteButton}
                        title="Delete this stream"
                      >
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
                <span style={{
                  ...styles.streamBadge,
                  background: stream.priority === 'high' ? '#ff6b6b' : 
                            stream.priority === 'medium' ? '#ffa726' : '#4caf50'
                }}>
                  <Icons.Priority />
                  {stream.priority === 'high' ? '🔥 HIGH' : 
                   stream.priority === 'medium' ? '⭐ MEDIUM' : '📅 LOW'}
                </span>
                <span style={styles.streamBadge}>
                  <Icons.Date /> Added: {stream.dateAdded}
                </span>
                {stream.dateUpdated !== stream.dateAdded && (
                  <span style={styles.streamBadge}>
                    <Icons.Date /> Updated: {stream.dateUpdated}
                  </span>
                )}
              </div>

              {stream.description && (
                <div style={styles.streamDescription}>
                  {stream.description}
                </div>
              )}

              {/* Edit Form */}
              {editingId === stream.id && (
                <div style={styles.editForm}>
                  <h4 style={{ color: '#4a5568', marginBottom: '1rem' }}>Edit Stream</h4>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Title</label>
                    <input
                      name="title"
                      type="text"
                      value={editFormData.title || ''}
                      onChange={handleEditInputChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Platform</label>
                    <input
                      name="platform"
                      type="text"
                      value={editFormData.platform || ''}
                      onChange={handleEditInputChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Genre</label>
                    <input
                      name="genre"
                      type="text"
                      value={editFormData.genre || ''}
                      onChange={handleEditInputChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Priority</label>
                    <select
                      name="priority"
                      value={editFormData.priority || 'medium'}
                      onChange={handleEditInputChange}
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
                      onChange={handleEditInputChange}
                      style={styles.textarea}
                    />
                  </div>

                  <div style={styles.editFormActions}>
                    <button
                      onClick={handleSaveEdit}
                      style={styles.buttonSuccess}
                      disabled={!editFormData.title?.trim()}
                    >
                      <Icons.Save />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={styles.deleteButton}
                    >
                      <Icons.Cancel />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
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