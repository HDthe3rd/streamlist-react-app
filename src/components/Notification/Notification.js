// Notification Component
import React, { useEffect } from 'react';
import { styles } from '../../styles/styles';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={styles.notification}>
      {message}
    </div>
  );
};

export default Notification;