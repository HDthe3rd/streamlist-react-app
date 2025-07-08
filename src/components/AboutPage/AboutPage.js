import React from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

const AboutPage = () => (
  <div style={styles.page}>
    <div style={styles.comingSoon}>
      <div style={styles.comingSoonIcon}>
        <Icons.Construction />
      </div>
      <h1 style={styles.comingSoonTitle}>About StreamList</h1>
      <p style={styles.comingSoonText}>
        This page is currently under development and will be available in Week 5. 
        Here you'll learn more about StreamList and how it can help you organize your viewing experience.
      </p>
    </div>
  </div>
);

export default AboutPage;