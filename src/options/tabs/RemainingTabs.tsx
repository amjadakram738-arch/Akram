import React from 'react';
import { useSettings } from '../../shared/hooks/useSettings';
import styles from '../options.module.css';

export const TranslationSettings: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  return (
    <div className={styles.tab}>
      <section className={styles.section}>
        <h3>Translation Engine</h3>
        <select 
          value={settings.translationEngine} 
          onChange={(e) => updateSetting('translationEngine', e.target.value as any)}
          className={styles.select}
        >
          <option value="google">Google Translate</option>
          <option value="libre">LibreTranslate</option>
          <option value="mymemory">MyMemory</option>
          <option value="deepl">DeepL</option>
          <option value="microsoft">Microsoft Translator</option>
        </select>
      </section>
    </div>
  );
};

export const AudioSettingsTab: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  return (
    <div className={styles.tab}>
      <section className={styles.section}>
        <h3>Audio Capture Method</h3>
        <select 
          value={settings.audioCapture} 
          onChange={(e) => updateSetting('audioCapture', e.target.value as any)}
          className={styles.select}
        >
          <option value="direct">Direct Capture</option>
          <option value="microphone">Microphone</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </section>
    </div>
  );
};

export const DisplaySettingsTab: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  return (
    <div className={styles.tab}>
      <section className={styles.section}>
        <h3>Font Size</h3>
        <input 
          type="range" min="12" max="48" 
          value={settings.displaySettings.fontSize}
          onChange={(e) => updateSetting('displaySettings', { ...settings.displaySettings, fontSize: parseInt(e.target.value) })}
        />
        <span>{settings.displaySettings.fontSize}px</span>
      </section>
    </div>
  );
};

export const PerformanceSettingsTab: React.FC = () => {
  return <div className={styles.tab}>Performance settings content</div>;
};

export const PrivacySettingsTab: React.FC = () => {
  return <div className={styles.tab}>Privacy settings content</div>;
};

export const IntegrationsSettingsTab: React.FC = () => {
  return <div className={styles.tab}>Integrations settings content</div>;
};

export const AdvancedSettingsTab: React.FC = () => {
  return <div className={styles.tab}>Advanced settings content</div>;
};
