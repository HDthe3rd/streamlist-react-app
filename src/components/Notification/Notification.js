// Notification Component
import React from 'react';
import { styles } from '../../styles/styles';

const Notification = ({ message, onClose }) => {
  React.useEffect(() => {
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