// Enhanced Cart Utilities with e-commerce functionality
import { securityUtils } from './securityUtils';

export const cartUtils = {
  // Cart item types
  ITEM_TYPES: {
    MOVIE: 'movie',
    STREAM_ACCESS: 'stream_access',
    PREMIUM_FEATURE: 'premium_feature',
    SUBSCRIPTION: 'subscription'
  },

  // Pricing tiers
  PRICING: {
    MOVIE_RENTAL: 3.99,
    MOVIE_PURCHASE: 12.99,
    STREAM_ACCESS: 2.99,
    PREMIUM_MONTHLY: 9.99,
    PREMIUM_YEARLY: 99.99
  },

  // Load cart from secure storage
  loadCart: () => {
    try {
      const cart = securityUtils.secureStorage.getItem('streamlist_cart', 24 * 60 * 60 * 1000);
      if (cart && Array.isArray(cart.items)) {
        return {
          items: cart.items,
          total: cart.total || 0,
          tax: cart.tax || 0,
          grandTotal: cart.grandTotal || 0,
          lastUpdated: cart.lastUpdated || Date.now(),
          promoCode: cart.promoCode || null,
          discount: cart.discount || 0
        };
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
    return cartUtils.createEmptyCart();
  },

  // Create empty cart
  createEmptyCart: () => ({
    items: [],
    total: 0,
    tax: 0,
    grandTotal: 0,
    lastUpdated: Date.now(),
    promoCode: null,
    discount: 0
  }),

  // Save cart to secure storage
  saveCart: (cart) => {
    try {
      const cartToSave = {
        ...cart,
        lastUpdated: Date.now()
      };
      securityUtils.secureStorage.setItem('streamlist_cart', cartToSave);
      console.log('Cart saved successfully:', cart.items.length, 'items');
      return true;
    } catch (error) {
      console.error('Error saving cart:', error);
      return false;
    }
  },

  // Add movie to cart
  addMovieToCart: (movie, accessType = 'rental') => {
    const cart = cartUtils.loadCart();
    const price = accessType === 'rental' ? cartUtils.PRICING.MOVIE_RENTAL : cartUtils.PRICING.MOVIE_PURCHASE;
    
    const existingItemIndex = cart.items.findIndex(
      item => item.type === cartUtils.ITEM_TYPES.MOVIE && 
               item.movieId === movie.id && 
               item.accessType === accessType
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      cart.items[existingItemIndex].quantity += 1;
      cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].quantity * price;
    } else {
      // Add new item
      const cartItem = {
        id: `movie_${movie.id}_${accessType}_${Date.now()}`,
        type: cartUtils.ITEM_TYPES.MOVIE,
        movieId: movie.id,
        title: securityUtils.sanitizeInput(movie.title),
        accessType: accessType,
        price: price,
        quantity: 1,
        totalPrice: price,
        description: securityUtils.sanitizeInput(movie.overview || ''),
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        addedAt: Date.now()
      };
      cart.items.push(cartItem);
    }

    const updatedCart = cartUtils.calculateTotals(cart);
    cartUtils.saveCart(updatedCart);
    return updatedCart;
  },

  // Add stream access to cart
  addStreamAccessToCart: (stream) => {
    const cart = cartUtils.loadCart();
    const price = cartUtils.PRICING.STREAM_ACCESS;
    
    const existingItemIndex = cart.items.findIndex(
      item => item.type === cartUtils.ITEM_TYPES.STREAM_ACCESS && item.streamId === stream.id
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += 1;
      cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].quantity * price;
    } else {
      const cartItem = {
        id: `stream_${stream.id}_${Date.now()}`,
        type: cartUtils.ITEM_TYPES.STREAM_ACCESS,
        streamId: stream.id,
        title: securityUtils.sanitizeInput(stream.title),
        platform: securityUtils.sanitizeInput(stream.platform || 'Multiple Platforms'),
        price: price,
        quantity: 1,
        totalPrice: price,
        description: securityUtils.sanitizeInput(stream.description || 'Premium streaming access'),
        priority: stream.priority,
        addedAt: Date.now()
      };
      cart.items.push(cartItem);
    }

    const updatedCart = cartUtils.calculateTotals(cart);
    cartUtils.saveCart(updatedCart);
    return updatedCart;
  },

  // Add subscription to cart
  addSubscriptionToCart: (subscriptionType = 'monthly') => {
    const cart = cartUtils.loadCart();
    const price = subscriptionType === 'monthly' ? 
      cartUtils.PRICING.PREMIUM_MONTHLY : 
      cartUtils.PRICING.PREMIUM_YEARLY;
    
    // Remove existing subscription if any
    cart.items = cart.items.filter(item => item.type !== cartUtils.ITEM_TYPES.SUBSCRIPTION);
    
    const cartItem = {
      id: `subscription_${subscriptionType}_${Date.now()}`,
      type: cartUtils.ITEM_TYPES.SUBSCRIPTION,
      subscriptionType: subscriptionType,
      title: `StreamList Pro ${subscriptionType === 'monthly' ? 'Monthly' : 'Annual'} Subscription`,
      price: price,
      quantity: 1,
      totalPrice: price,
      description: `Premium features including unlimited movie discovery, advanced analytics, and priority support`,
      duration: subscriptionType === 'monthly' ? '1 month' : '12 months',
      features: [
        'Unlimited movie discovery',
        'Advanced search and filtering',
        'Export and import capabilities',
        'Priority customer support',
        'Ad-free experience',
        'Early access to new features'
      ],
      addedAt: Date.now()
    };
    
    cart.items.push(cartItem);
    const updatedCart = cartUtils.calculateTotals(cart);
    cartUtils.saveCart(updatedCart);
    return updatedCart;
  },

  // Update item quantity
  updateItemQuantity: (itemId, quantity) => {
    const cart = cartUtils.loadCart();
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].totalPrice = cart.items[itemIndex].price * quantity;
      }
      
      const updatedCart = cartUtils.calculateTotals(cart);
      cartUtils.saveCart(updatedCart);
      return updatedCart;
    }
    
    return cart;
  },

  // Remove item from cart
  removeItem: (itemId) => {
    const cart = cartUtils.loadCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    
    const updatedCart = cartUtils.calculateTotals(cart);
    cartUtils.saveCart(updatedCart);
    return updatedCart;
  },

  // Clear entire cart
  clearCart: () => {
    const emptyCart = cartUtils.createEmptyCart();
    cartUtils.saveCart(emptyCart);
    return emptyCart;
  },

  // Calculate totals
  calculateTotals: (cart) => {
    const total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = cartUtils.calculateDiscount(cart);
    const subtotal = total - discount;
    const tax = subtotal * 0.0875; // 8.75% tax rate
    const grandTotal = subtotal + tax;

    return {
      ...cart,
      total: parseFloat(total.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2))
    };
  },

  // Calculate discount based on promo code
  calculateDiscount: (cart) => {
    if (!cart.promoCode) return 0;

    const promoCodes = {
      'STUDENT20': { type: 'percentage', value: 0.20, description: '20% Student Discount' },
      'FIRST10': { type: 'percentage', value: 0.10, description: '10% First Time User' },
      'SAVE5': { type: 'fixed', value: 5.00, description: '$5 Off' },
      'ANNUAL25': { type: 'percentage', value: 0.25, description: '25% Off Annual Plans', 
                   condition: item => item.type === 'subscription' && item.subscriptionType === 'yearly' }
    };

    const promo = promoCodes[cart.promoCode.toUpperCase()];
    if (!promo) return 0;

    let discount = 0;
    cart.items.forEach(item => {
      if (!promo.condition || promo.condition(item)) {
        if (promo.type === 'percentage') {
          discount += item.totalPrice * promo.value;
        } else if (promo.type === 'fixed') {
          discount += Math.min(promo.value, item.totalPrice);
        }
      }
    });

    return discount;
  },

  // Apply promo code
  applyPromoCode: (promoCode) => {
    const cart = cartUtils.loadCart();
    cart.promoCode = promoCode.toUpperCase();
    
    const updatedCart = cartUtils.calculateTotals(cart);
    cartUtils.saveCart(updatedCart);
    return updatedCart;
  },

  // Remove promo code
  removePromoCode: () => {
    const cart = cartUtils.loadCart();
    cart.promoCode = null;
    
    const updatedCart = cartUtils.calculateTotals(cart);
    cartUtils.saveCart(updatedCart);
    return updatedCart;
  },

  // Get cart statistics
  getCartStats: () => {
    const cart = cartUtils.loadCart();
    return {
      itemCount: cart.items.length,
      totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: cart.grandTotal,
      isEmpty: cart.items.length === 0,
      hasSubscription: cart.items.some(item => item.type === cartUtils.ITEM_TYPES.SUBSCRIPTION),
      hasMovies: cart.items.some(item => item.type === cartUtils.ITEM_TYPES.MOVIE),
      hasStreamAccess: cart.items.some(item => item.type === cartUtils.ITEM_TYPES.STREAM_ACCESS)
    };
  },

  // Validate cart for checkout
  validateCart: (cart) => {
    const errors = [];
    
    if (cart.items.length === 0) {
      errors.push('Cart is empty');
    }
    
    cart.items.forEach((item, index) => {
      if (!item.title || item.title.trim() === '') {
        errors.push(`Item ${index + 1} is missing a title`);
      }
      if (item.price <= 0) {
        errors.push(`Item "${item.title}" has invalid price`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item "${item.title}" has invalid quantity`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  // Export cart for backup or analysis
  exportCart: () => {
    const cart = cartUtils.loadCart();
    const exportData = {
      ...cart,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `streamlist-cart-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  }
};