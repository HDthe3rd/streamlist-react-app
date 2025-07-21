import React from 'react';
import { styles } from '../../styles/styles';
import { Icons } from '../../utils/icons';

// About Page Component
const AboutPage = () => (
  <div style={styles.page}>
    <div style={styles.comingSoon}>
      <div style={styles.comingSoonIcon}>
        <Icons.About />
      </div>
      <h1 style={styles.comingSoonTitle}>About StreamList</h1>
      <p style={styles.comingSoonText}>
        StreamList is a comprehensive streaming content management application built with React. 
        Features include CRUD operations, API integration, localStorage persistence, and modern security practices. 
        This application demonstrates professional web development standards and best practices.
      </p>
    </div>
  </div>
);

export default AboutPage;