// Background Service Worker for Video Translator Extension
// Handles audio capture, translation coordination, and global state management

import { TranslationEngine } from './lib/translation-engine.js';
import { AudioProcessor } from './lib/audio-processor.js';
import { StorageManager } from './lib/storage-manager.js';

class BackgroundService {
  constructor() {
    this.translationEngine = new TranslationEngine();
    this.audioProcessor = new AudioProcessor();
    this.storageManager = new StorageManager();
    this.activeTranslations = new Map();
    this.init();
  }

  async init() {
    // Load saved settings
    await this.storageManager.init();
    
    // Set up listeners
    this.setupMessageListeners();
    this.setupContextMenus();
    this.setupCommandListeners();
    this.setupTabListeners();
    
    // Check for offline models
    await this.checkOfflineModels();
    
    console.log('Video Translator Extension: Background service initialized');
  }

  setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender).then(sendResponse).catch(error => {
        console.error('Message handler error:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true; // Async response
    });
  }

  async handleMessage(message, sender) {
    const { action, data } = message;
    
    switch (action) {
      case 'startTranslation':
        return await this.startTranslation(sender.tab.id, data);
      
      case 'stopTranslation':
        return await this.stopTranslation(sender.tab.id);
      
      case 'captureAudio':
        return await this.captureAudio(sender.tab.id, data);
      
      case 'translateText':
        return await this.translateText(data);
      
      case 'getSettings':
        return await this.storageManager.getSettings();
      
      case 'saveSettings':
        return await this.storageManager.saveSettings(data);
      
      case 'detectLanguage':
        return await this.translationEngine.detectLanguage(data.text);
      
      case 'downloadOfflineModel':
        return await this.downloadOfflineModel(data.modelName);
      
      case 'getTranslationStatus':
        return this.getTranslationStatus(sender.tab.id);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  setupContextMenus() {
    chrome.contextMenus.create({
      id: 'translate-video',
      title: chrome.i18n.getMessage('contextMenuTranslateVideo'),
      contexts: ['video']
    });

    chrome.contextMenus.create({
      id: 'translate-audio',
      title: chrome.i18n.getMessage('contextMenuTranslateAudio'),
      contexts: ['audio']
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === 'translate-video' || info.menuItemId === 'translate-audio') {
        this.startTranslation(tab.id, { autoStart: true });
      }
    });
  }

  setupCommandListeners() {
    chrome.commands.onCommand.addListener(async (command) => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      switch (command) {
        case 'toggle-translation':
          await this.toggleTranslation(tab.id);
          break;
        case 'increase-font':
          await this.adjustFontSize(tab.id, 2);
          break;
        case 'decrease-font':
          await this.adjustFontSize(tab.id, -2);
          break;
      }
    });
  }

  setupTabListeners() {
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.stopTranslation(tabId);
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.url) {
        // URL changed, stop current translation
        this.stopTranslation(tabId);
      }
    });
  }

  async startTranslation(tabId, options = {}) {
    try {
      const settings = await this.storageManager.getSettings();
      
      // Initialize translation session
      const session = {
        tabId,
        startTime: Date.now(),
        settings: { ...settings, ...options },
        isActive: true
      };
      
      this.activeTranslations.set(tabId, session);
      
      // Inject content script if needed
      await this.ensureContentScript(tabId);
      
      // Notify content script
      await chrome.tabs.sendMessage(tabId, {
        action: 'initializeTranslation',
        settings: session.settings
      });
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: chrome.i18n.getMessage('notificationStarted'),
        message: chrome.i18n.getMessage('notificationStartedMessage')
      });
      
      return { success: true, sessionId: tabId };
    } catch (error) {
      console.error('Failed to start translation:', error);
      return { success: false, error: error.message };
    }
  }

  async stopTranslation(tabId) {
    const session = this.activeTranslations.get(tabId);
    if (!session) {
      return { success: false, error: 'No active translation session' };
    }

    try {
      // Notify content script
      await chrome.tabs.sendMessage(tabId, {
        action: 'stopTranslation'
      }).catch(() => {}); // Ignore errors if tab is closed

      // Clean up session
      this.activeTranslations.delete(tabId);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to stop translation:', error);
      return { success: false, error: error.message };
    }
  }

  async toggleTranslation(tabId) {
    if (this.activeTranslations.has(tabId)) {
      return await this.stopTranslation(tabId);
    } else {
      return await this.startTranslation(tabId);
    }
  }

  async captureAudio(tabId, options) {
    try {
      const audioData = await this.audioProcessor.captureFromTab(tabId, options);
      return { success: true, audioData };
    } catch (error) {
      console.error('Audio capture failed:', error);
      return { success: false, error: error.message };
    }
  }

  async translateText(data) {
    try {
      const { text, sourceLang, targetLang, engine } = data;
      const result = await this.translationEngine.translate(text, sourceLang, targetLang, engine);
      return { success: true, translation: result };
    } catch (error) {
      console.error('Translation failed:', error);
      return { success: false, error: error.message };
    }
  }

  async ensureContentScript(tabId) {
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    } catch {
      // Content script not loaded, inject it
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
      
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: ['content.css']
      });
    }
  }

  async adjustFontSize(tabId, delta) {
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: 'adjustFontSize',
        delta
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async checkOfflineModels() {
    const models = await this.storageManager.getOfflineModels();
    console.log('Available offline models:', models);
  }

  async downloadOfflineModel(modelName) {
    // This would download and store offline translation models
    // Implementation depends on the specific model system used
    return { success: true, message: 'Offline model download not yet implemented' };
  }

  getTranslationStatus(tabId) {
    const session = this.activeTranslations.get(tabId);
    return {
      isActive: !!session,
      session: session || null
    };
  }
}

// Initialize background service
const backgroundService = new BackgroundService();

// Handle installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // First time installation
    await backgroundService.storageManager.setDefaultSettings();
    chrome.tabs.create({ url: 'options.html' });
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('Extension updated to version', chrome.runtime.getManifest().version);
  }
});

export default backgroundService;
