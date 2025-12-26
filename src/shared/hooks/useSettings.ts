import { useState, useEffect } from 'react';
import { AppConfig } from '../../types/common';

const DEFAULT_SETTINGS: AppConfig = {
  mode: 'normal',
  sourceLanguage: 'auto',
  targetLanguage: 'en',
  translationEngine: 'google',
  audioCapture: 'direct',
  displaySettings: {
    enabled: true,
    fontSize: 16,
    fontFamily: 'sans',
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    opacity: 80,
    position: 'bottom',
    displayMode: 'simple',
    shadowEnabled: true,
    borderRadius: 4,
  },
  audioSettings: {
    captureMethod: 'direct',
    microphoneSensitivity: 'medium',
    noiseFilterLevel: 'light',
    multiChannelEnabled: false,
    alwaysCapture: false,
    audioDevice: 'default',
  },
  performanceSettings: {
    mode: 'balanced',
    gpuAcceleration: true,
    memoryLimit: 512,
    batterySaverMode: false,
    threadCount: 'auto',
  },
  privacySettings: {
    localOnlyMode: false,
    autoDeleteRecordings: '24h',
    anonymousMode: true,
    passwordProtection: false,
    quickLock: false,
    dataEncryption: true,
  },
  integrationsSettings: {
    googleDrive: false,
    dropbox: false,
    whitelist: [],
    blacklist: [],
    supportedPlatforms: ['youtube', 'vimeo', 'netflix'],
  },
  advancedSettings: {
    customEndpoints: [],
    webhooks: [],
    advancedAudio: false,
    developerMode: false,
    experimentalFeatures: false,
  },
  theme: 'auto',
  uiLanguage: 'en',
  autoUpdates: true,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppConfig>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(null, (items) => {
      if (Object.keys(items).length > 0) {
        // Deep merge or just set? For simplicity here:
        setSettings({ ...DEFAULT_SETTINGS, ...items });
      }
      setLoading(false);
    });
  }, []);

  const updateSetting = <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    chrome.storage.sync.set({ [key]: value });
  };

  return { settings, updateSetting, loading };
};
