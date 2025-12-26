import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { AppConfig } from '../types/common';

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

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppConfig>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await chrome.storage.sync.get(null);
        if (Object.keys(stored).length > 0) {
          setSettings({ ...DEFAULT_SETTINGS, ...stored });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    const handleChange = (changes: Record<string, chrome.storage.StorageChange>) => {
      setSettings(prev => {
        const newSettings = { ...prev };
        Object.keys(changes).forEach(key => {
          if (key in newSettings) {
            (newSettings as any)[key] = changes[key].newValue;
          }
        });
        return newSettings;
      });
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  const updateSetting = useCallback(<K extends keyof AppConfig>(key: K, value: AppConfig[K]) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      chrome.storage.sync.set({ [key]: value } as any).catch(console.error);
      return newSettings;
    });
    setDirty(true);
  }, []);

  const saveSettings = useCallback(async () => {
    try {
      await chrome.storage.sync.set(settings as any);
      setDirty(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }, [settings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    chrome.storage.sync.clear().catch(console.error);
    setDirty(false);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, loading, saveSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { DEFAULT_SETTINGS };
