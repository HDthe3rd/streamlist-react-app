// Enhanced Security Utils - Replace/enhance your passwordSecurity.js
import { useState } from 'react';
import bcrypt from 'bcryptjs'; // npm install bcryptjs

export const securityUtils = {
  // Input validation and sanitization
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>"'&]/g, (match) => {
        const escapeMap = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return escapeMap[match];
      })
      .slice(0, 1000); // Prevent extremely long inputs
  },

  // Validate stream form data
  validateStreamData: (formData) => {
    const errors = {};
    
    // Title validation
    if (!formData.title || formData.title.trim().length === 0) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length > 200) {
      errors.title = 'Title must be less than 200 characters';
    }
    
    // Platform validation
    if (formData.platform && formData.platform.length > 50) {
      errors.platform = 'Platform name must be less than 50 characters';
    }
    
    // Genre validation
    if (formData.genre && formData.genre.length > 100) {
      errors.genre = 'Genre must be less than 100 characters';
    }
    
    // Priority validation
    const validPriorities = ['low', 'medium', 'high'];
    if (formData.priority && !validPriorities.includes(formData.priority)) {
      errors.priority = 'Invalid priority level';
    }
    
    // Description validation
    if (formData.description && formData.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Enhanced password security (replacing your simple hash)
  hashPassword: async (password) => {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Failed to hash password');
    }
  },

  verifyPassword: async (password, hashedPassword) => {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  },

  // Rate limiting for API calls
  rateLimiter: {
    requests: new Map(),
    
    isAllowed: (key, maxRequests = 100, windowMs = 15 * 60 * 1000) => {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      if (!securityUtils.rateLimiter.requests.has(key)) {
        securityUtils.rateLimiter.requests.set(key, []);
      }
      
      const requests = securityUtils.rateLimiter.requests.get(key);
      
      // Remove old requests outside the window
      const recentRequests = requests.filter(timestamp => timestamp > windowStart);
      securityUtils.rateLimiter.requests.set(key, recentRequests);
      
      if (recentRequests.length >= maxRequests) {
        return false;
      }
      
      recentRequests.push(now);
      return true;
    }
  },

  // CSRF token generation and validation
  generateCSRFToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = btoa(String.fromCharCode.apply(null, array));
    sessionStorage.setItem('csrf_token', token);
    return token;
  },

  validateCSRFToken: (token) => {
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === storedToken;
  },

  // Secure localStorage wrapper
  secureStorage: {
    setItem: (key, value) => {
      try {
        const encrypted = btoa(JSON.stringify({
          data: value,
          timestamp: Date.now()
        }));
        localStorage.setItem(key, encrypted);
      } catch (error) {
        console.error('Secure storage set error:', error);
      }
    },

    getItem: (key, maxAge = 24 * 60 * 60 * 1000) => {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return null;
        
        const decoded = JSON.parse(atob(stored));
        const age = Date.now() - decoded.timestamp;
        
        if (age > maxAge) {
          localStorage.removeItem(key);
          return null;
        }
        
        return decoded.data;
      } catch (error) {
        console.error('Secure storage get error:', error);
        localStorage.removeItem(key); // Remove corrupted data
        return null;
      }
    },

    removeItem: (key) => {
      localStorage.removeItem(key);
    }
  },

  // Content Security Policy helpers
  generateNonce: () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array));
  },

  // API request security wrapper
  secureApiRequest: async (url, options = {}) => {
    const csrfToken = securityUtils.generateCSRFToken();
    
    const secureOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      },
      credentials: 'same-origin' // Include cookies for same-origin requests
    };

    try {
      const response = await fetch(url, secureOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error('Secure API request failed:', error);
      throw error;
    }
  }
};

// Custom hook for secure form handling
export const useSecureForm = (initialData, validationFn) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
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
  };

  const validateForm = () => {
    const validation = validationFn(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (submitFn) => {
    setIsSubmitting(true);
    
    try {
      if (!validateForm()) {
        return false;
      }
      
      await submitFn(formData);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    validateForm
  };
};