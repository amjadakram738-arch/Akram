import React from 'react';
import { useSettings } from '../../shared/hooks/useSettings';
import { Toggle } from '../../shared/components/Toggle';
import { LanguageSelector } from '../../shared/components/LanguageSelector';
import styles from '../options.module.css';

const UI_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  // ... more
];

export const GeneralSettings: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className={styles.tab}>
      <section className={styles.section}>
        <h3>UI Language</h3>
        <LanguageSelector
          value={settings.uiLanguage}
          languages={UI_LANGUAGES}
          onChange={(lang) => updateSetting('uiLanguage', lang)}
        />
        <p className={styles.hint}>Choose the language for the extension interface.</p>
      </section>

      <section className={styles.section}>
        <h3>Theme</h3>
        <div className={styles.themeButtons}>
          <button 
            className={settings.theme === 'light' ? styles.active : ''} 
            onClick={() => updateSetting('theme', 'light')}
          >
            ☀️ Light
          </button>
          <button 
            className={settings.theme === 'dark' ? styles.active : ''} 
            onClick={() => updateSetting('theme', 'dark')}
          >
            🌙 Dark
          </button>
          <button 
            className={settings.theme === 'auto' ? styles.active : ''} 
            onClick={() => updateSetting('theme', 'auto')}
          >
            🔄 Auto
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Updates</h3>
        <Toggle
          label="Enable automatic updates"
          checked={settings.autoUpdates}
          onChange={(val) => updateSetting('autoUpdates', val)}
        />
      </section>
    </div>
  );
};
