import React from 'react';
import { OperatingMode } from '../../types/common';
import styles from './ModeSelector.module.css';

interface Props {
  currentMode: OperatingMode;
  onChange: (mode: OperatingMode) => void;
}

const MODES: { value: OperatingMode; label: string; icon: string }[] = [
  { value: 'auto', label: 'Auto', icon: '🤖' },
  { value: 'manual', label: 'Manual', icon: '🕹️' },
  { value: 'economy', label: 'Economy', icon: '🍃' },
  { value: 'high_accuracy', label: 'High Accuracy', icon: '🎯' },
  { value: 'silent', label: 'Silent', icon: '🔇' },
  { value: 'interactive', label: 'Interactive', icon: '✍️' },
  { value: 'normal', label: 'Normal', icon: '⚖️' },
  { value: 'fast', label: 'Fast', icon: '⚡' },
  { value: 'beta', label: 'Beta', icon: '🧪' },
  { value: 'cloud', label: 'Cloud', icon: '☁️' },
  { value: 'shared', label: 'Shared', icon: '👥' },
];

export const ModeSelector: React.FC<Props> = ({ currentMode, onChange }) => {
  return (
    <div className={styles.container}>
      {MODES.map((mode) => (
        <button
          key={mode.value}
          className={`${styles.modeItem} ${currentMode === mode.value ? styles.active : ''}`}
          onClick={() => onChange(mode.value)}
          title={mode.label}
        >
          <span className={styles.icon}>{mode.icon}</span>
          <span className={styles.label}>{mode.label}</span>
        </button>
      ))}
    </div>
  );
};
