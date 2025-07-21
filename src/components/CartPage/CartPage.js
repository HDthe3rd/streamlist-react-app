import React from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

const CartPage = () => (
  <div style={styles.page}>
    <div style={styles.comingSoon}>
      <div style={styles.comingSoonIcon}>
        <Icons.Cart />
      </div>
      <h1 style={styles.comingSoonTitle}>Shopping Cart System</h1>
      <p style={styles.comingSoonText}>
        This page will feature a complete shopping cart system with localStorage persistence, 
        allowing users to add movies from search results, manage quantities, and checkout. 
        Integration with the Movies page and StreamList will provide a seamless user experience.
      </p>
    </div>
  </div>
);

export default CartPage;