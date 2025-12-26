import React from 'react';
import styles from './Alert.module.css';

interface Props {
  type: 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
}

export const Alert: React.FC<Props> = ({ type, message, onClose, onRetry }) => {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
      <div className={styles.actions}>
        {onRetry && <button onClick={onRetry} className={styles.retryBtn}>Retry</button>}
        {onClose && <button onClick={onClose} className={styles.closeBtn}>×</button>}
      </div>
    </div>
  );
};
