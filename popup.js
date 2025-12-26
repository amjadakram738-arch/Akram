// Popup Script - Main Control Panel

class PopupController {
  constructor() {
    this.isActive = false;
    this.currentSettings = {};
    this.stats = {
      words: 0,
      time: 0,
      accuracy: '--'
    };
    this.timeInterval = null;
    
    this.init();
  }

  async init() {
    // Load saved settings
    await this.loadSettings();
    
    // Set up UI
    this.setupEventListeners();
    this.updateUI();
    this.initializeI18n();
    
    // Check current status
    await this.checkStatus();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get('settings');
      this.currentSettings = result.settings || this.getDefaultSettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.currentSettings = this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      sourceLang: 'auto',
      targetLang: 'en',
      operatingMode: 'normal',
      captureMode: 'direct',
      subtitlePosition: 'bottom',
      fontSize: 20,
      offlineMode: false,
      noiseReduction: true,
      theme: 'auto',
      textColor: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      translationEngine: 'auto',
      subtitleDuration: 5000,
      chunkDuration: 3000
    };
  }

  setupEventListeners() {
    // Toggle Button
    document.getElementById('toggleBtn').addEventListener('click', () => {
      this.toggleTranslation();
    });

    // Settings Button
    document.getElementById('settingsBtn').addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });

    // Advanced Settings Button
    document.getElementById('advancedSettingsBtn').addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });

    // Help Button
    document.getElementById('helpBtn').addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://github.com/video-translator/help' });
    });

    // Source Language
    document.getElementById('sourceLang').addEventListener('change', (e) => {
      this.currentSettings.sourceLang = e.target.value;
      this.saveSettings();
    });

    // Target Language
    document.getElementById('targetLang').addEventListener('change', (e) => {
      this.currentSettings.targetLang = e.target.value;
      this.saveSettings();
    });

    // Operating Mode
    document.getElementById('operatingMode').addEventListener('change', (e) => {
      this.currentSettings.operatingMode = e.target.value;
      this.saveSettings();
    });

    // Capture Mode
    document.getElementById('captureMode').addEventListener('change', (e) => {
      this.currentSettings.captureMode = e.target.value;
      this.saveSettings();
    });

    // Subtitle Position
    document.getElementById('subtitlePosition').addEventListener('change', (e) => {
      this.currentSettings.subtitlePosition = e.target.value;
      this.saveSettings();
      if (this.isActive) {
        this.sendMessageToContent({ action: 'updatePosition', position: e.target.value });
      }
    });

    // Font Size
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    
    fontSizeInput.addEventListener('input', (e) => {
      fontSizeValue.textContent = e.target.value;
      this.currentSettings.fontSize = parseInt(e.target.value);
    });

    fontSizeInput.addEventListener('change', () => {
      this.saveSettings();
      if (this.isActive) {
        this.sendMessageToContent({ action: 'updateFontSize', fontSize: this.currentSettings.fontSize });
      }
    });

    // Offline Mode
    document.getElementById('offlineMode').addEventListener('change', (e) => {
      this.currentSettings.offlineMode = e.target.checked;
      this.saveSettings();
    });

    // Noise Reduction
    document.getElementById('noiseReduction').addEventListener('change', (e) => {
      this.currentSettings.noiseReduction = e.target.checked;
      this.saveSettings();
    });
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({ settings: this.currentSettings });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  updateUI() {
    // Update form values from settings
    document.getElementById('sourceLang').value = this.currentSettings.sourceLang;
    document.getElementById('targetLang').value = this.currentSettings.targetLang;
    document.getElementById('operatingMode').value = this.currentSettings.operatingMode;
    document.getElementById('captureMode').value = this.currentSettings.captureMode;
    document.getElementById('subtitlePosition').value = this.currentSettings.subtitlePosition;
    document.getElementById('fontSize').value = this.currentSettings.fontSize;
    document.getElementById('fontSizeValue').textContent = this.currentSettings.fontSize;
    document.getElementById('offlineMode').checked = this.currentSettings.offlineMode;
    document.getElementById('noiseReduction').checked = this.currentSettings.noiseReduction;

    // Update status
    this.updateStatus();
  }

  updateStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleBtnText = document.getElementById('toggleBtnText');

    if (this.isActive) {
      statusDot.classList.add('active');
      statusText.textContent = chrome.i18n.getMessage('statusActive') || 'Active';
      statusText.parentElement.classList.add('active');
      toggleBtn.classList.add('danger');
      toggleBtnText.textContent = chrome.i18n.getMessage('stopTranslation') || 'Stop Translation';
    } else {
      statusDot.classList.remove('active');
      statusText.textContent = chrome.i18n.getMessage('statusInactive') || 'Inactive';
      statusText.parentElement.classList.remove('active');
      toggleBtn.classList.remove('danger');
      toggleBtnText.textContent = chrome.i18n.getMessage('startTranslation') || 'Start Translation';
    }

    // Update stats
    document.getElementById('statWords').textContent = this.stats.words;
    document.getElementById('statTime').textContent = this.formatTime(this.stats.time);
    document.getElementById('statAccuracy').textContent = this.stats.accuracy;
  }

  async toggleTranslation() {
    const toggleBtn = document.getElementById('toggleBtn');
    toggleBtn.classList.add('loading');

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (this.isActive) {
        // Stop translation
        await chrome.runtime.sendMessage({
          action: 'stopTranslation',
          data: { tabId: tab.id }
        });
        
        this.isActive = false;
        this.stopTimer();
      } else {
        // Start translation
        const response = await chrome.runtime.sendMessage({
          action: 'startTranslation',
          data: { tabId: tab.id, ...this.currentSettings }
        });
        
        if (response.success) {
          this.isActive = true;
          this.startTimer();
        } else {
          throw new Error(response.error || 'Failed to start translation');
        }
      }
      
      this.updateStatus();
    } catch (error) {
      console.error('Toggle translation error:', error);
      this.showError(error.message);
    } finally {
      toggleBtn.classList.remove('loading');
    }
  }

  async checkStatus() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.runtime.sendMessage({
        action: 'getTranslationStatus',
        data: { tabId: tab.id }
      });
      
      if (response && response.isActive) {
        this.isActive = true;
        this.startTimer();
        this.updateStatus();
      }
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  }

  startTimer() {
    this.stats.time = 0;
    this.timeInterval = setInterval(() => {
      this.stats.time++;
      document.getElementById('statTime').textContent = this.formatTime(this.stats.time);
    }, 1000);
  }

  stopTimer() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  async sendMessageToContent(message) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.tabs.sendMessage(tab.id, message);
    } catch (error) {
      console.error('Failed to send message to content:', error);
    }
  }

  showError(message) {
    // Simple error notification
    const statusText = document.getElementById('statusText');
    const originalText = statusText.textContent;
    statusText.textContent = `Error: ${message}`;
    statusText.style.color = 'var(--danger-color)';
    
    setTimeout(() => {
      statusText.textContent = originalText;
      statusText.style.color = '';
    }, 3000);
  }

  initializeI18n() {
    // Apply internationalization to all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const message = chrome.i18n.getMessage(key);
      if (message) {
        element.textContent = message;
      }
    });

    // Update specific elements
    const extensionTitle = document.getElementById('extensionTitle');
    if (extensionTitle) {
      extensionTitle.textContent = chrome.i18n.getMessage('extensionName') || 'Video Translator';
    }
  }
}

// Initialize popup controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
