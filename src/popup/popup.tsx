import React, { useState, useEffect } from 'react';
import { useMessagePort } from '../shared/hooks/useMessagePort';
import { useSettings } from '../shared/hooks/useSettings';
import { OperatingMode } from '../types/common';
import { OPERATING_MODES } from '../constants/modes';
import { LanguageSelector } from '../shared/components/LanguageSelector';
import { TRANSLATION_LANGUAGES } from '../constants/languages';
import styles from './popup.module.css';

export const PopupApp: React.FC = () => {
  const { settings, updateSetting, loading } = useSettings();
  const { sendMessage } = useMessagePort();
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationCount, setTranslationCount] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsConnecting(true);
      try {
        const stored = await chrome.storage.local.get(['translationCount', 'isActive']);
        setTranslationCount((stored.translationCount as number) || 0);
        setIsActive((stored.isActive as boolean) || false);

        chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response: any) => {
          setIsConnecting(false);
          if (response) {
            setIsActive(response.isActive || false);
            setTranslationCount(response.translationCount || 0);
          }
        });
      } catch {
        setIsConnecting(false);
      }
    };

    init();

    const handleMessage = (message: any) => {
      if (message.type === 'STATUS_UPDATE') {
        setIsActive(message.isActive);
        setTranslationCount(message.translationCount || 0);
      } else if (message.type === 'ERROR') {
        setError(message.message);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const handleModeChange = (mode: OperatingMode) => {
    updateSetting('mode', mode);
    sendMessage({ type: 'MODE_CHANGED', mode });
  };

  const handleSourceLanguageChange = (lang: string) => {
    updateSetting('sourceLanguage', lang);
    sendMessage({ type: 'LANGUAGE_CHANGED', source: lang, target: settings.targetLanguage });
  };

  const handleTargetLanguageChange = (lang: string) => {
    updateSetting('targetLanguage', lang);
    sendMessage({ type: 'LANGUAGE_CHANGED', source: settings.sourceLanguage, target: lang });
  };

  const handleToggle = async () => {
    const newState = !isActive;
    setIsActive(newState);
    await chrome.storage.local.set({ isActive: newState });
    sendMessage({ type: 'TOGGLE_SUBTITLES', enabled: newState });
  };

  const handleQuickTranslate = () => {
    sendMessage({ type: 'QUICK_TRANSLATE' });
  };

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  if (loading || isConnecting) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.popup}>
      {/* Header */}
      <div className={styles.header}>
        <img src="/icons/icon48.png" alt="Logo" className={styles.logo} />
        <div className={styles.headerText}>
          <h1 className={styles.title}>Video Translator</h1>
          <span className={styles.version}>v1.0.0</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className={styles.statusBar}>
        <div className={`${styles.statusIndicator} ${isActive ? styles.active : ''}`}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className={styles.stats}>
          <span className={styles.statIcon}>🌍</span>
          <span>{translationCount}</span>
        </div>
      </div>

      {/* Mode Selector */}
      <div className={styles.section}>
        <label className={styles.label}>
          Mode
          <span className={styles.shortcut}>Ctrl+M</span>
        </label>
        <select
          className={styles.modeSelect}
          value={settings.mode}
          onChange={(e) => handleModeChange(e.target.value as OperatingMode)}
        >
          {OPERATING_MODES.map(mode => (
            <option key={mode.value} value={mode.value}>
              {mode.icon} {mode.label}
            </option>
          ))}
        </select>
      </div>

      {/* Language Selectors */}
      <div className={styles.section}>
        <label className={styles.label}>Languages</label>
        <div className={styles.languagePair}>
          <div className={styles.langCol}>
            <LanguageSelector
              value={settings.sourceLanguage}
              onChange={handleSourceLanguageChange}
              placeholder="Auto-detect"
              showAutoDetect
            />
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.langCol}>
            <LanguageSelector
              value={settings.targetLanguage}
              onChange={handleTargetLanguageChange}
              showAutoDetect={false}
            />
          </div>
        </div>
      </div>

      {/* Main Toggle Button */}
      <button
        className={`${styles.mainToggle} ${isActive ? styles.active : ''}`}
        onClick={handleToggle}
      >
        <span className={styles.toggleIcon}>
          {isActive ? '⏹️' : '▶️'}
        </span>
        <span className={styles.toggleText}>
          {isActive ? 'Stop Translation' : 'Start Translation'}
        </span>
      </button>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button
          className={styles.quickBtn}
          onClick={handleQuickTranslate}
          title="Quick translate current subtitle"
        >
          <span>⚡</span>
          <span>Quick Translate</span>
        </button>
      </div>

      {/* Quick Settings Toggles */}
      <div className={styles.quickSettings}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={settings.displaySettings?.enabled !== false}
            onChange={(e) => updateSetting('displaySettings', {
              ...settings.displaySettings,
              enabled: e.target.checked
            })}
          />
          <span className={styles.toggleSwitch} />
          <span>Subtitles</span>
        </label>

        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={settings.audioCapture !== 'disabled'}
            onChange={(e) => updateSetting('audioCapture', e.target.checked ? 'direct' : 'disabled')}
          />
          <span className={styles.toggleSwitch} />
          <span>Audio Capture</span>
        </label>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorText}>{error}</span>
          <button
            className={styles.errorClose}
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.settingsBtn} onClick={openSettings}>
          ⚙️ Settings
        </button>
        <div className={styles.shortcuts}>
          <kbd>Ctrl+S</kbd>
          <kbd>Ctrl+T</kbd>
        </div>
      </div>
    </div>
  );
};
