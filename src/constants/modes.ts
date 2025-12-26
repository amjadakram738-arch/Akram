import { OperatingMode } from '../types/common';

export const OPERATING_MODES: { value: OperatingMode; label: string; icon: string; description: string; shortcut?: string }[] = [
  { 
    value: 'auto', 
    label: 'Auto', 
    icon: '🤖', 
    description: 'Automatically detect and translate video content',
    shortcut: 'A'
  },
  { 
    value: 'manual', 
    label: 'Manual', 
    icon: '🕹️', 
    description: 'Manually trigger translation with keyboard shortcuts',
    shortcut: 'M'
  },
  { 
    value: 'economy', 
    label: 'Economy', 
    icon: '🍃', 
    description: 'Low resource usage with optimized translation',
    shortcut: 'E'
  },
  { 
    value: 'high_accuracy', 
    label: 'High Accuracy', 
    icon: '🎯', 
    description: 'Maximum accuracy with slower processing',
    shortcut: 'H'
  },
  { 
    value: 'silent', 
    label: 'Silent', 
    icon: '🔇', 
    description: 'Capture audio without playing sound',
    shortcut: 'S'
  },
  { 
    value: 'interactive', 
    label: 'Interactive', 
    icon: '✍️', 
    description: 'Edit translations in real-time',
    shortcut: 'I'
  },
  { 
    value: 'normal', 
    label: 'Normal', 
    icon: '⚖️', 
    description: 'Balanced performance and quality',
    shortcut: 'N'
  },
  { 
    value: 'fast', 
    label: 'Fast', 
    icon: '⚡', 
    description: 'Quick translations with reduced accuracy',
    shortcut: 'F'
  },
  { 
    value: 'beta', 
    label: 'Beta', 
    icon: '🧪', 
    description: 'Try new features before official release',
    shortcut: 'B'
  },
  { 
    value: 'cloud', 
    label: 'Cloud', 
    icon: '☁️', 
    description: 'Use cloud processing for better results',
    shortcut: 'C'
  },
  { 
    value: 'shared', 
    label: 'Shared', 
    icon: '👥', 
    description: 'Share translations with other users',
    shortcut: 'Shift+S'
  },
];

export const DEFAULT_MODE: OperatingMode = 'normal';
