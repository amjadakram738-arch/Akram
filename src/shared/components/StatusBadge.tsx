import React from 'react';
import styles from './StatusBadge.module.css';

interface Props {
  isActive: boolean;
}

export const StatusBadge: React.FC<Props> = ({ isActive }) => {
  return (
    <div className={`${styles.badge} ${isActive ? styles.active : styles.inactive}`}>
      <span className={styles.dot}></span>
      <span className={styles.text}>
        {isActive ? 'Live' : 'Idle'}
      </span>
    </div>
  );
};
