import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { AppConfig } from '../../types/common';

interface SettingsContextValue {
  settings: AppConfig;
  updateSetting: <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => void;
  loading: boolean;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
}

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
    textAlign: 'center',
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
    memoryLimit: 256,
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
    logLevel: 'info',
    maxRetries: 3,
    timeout: 30000,
  },
  theme: 'auto',
  uiLanguage: 'en',
  autoUpdates: true,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export { DEFAULT_SETTINGS };
