import React, { useState, useEffect } from 'react';
import { LanguageSelector } from '../shared/components/LanguageSelector';
import { ModeSelector } from '../shared/components/ModeSelector';
import { Toggle } from '../shared/components/Toggle';
import { Alert } from '../shared/components/Alert';
import { StatusBadge } from '../shared/components/StatusBadge';
import { useSettings } from '../shared/hooks/useSettings';
import { useMessagePort } from '../shared/hooks/useMessagePort';
import { OperatingMode } from '../types/common';
import styles from './popup.module.css';

export const PopupApp: React.FC = () => {
  const { settings, updateSetting, loading } = useSettings();
  const { sendMessage } = useMessagePort();
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationCount, setTranslationCount] = useState(0);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
      if (response) {
        setIsActive(response.isActive);
        setTranslationCount(response.translationCount || 0);
      }
    });
  }, []);

  const handleModeChange = (mode: OperatingMode) => {
    updateSetting('mode', mode);
    sendMessage({ type: 'MODE_CHANGED', mode });
  };

  const handleLanguageChange = (source: string, target: string) => {
    updateSetting('sourceLanguage', source);
    updateSetting('targetLanguage', target);
    sendMessage({ type: 'LANGUAGE_CHANGED', source, target });
  };

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    sendMessage({ type: 'TOGGLE_SUBTITLES', enabled: newState });
  };

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.popup}>
      {/* Header */}
      <div className={styles.header}>
        <img src="/icons/icon48.png" alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>{chrome.i18n.getMessage('popupTitle') || 'Video Translator'}</h1>
      </div>

      {/* Mode Selector */}
      <div className={styles.section}>
        <label className={styles.label}>{chrome.i18n.getMessage('mode') || 'Mode'}</label>
        <ModeSelector 
          currentMode={settings.mode} 
          onChange={handleModeChange}
        />
      </div>

      {/* Language Selectors */}
      <div className={styles.section}>
        <div className={styles.languagePair}>
          <div className={styles.langCol}>
            <label className={styles.label}>{chrome.i18n.getMessage('from') || 'From'}</label>
            <LanguageSelector
              value={settings.sourceLanguage}
              onChange={(lang) => handleLanguageChange(lang, settings.targetLanguage)}
              placeholder="Auto-detect"
            />
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.langCol}>
            <label className={styles.label}>{chrome.i18n.getMessage('to') || 'To'}</label>
            <LanguageSelector
              value={settings.targetLanguage}
              onChange={(lang) => handleLanguageChange(settings.sourceLanguage, lang)}
            />
          </div>
        </div>
      </div>

      {/* Status & Controls */}
      <div className={styles.section}>
        <div className={styles.statusRow}>
          <StatusBadge isActive={isActive} />
          <span className={styles.count}>
            {chrome.i18n.getMessage('translations') || 'Translations'}: {translationCount}
          </span>
        </div>
      </div>

      {/* Main Toggle */}
      <button 
        className={`${styles.toggleButton} ${isActive ? styles.active : ''}`}
        onClick={handleToggle}
      >
        {isActive ? '⏹️' : '▶️'} {isActive ? 'Active' : 'Inactive'}
      </button>

      {/* Quick Settings */}
      <div className={styles.quickSettings}>
        <Toggle
          label={chrome.i18n.getMessage('subtitles') || 'Subtitles'}
          checked={settings.displaySettings.enabled}
          onChange={(val) => updateSetting('displaySettings', { ...settings.displaySettings, enabled: val })}
        />
        <Toggle
          label={chrome.i18n.getMessage('audioCapture') || 'Audio Capture'}
          checked={settings.audioCapture !== 'disabled'}
          onChange={(val) => updateSetting('audioCapture', val ? 'direct' : 'disabled')}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert 
          type="error" 
          message={error}
          onClose={() => setError(null)}
          onRetry={() => {
            sendMessage({ type: 'RETRY_TRANSLATION' });
            setError(null);
          }}
        />
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.settingsButton} onClick={openSettings}>
          ⚙️ {chrome.i18n.getMessage('settings') || 'Settings'}
        </button>
        <span className={styles.shortcut}>Ctrl+S</span>
      </div>
    </div>
  );
};
