import { useState, useEffect, useCallback, memo } from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';
import { cartUtils } from '../../utils/cartUtils';
import Notification from '../Notification/Notification';

// Memoized Cart Item Component
const CartItem = memo(({ item, onUpdateQuantity, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    setIsUpdating(true);
    await onUpdateQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  const getItemIcon = () => {
    switch (item.type) {
      case cartUtils.ITEM_TYPES.MOVIE:
        return <Icons.Movie />;
      case cartUtils.ITEM_TYPES.SUBSCRIPTION:
        return <Icons.Star />;
      case cartUtils.ITEM_TYPES.STREAM_ACCESS:
        return <Icons.Stream />;
      default:
        return <Icons.Cart />;
    }
  };

  const getItemBadge = () => {
    switch (item.type) {
      case cartUtils.ITEM_TYPES.MOVIE:
        return item.accessType === 'rental' ? '📅 Rental' : '💾 Purchase';
      case cartUtils.ITEM_TYPES.SUBSCRIPTION:
        return item.subscriptionType === 'monthly' ? '📅 Monthly' : '🎯 Annual';
      case cartUtils.ITEM_TYPES.STREAM_ACCESS:
        return '📺 Access';
      default:
        return '🛒 Item';
    }
  };

  return (
    <div style={{
      ...styles.streamItem,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '1rem',
      alignItems: 'start'
    }}>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          {getItemIcon()}
          <h3 style={styles.streamTitle}>{item.title}</h3>
          <span style={{
            ...styles.streamBadge,
            fontSize: '0.75rem'
          }}>
            {getItemBadge()}
          </span>
        </div>

        {item.description && (
          <p style={{
            ...styles.streamDescription,
            marginBottom: '1rem'
          }}>
            {item.description}
          </p>
        )}

        <div style={styles.streamMeta}>
          {item.platform && (
            <span style={styles.streamBadge}>
              <Icons.Platform /> {item.platform}
            </span>
          )}
          {item.releaseDate && (
            <span style={styles.streamBadge}>
              <Icons.Calendar /> {new Date(item.releaseDate).getFullYear()}
            </span>
          )}
          {item.voteAverage && (
            <span style={styles.streamBadge}>
              <Icons.Star /> {item.voteAverage}/10
            </span>
          )}
          {item.duration && (
            <span style={styles.streamBadge}>
              <Icons.Date /> {item.duration}
            </span>
          )}
        </div>

        {/* Subscription Features */}
        {item.features && item.features.length > 0 && (
          <div style={{
            marginTop: '1rem',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <h4 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
              ✨ Premium Features:
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.25rem'
            }}>
              {item.features.map((feature, index) => (
                <li key={index} style={{
                  color: '#718096',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span style={{ color: '#48bb78' }}>✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '1rem',
        minWidth: '150px'
      }}>
        <div style={{
          textAlign: 'right'
        }}>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#2d3748'
          }}>
            {cartUtils.formatCurrency(item.totalPrice)}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#718096'
          }}>
            {cartUtils.formatCurrency(item.price)} each
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            style={{
              ...styles.buttonSecondary,
              padding: '0.5rem',
              minWidth: '2rem',
              opacity: isUpdating || item.quantity <= 1 ? 0.5 : 1
            }}
          >
            -
          </button>
          
          <span style={{
            padding: '0.5rem',
            minWidth: '2rem',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {item.quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            style={{
              ...styles.buttonSecondary,
              padding: '0.5rem',
              minWidth: '2rem',
              opacity: isUpdating ? 0.5 : 1
            }}
          >
            +
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          style={styles.deleteButton}
          disabled={isUpdating}
        >
          <Icons.Delete />
          Remove
        </button>
      </div>
    </div>
  );
});

// Main CartPage Component
const CartPage = () => {
  const [cart, setCart] = useState(cartUtils.createEmptyCart());
  const [notification, setNotification] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, payment, confirmation

  // Load cart on mount
  useEffect(() => {
    const loadedCart = cartUtils.loadCart();
    setCart(loadedCart);
  }, []);

  const showNotification = useCallback((message) => {
    setNotification(message);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification('');
  }, []);

  const handleUpdateQuantity = useCallback(async (itemId, quantity) => {
    const updatedCart = cartUtils.updateItemQuantity(itemId, quantity);
    setCart(updatedCart);
    
    if (quantity === 0) {
      showNotification('Item removed from cart');
    } else {
      showNotification('Quantity updated');
    }
  }, [showNotification]);

  const handleRemoveItem = useCallback((itemId) => {
    const item = cart.items.find(i => i.id === itemId);
    if (item && window.confirm(`Remove "${item.title}" from cart?`)) {
      const updatedCart = cartUtils.removeItem(itemId);
      setCart(updatedCart);
      showNotification(`"${item.title}" removed from cart`);
    }
  }, [cart.items, showNotification]);

  const handleApplyPromoCode = useCallback(() => {
    if (!promoCode.trim()) {
      showNotification('Please enter a promo code');
      return;
    }

    const updatedCart = cartUtils.applyPromoCode(promoCode);
    setCart(updatedCart);
    
    if (updatedCart.discount > 0) {
      showNotification(`✅ Promo code applied! Saved ${cartUtils.formatCurrency(updatedCart.discount)}`);
    } else {
      showNotification('❌ Invalid promo code');
    }
    
    setPromoCode('');
  }, [promoCode, showNotification]);

  const handleRemovePromoCode = useCallback(() => {
    const updatedCart = cartUtils.removePromoCode();
    setCart(updatedCart);
    showNotification('Promo code removed');
  }, [showNotification]);

  const handleClearCart = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      const emptyCart = cartUtils.clearCart();
      setCart(emptyCart);
      showNotification('🧹 Cart cleared');
    }
  }, [showNotification]);

  const handleAddSubscription = useCallback((type) => {
    const updatedCart = cartUtils.addSubscriptionToCart(type);
    setCart(updatedCart);
    showNotification(`✨ ${type === 'monthly' ? 'Monthly' : 'Annual'} subscription added to cart!`);
  }, [showNotification]);

  const handleCheckout = useCallback(async () => {
    const validation = cartUtils.validateCart(cart);
    if (!validation.isValid) {
      showNotification(`❌ ${validation.errors[0]}`);
      return;
    }

    setIsCheckingOut(true);
    
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCheckoutStep('confirmation');
      showNotification('🎉 Order placed successfully!');
      
      // Clear cart after successful checkout
      setTimeout(() => {
        const emptyCart = cartUtils.clearCart();
        setCart(emptyCart);
        setCheckoutStep('cart');
      }, 3000);
      
    } catch (error) {
      showNotification('❌ Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  }, [cart, showNotification]);

  // Empty cart state
  if (cart.items.length === 0 && checkoutStep === 'cart') {
    return (
      <div style={styles.page}>
        <h1 style={styles.pageTitle}>Shopping Cart</h1>
        
        <div style={styles.comingSoon}>
          <div style={styles.comingSoonIcon}>
            <Icons.Cart />
          </div>
          <h2 style={styles.comingSoonTitle}>Your Cart is Empty</h2>
          <p style={styles.comingSoonText}>
            Discover movies and add premium features to enhance your StreamList experience!
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
            maxWidth: '800px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎬</div>
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Discover Movies</h3>
              <p style={{ marginBottom: '1.5rem', color: '#718096', fontSize: '0.9rem' }}>
                Browse and rent or purchase movies from our vast collection
              </p>
              <button
                onClick={() => window.location.hash = 'movies'}
                style={styles.buttonSecondary}
              >
                <Icons.Movie />
                Browse Movies
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⭐</div>
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Go Premium</h3>
              <p style={{ marginBottom: '1.5rem', color: '#718096', fontSize: '0.9rem' }}>
                Unlock advanced features and unlimited movie discovery
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  onClick={() => handleAddSubscription('monthly')}
                  style={{...styles.buttonSecondary, fontSize: '0.8rem'}}
                >
                  Monthly {cartUtils.formatCurrency(cartUtils.PRICING.PREMIUM_MONTHLY)}
                </button>
                <button
                  onClick={() => handleAddSubscription('yearly')}
                  style={{...styles.button, fontSize: '0.8rem'}}
                >
                  Annual {cartUtils.formatCurrency(cartUtils.PRICING.PREMIUM_YEARLY)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {notification && (
          <Notification message={notification} onClose={hideNotification} />
        )}
      </div>
    );
  }

  // Checkout confirmation
  if (checkoutStep === 'confirmation') {
    return (
      <div style={styles.page}>
        <div style={styles.comingSoon}>
          <div style={styles.comingSoonIcon}>🎉</div>
          <h1 style={styles.comingSoonTitle}>Order Confirmed!</h1>
          <p style={styles.comingSoonText}>
            Thank you for your purchase! Your order has been processed successfully.
            You'll receive an email confirmation shortly.
          </p>
          
          <div style={{
            background: 'rgba(72, 187, 120, 0.1)',
            borderRadius: '12px',
            padding: '2rem',
            marginTop: '2rem',
            textAlign: 'left',
            maxWidth: '500px'
          }}>
            <h3 style={{ color: '#38a169', marginBottom: '1rem' }}>
              <Icons.Success /> What's Next?
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#718096'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                ✓ Check your email for order confirmation
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                ✓ Access your purchases in your StreamList
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                ✓ Premium features will be activated within 5 minutes
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Cart with items
  return (
    <div style={styles.page}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={styles.pageTitle}>Shopping Cart ({cart.items.length} items)</h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => cartUtils.exportCart()}
            style={styles.buttonSecondary}
          >
            <Icons.Save />
            Export Cart
          </button>
          
          <button
            onClick={handleClearCart}
            style={styles.deleteButton}
          >
            <Icons.Delete />
            Clear Cart
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Cart Items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {cart.items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div style={{
          position: 'sticky',
          top: '2rem'
        }}>
          <div style={{
            ...styles.streamItem,
            padding: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '1.5rem',
              color: '#2d3748'
            }}>
              <Icons.Cart /> Order Summary
            </h3>

            {/* Promo Code */}
            <div style={{
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#4a5568'
              }}>
                Promo Code
              </label>
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  style={{
                    ...styles.input,
                    flex: 1
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                />
                <button
                  onClick={handleApplyPromoCode}
                  style={styles.buttonSecondary}
                >
                  Apply
                </button>
              </div>
              
              {cart.promoCode && cart.discount > 0 && (
                <div style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.9rem',
                    color: '#38a169',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Icons.Check /> {cart.promoCode} applied
                  </span>
                  <button
                    onClick={handleRemovePromoCode}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e53e3e',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    <Icons.Close /> Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Subtotal:</span>
                <span>{cartUtils.formatCurrency(cart.total)}</span>
              </div>
              
              {cart.discount > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#38a169'
                }}>
                  <span>Discount:</span>
                  <span>-{cartUtils.formatCurrency(cart.discount)}</span>
                </div>
              )}
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Tax:</span>
                <span>{cartUtils.formatCurrency(cart.tax)}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid #e2e8f0',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#2d3748'
              }}>
                <span>Total:</span>
                <span>{cartUtils.formatCurrency(cart.grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || cart.items.length === 0}
              style={{
                ...styles.button,
                width: '100%',
                fontSize: '1.1rem',
                padding: '1rem',
                opacity: isCheckingOut ? 0.7 : 1
              }}
            >
              {isCheckingOut ? (
                <>
                  <Icons.Loading />
                  Processing...
                </>
              ) : (
                <>
                  <Icons.Success />
                  Checkout {cartUtils.formatCurrency(cart.grandTotal)}
                </>
              )}
            </button>

            {/* Security Notice */}
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#718096',
              textAlign: 'center'
            }}>
              <Icons.API /> Secure checkout powered by industry-standard encryption
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <Notification message={notification} onClose={hideNotification} />
      )}
    </div>
  );
};

export default CartPage;