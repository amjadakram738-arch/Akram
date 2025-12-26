import React from 'react';
import styles from './Toggle.module.css';

interface Props {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<Props> = ({ label, checked, onChange }) => {
  return (
    <label className={styles.container}>
      <span className={styles.label}>{label}</span>
      <div className={styles.switch}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={styles.slider}></span>
      </div>
    </label>
  );
};
