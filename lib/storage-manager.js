// Storage Manager - Handles all data persistence and retrieval

export class StorageManager {
  constructor() {
    this.defaultSettings = null;
  }

  async init() {
    // Check if settings exist, if not create defaults
    const result = await chrome.storage.sync.get('settings');
    if (!result.settings) {
      await this.setDefaultSettings();
    }
  }

  async setDefaultSettings() {
    const defaultSettings = {
      // General Settings
      interfaceLanguage: this.detectUserLanguage(),
      theme: 'auto',
      autoStart: false,
      
      // Translation Settings
      sourceLang: 'auto',
      targetLang: this.detectUserLanguage(),
      translationEngine: 'auto',
      autoDetectLanguage: true,
      translationEngines: ['libre', 'deepl', 'google', 'microsoft', 'mymemory'],
      
      // Operating Modes
      operatingMode: 'normal',
      
      // Audio Capture Settings
      captureMode: 'direct',
      noiseReduction: true,
      noiseFilterLevel: 'medium',
      alwaysCapture: true,
      bufferSize: 3,
      chunkDuration: 3000,
      
      // Display Settings
      displayMode: 'simple',
      subtitlePosition: 'bottom',
      fontSize: 20,
      fontFamily: 'Arial, sans-serif',
      textColor: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      bgOpacity: 80,
      textShadow: true,
      draggableSubtitles: false,
      subtitleDuration: 5000,
      opacity: 0.9,
      
      // Performance Settings
      performanceMode: 'normal',
      gpuAcceleration: false,
      memoryLimit: 100,
      offlineMode: false,
      
      // Privacy Settings
      localOnlyMode: true,
      dataRetention: 'session',
      anonymousMode: false,
      encryptLocalData: true,
      
      // Advanced Settings
      customApiUrl: '',
      customApiKey: '',
      betaMode: false,
      sentimentAnalysis: false,
      smartAlerts: false,
      debugMode: false,
      
      // Statistics
      totalWords: 0,
      totalTime: 0,
      sessionsCount: 0
    };

    await chrome.storage.sync.set({ settings: defaultSettings });
    this.defaultSettings = defaultSettings;
    return defaultSettings;
  }

  async getSettings() {
    try {
      const result = await chrome.storage.sync.get('settings');
      return result.settings || this.defaultSettings;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return this.defaultSettings;
    }
  }

  async saveSettings(settings) {
    try {
      await chrome.storage.sync.set({ settings });
      return { success: true };
    } catch (error) {
      console.error('Failed to save settings:', error);
      return { success: false, error: error.message };
    }
  }

  async updateSetting(key, value) {
    const settings = await this.getSettings();
    settings[key] = value;
    return await this.saveSettings(settings);
  }

  async getOfflineModels() {
    try {
      const result = await chrome.storage.local.get('offlineModels');
      return result.offlineModels || [];
    } catch (error) {
      console.error('Failed to get offline models:', error);
      return [];
    }
  }

  async saveOfflineModel(modelName, modelData) {
    try {
      const models = await this.getOfflineModels();
      models.push({
        name: modelName,
        data: modelData,
        timestamp: Date.now()
      });
      await chrome.storage.local.set({ offlineModels: models });
      return { success: true };
    } catch (error) {
      console.error('Failed to save offline model:', error);
      return { success: false, error: error.message };
    }
  }

  async getTranslationHistory(limit = 100) {
    try {
      const result = await chrome.storage.local.get('translationHistory');
      const history = result.translationHistory || [];
      return history.slice(0, limit);
    } catch (error) {
      console.error('Failed to get translation history:', error);
      return [];
    }
  }

  async saveTranslation(translation) {
    try {
      const settings = await this.getSettings();
      
      // Check if user wants to save translations
      if (settings.dataRetention === 'none') {
        return { success: true, saved: false };
      }

      const history = await this.getTranslationHistory();
      history.unshift({
        ...translation,
        timestamp: Date.now()
      });

      // Keep only recent translations based on retention policy
      const maxItems = this.getMaxHistoryItems(settings.dataRetention);
      const trimmedHistory = history.slice(0, maxItems);

      await chrome.storage.local.set({ translationHistory: trimmedHistory });
      return { success: true, saved: true };
    } catch (error) {
      console.error('Failed to save translation:', error);
      return { success: false, error: error.message };
    }
  }

  getMaxHistoryItems(retention) {
    switch (retention) {
      case 'session':
        return 50;
      case 'day':
        return 200;
      case 'week':
        return 1000;
      case 'month':
        return 5000;
      default:
        return 0;
    }
  }

  async clearHistory() {
    try {
      await chrome.storage.local.remove('translationHistory');
      return { success: true };
    } catch (error) {
      console.error('Failed to clear history:', error);
      return { success: false, error: error.message };
    }
  }

  async clearAllData() {
    try {
      await chrome.storage.local.clear();
      return { success: true };
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return { success: false, error: error.message };
    }
  }

  async updateStatistics(stats) {
    const settings = await this.getSettings();
    settings.totalWords += stats.words || 0;
    settings.totalTime += stats.time || 0;
    settings.sessionsCount += stats.sessions || 0;
    await this.saveSettings(settings);
  }

  detectUserLanguage() {
    // Try to detect user's language from browser
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    // List of supported languages
    const supported = ['ar', 'en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'zh', 'ja', 'ko', 'hi', 'tr'];
    
    return supported.includes(langCode) ? langCode : 'en';
  }

  async exportSettings() {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  async importSettings(jsonString) {
    try {
      const settings = JSON.parse(jsonString);
      await this.saveSettings(settings);
      return { success: true };
    } catch (error) {
      console.error('Failed to import settings:', error);
      return { success: false, error: error.message };
    }
  }
}

export default StorageManager;
