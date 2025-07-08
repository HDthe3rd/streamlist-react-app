import React from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

const MoviesPage = () => (
  <div style={styles.page}>
    <div style={styles.comingSoon}>
      <div style={styles.comingSoonIcon}>
        <Icons.Construction />
      </div>
      <h1 style={styles.comingSoonTitle}>Movies Collection</h1>
      <p style={styles.comingSoonText}>
        This page is currently under development and will be available in Week 4. 
        Here you'll be able to browse and discover new movies to add to your streaming list.
      </p>
    </div>
  </div>
);

export default MoviesPage;