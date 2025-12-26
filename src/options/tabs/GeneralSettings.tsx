import React, { useState } from 'react';
import { useSettings } from '../../shared/hooks/useSettings';
import { UILanguageSelector } from '../../shared/components/LanguageSelector';
import { Select } from '../../shared/components/Select';
import { Toggle } from '../../shared/components/Toggle';
import { UI_LANGUAGES } from '../../constants/languages';
import { THEMES, ThemeId } from '../../constants/themes';
import styles from './tabs.module.css';

export const GeneralSettings: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const [theme, setTheme] = useState<ThemeId>((settings.theme as ThemeId) || 'auto');

  const handleThemeChange = (newTheme: ThemeId) => {
    setTheme(newTheme);
    updateSetting('theme', newTheme);

    if (newTheme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    updateSetting('uiLanguage', newLang);
  };

  return (
    <div className={styles.tab}>
      <div className={styles.section}>
        <h3>UI Language</h3>
        <p className={styles.description}>
          Choose the language for the extension interface
        </p>
        <UILanguageSelector
          value={settings.uiLanguage}
          onChange={handleLanguageChange}
          className={styles.selector}
        />
      </div>

      <div className={styles.section}>
        <h3>Theme</h3>
        <p className={styles.description}>
          Select your preferred color scheme
        </p>
        <div className={styles.themeButtons}>
          {Object.values(THEMES).map((themeOption) => (
            <button
              key={themeOption.id}
              className={`${styles.themeBtn} ${theme === themeOption.id ? styles.active : ''}`}
              onClick={() => handleThemeChange(themeOption.id as ThemeId)}
            >
              <span className={styles.themeIcon}>{themeOption.icon}</span>
              <span>{themeOption.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Auto Updates</h3>
        <p className={styles.description}>
          Automatically update to the latest version
        </p>
        <Toggle
          label="Enable automatic updates"
          checked={settings.autoUpdates}
          onChange={(checked) => updateSetting('autoUpdates', checked)}
        />
      </div>

      <div className={styles.section}>
        <h3>Show Hints</h3>
        <p className={styles.description}>
          Display helpful tips and suggestions
        </p>
        <Toggle
          label="Enable hints and tips"
          checked={(settings as any).showHints !== false}
          onChange={(checked) => (settings as any).showHints !== undefined 
            ? updateSetting('showHints', checked)
            : updateSetting('showHints', checked)}
        />
      </div>

      <div className={styles.section}>
        <h3>Compact Mode</h3>
        <p className={styles.description}>
          Use a more compact interface
        </p>
        <Toggle
          label="Enable compact mode"
          checked={(settings as any).compactMode === true}
          onChange={(checked) => (settings as any).compactMode !== undefined
            ? updateSetting('compactMode', checked)
            : updateSetting('compactMode', checked)}
        />
      </div>
    </div>
  );
};
