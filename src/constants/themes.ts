export const THEMES = {
  light: {
    id: 'light',
    label: 'Light',
    icon: '☀️',
    colors: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F5F5F5',
      textPrimary: '#1A1A1A',
      textSecondary: '#666666',
      accentColor: '#4A90E2',
      accentLight: 'rgba(74, 144, 226, 0.1)',
      borderColor: '#E0E0E0',
      successColor: '#27AE60',
      warningColor: '#F39C12',
      errorColor: '#E74C3C',
    }
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    icon: '🌙',
    colors: {
      bgPrimary: '#1A1A1A',
      bgSecondary: '#2D2D2D',
      textPrimary: '#FFFFFF',
      textSecondary: '#CCCCCC',
      accentColor: '#6CB4FF',
      accentLight: 'rgba(108, 180, 255, 0.1)',
      borderColor: '#444444',
      successColor: '#2ECC71',
      warningColor: '#F1C40F',
      errorColor: '#E74C3C',
    }
  },
  auto: {
    id: 'auto',
    label: 'Auto',
    icon: '🔄',
    colors: null
  }
};

export type ThemeId = 'light' | 'dark' | 'auto';

export const getThemeColors = (themeId: ThemeId) => {
  if (themeId === 'auto') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? THEMES.dark.colors : THEMES.light.colors;
  }
  return THEMES[themeId].colors;
};
