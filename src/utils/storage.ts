import { AppConfig } from '../types/common';

const STORAGE_KEY = 'video_translator_settings';

export interface StorageArea {
  get: (keys?: string | string[] | null) => Promise<Record<string, unknown>>;
  set: (items: Record<string, unknown>) => Promise<void>;
  remove: (keys: string | string[]) => Promise<void>;
  clear: () => Promise<void>;
}

export const getStorage = (area: 'sync' | 'local' = 'sync'): StorageArea => {
  return chrome.storage[area];
};

export const saveSettings = async (settings: Partial<AppConfig>, area: 'sync' | 'local' = 'sync'): Promise<void> => {
  const storage = getStorage(area);
  await storage.set(settings);
};

export const loadSettings = async (area: 'sync' | 'local' = 'sync'): Promise<Partial<AppConfig>> => {
  const storage = getStorage(area);
  return storage.get(null);
};

export const clearSettings = async (area: 'sync' | 'local' = 'sync'): Promise<void> => {
  const storage = getStorage(area);
  await storage.clear();
};

export const removeSetting = async (key: string, area: 'sync' | 'local' = 'sync'): Promise<void> => {
  const storage = getStorage(area);
  await storage.remove(key);
};

export const getSetting = async <T>(key: string, defaultValue: T, area: 'sync' | 'local' = 'sync'): Promise<T> => {
  const storage = getStorage(area);
  const result = await storage.get(key);
  return (result[key] as T) ?? defaultValue;
};

export const migrateSettings = async (fromVersion: string, toVersion: string): Promise<void> => {
  const oldSettings = await loadSettings('local');
  if (Object.keys(oldSettings).length > 0) {
    await saveSettings(oldSettings, 'sync');
    await clearSettings('local');
  }
};

export const exportSettingsAsJSON = async (): Promise<string> => {
  const settings = await loadSettings();
  return JSON.stringify(settings, null, 2);
};

export const importSettingsFromJSON = async (json: string): Promise<void> => {
  try {
    const settings = JSON.parse(json);
    await saveSettings(settings);
  } catch (error) {
    throw new Error('Invalid settings JSON format');
  }
};

export const getStorageUsage = async (): Promise<{ used: number; quota: number }> => {
  return new Promise((resolve) => {
    navigator.storage.estimate().then((estimate) => {
      resolve({
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
      });
    });
  });
};

export const STORAGE_EVENTS = {
  CHANGED: 'storageChanged',
};

export type StorageChangeHandler = (changes: Record<string, chrome.storage.StorageChange>) => void;

export const addStorageListener = (handler: StorageChangeHandler): (() => void) => {
  chrome.storage.onChanged.addListener(handler);
  return () => chrome.storage.onChanged.removeListener(handler);
};
