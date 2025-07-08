import React from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

const CartPage = () => (
  <div style={styles.page}>
    <div style={styles.comingSoon}>
      <div style={styles.comingSoonIcon}>
        <Icons.Construction />
      </div>
      <h1 style={styles.comingSoonTitle}>Your Cart</h1>
      <p style={styles.comingSoonText}>
        This page is currently under development and will be available in Week 4. 
        Here you'll be able to manage your selected items and proceed with your choices.
      </p>
    </div>
  </div>
);

export default CartPage;