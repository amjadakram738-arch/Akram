// Options Page Controller

class OptionsController {
  constructor() {
    this.settings = {};
    this.hasUnsavedChanges = false;
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupNavigation();
    this.setupEventListeners();
    this.populateUI();
    this.initializeI18n();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get('settings');
      this.settings = result.settings || this.getDefaultSettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.settings = this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      // General
      interfaceLanguage: 'en',
      theme: 'auto',
      autoStart: false,

      // Translation
      translationEngines: ['libre', 'deepl', 'google', 'microsoft', 'mymemory'],
      autoDetectLanguage: true,
      sourceLang: 'auto',
      targetLang: 'en',
      frequentLanguages: ['en'],

      // Audio
      audioCaptureMethod: 'direct',
      noiseFilterLevel: 'medium',
      bufferSize: 3,
      alwaysCapture: true,

      // Display
      displayMode: 'simple',
      fontFamily: 'Arial, sans-serif',
      fontSize: 20,
      textColor: '#ffffff',
      backgroundColor: '#000000',
      bgOpacity: 80,
      textShadow: true,
      subtitlePosition: 'bottom',
      draggableSubtitles: false,

      // Performance
      performanceMode: 'normal',
      gpuAcceleration: false,
      memoryLimit: 100,
      offlineMode: false,

      // Privacy
      localOnlyMode: true,
      dataRetention: 'session',
      anonymousMode: false,

      // Advanced
      customApiUrl: '',
      customApiKey: '',
      betaMode: false,
      sentimentAnalysis: false,
      smartAlerts: false,
      debugMode: false
    };
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.showSection(section);
        
        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Update title
        const sectionTitle = document.getElementById('sectionTitle');
        sectionTitle.textContent = item.textContent.trim();
      });
    });
  }

  showSection(sectionId) {
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }

  setupEventListeners() {
    // Save Button
    document.getElementById('saveBtn').addEventListener('click', () => {
      this.saveSettings();
    });

    // Export Button
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportSettings();
    });

    // Import Button
    document.getElementById('importBtn').addEventListener('click', () => {
      this.importSettings();
    });

    // Reset Button
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetSettings();
    });

    // Clear Data Button
    document.getElementById('clearDataBtn').addEventListener('click', () => {
      this.clearAllData();
    });

    // Download Models Button
    document.getElementById('downloadModelsBtn').addEventListener('click', () => {
      this.downloadOfflineModels();
    });

    // Export Logs Button
    document.getElementById('exportLogsBtn').addEventListener('click', () => {
      this.exportDebugLogs();
    });

    // Offline Mode Toggle
    document.getElementById('offlineModeEnabled').addEventListener('change', (e) => {
      const downloadBtn = document.getElementById('downloadModelsBtn');
      downloadBtn.disabled = !e.target.checked;
    });

    // All input changes
    this.setupInputListeners();
    
    // Position buttons
    document.querySelectorAll('.position-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.position-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.settings.subtitlePosition = btn.dataset.position;
        this.hasUnsavedChanges = true;
      });
    });

    // Sliders with live value display
    this.setupSlider('bufferSize', 'bufferSizeValue');
    this.setupSlider('bgOpacity', 'bgOpacityValue');
    this.setupSlider('memoryLimit', 'memoryLimitValue');
  }

  setupInputListeners() {
    // Get all input elements
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        this.hasUnsavedChanges = true;
        this.updateSaveStatus('Unsaved changes', 'warning');
      });
    });
  }

  setupSlider(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    
    if (slider && valueDisplay) {
      slider.addEventListener('input', (e) => {
        valueDisplay.textContent = e.target.value;
      });
    }
  }

  populateUI() {
    // General
    document.getElementById('interfaceLanguage').value = this.settings.interfaceLanguage;
    document.querySelector(`input[name="theme"][value="${this.settings.theme}"]`).checked = true;
    document.getElementById('autoStart').checked = this.settings.autoStart;

    // Translation
    document.getElementById('autoDetectLanguage').checked = this.settings.autoDetectLanguage;

    // Audio
    document.getElementById('audioCaptureMethod').value = this.settings.audioCaptureMethod;
    document.getElementById('noiseFilterLevel').value = this.settings.noiseFilterLevel;
    document.getElementById('bufferSize').value = this.settings.bufferSize;
    document.getElementById('bufferSizeValue').textContent = this.settings.bufferSize;
    document.getElementById('alwaysCapture').checked = this.settings.alwaysCapture;

    // Display
    document.getElementById('displayMode').value = this.settings.displayMode;
    document.getElementById('fontFamily').value = this.settings.fontFamily;
    document.getElementById('subtitleFontSize').value = this.settings.fontSize;
    document.getElementById('textColor').value = this.settings.textColor;
    document.getElementById('bgColor').value = this.settings.backgroundColor;
    document.getElementById('bgOpacity').value = this.settings.bgOpacity;
    document.getElementById('bgOpacityValue').textContent = this.settings.bgOpacity;
    document.getElementById('textShadow').checked = this.settings.textShadow;
    document.getElementById('draggableSubtitles').checked = this.settings.draggableSubtitles;
    
    // Set position button active
    document.querySelectorAll('.position-btn').forEach(btn => {
      if (btn.dataset.position === this.settings.subtitlePosition) {
        btn.classList.add('active');
      }
    });

    // Performance
    document.getElementById('performanceMode').value = this.settings.performanceMode;
    document.getElementById('gpuAcceleration').checked = this.settings.gpuAcceleration;
    document.getElementById('memoryLimit').value = this.settings.memoryLimit;
    document.getElementById('memoryLimitValue').textContent = this.settings.memoryLimit;
    document.getElementById('offlineModeEnabled').checked = this.settings.offlineMode;
    document.getElementById('downloadModelsBtn').disabled = !this.settings.offlineMode;

    // Privacy
    document.getElementById('localOnlyMode').checked = this.settings.localOnlyMode;
    document.getElementById('dataRetention').value = this.settings.dataRetention;
    document.getElementById('anonymousMode').checked = this.settings.anonymousMode;

    // Advanced
    document.getElementById('customApiUrl').value = this.settings.customApiUrl || '';
    document.getElementById('customApiKey').value = this.settings.customApiKey || '';
    document.getElementById('betaMode').checked = this.settings.betaMode;
    document.getElementById('sentimentAnalysis').checked = this.settings.sentimentAnalysis;
    document.getElementById('smartAlerts').checked = this.settings.smartAlerts;
    document.getElementById('debugMode').checked = this.settings.debugMode;
  }

  async saveSettings() {
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.classList.add('loading');

    try {
      // Collect all settings from UI
      this.settings = {
        // General
        interfaceLanguage: document.getElementById('interfaceLanguage').value,
        theme: document.querySelector('input[name="theme"]:checked').value,
        autoStart: document.getElementById('autoStart').checked,

        // Translation
        autoDetectLanguage: document.getElementById('autoDetectLanguage').checked,

        // Audio
        audioCaptureMethod: document.getElementById('audioCaptureMethod').value,
        noiseFilterLevel: document.getElementById('noiseFilterLevel').value,
        bufferSize: parseInt(document.getElementById('bufferSize').value),
        alwaysCapture: document.getElementById('alwaysCapture').checked,

        // Display
        displayMode: document.getElementById('displayMode').value,
        fontFamily: document.getElementById('fontFamily').value,
        fontSize: parseInt(document.getElementById('subtitleFontSize').value),
        textColor: document.getElementById('textColor').value,
        backgroundColor: document.getElementById('bgColor').value,
        bgOpacity: parseInt(document.getElementById('bgOpacity').value),
        textShadow: document.getElementById('textShadow').checked,
        subtitlePosition: this.settings.subtitlePosition,
        draggableSubtitles: document.getElementById('draggableSubtitles').checked,

        // Performance
        performanceMode: document.getElementById('performanceMode').value,
        gpuAcceleration: document.getElementById('gpuAcceleration').checked,
        memoryLimit: parseInt(document.getElementById('memoryLimit').value),
        offlineMode: document.getElementById('offlineModeEnabled').checked,

        // Privacy
        localOnlyMode: document.getElementById('localOnlyMode').checked,
        dataRetention: document.getElementById('dataRetention').value,
        anonymousMode: document.getElementById('anonymousMode').checked,

        // Advanced
        customApiUrl: document.getElementById('customApiUrl').value,
        customApiKey: document.getElementById('customApiKey').value,
        betaMode: document.getElementById('betaMode').checked,
        sentimentAnalysis: document.getElementById('sentimentAnalysis').checked,
        smartAlerts: document.getElementById('smartAlerts').checked,
        debugMode: document.getElementById('debugMode').checked
      };

      await chrome.storage.sync.set({ settings: this.settings });
      
      this.hasUnsavedChanges = false;
      this.updateSaveStatus('✓ Settings saved successfully', 'success');
      
      setTimeout(() => {
        this.updateSaveStatus('', '');
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.updateSaveStatus('✗ Failed to save settings', 'error');
    } finally {
      saveBtn.classList.remove('loading');
    }
  }

  updateSaveStatus(message, type) {
    const saveStatus = document.getElementById('saveStatus');
    saveStatus.textContent = message;
    saveStatus.className = `save-status ${type}`;
  }

  exportSettings() {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'video-translator-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          this.settings = { ...this.getDefaultSettings(), ...imported };
          await chrome.storage.sync.set({ settings: this.settings });
          this.populateUI();
          this.updateSaveStatus('✓ Settings imported successfully', 'success');
        } catch (error) {
          this.updateSaveStatus('✗ Failed to import settings', 'error');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }

  async resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      this.settings = this.getDefaultSettings();
      await chrome.storage.sync.set({ settings: this.settings });
      this.populateUI();
      this.updateSaveStatus('✓ Settings reset to defaults', 'success');
    }
  }

  async clearAllData() {
    if (confirm('Are you sure you want to delete all saved translations and cache? This action cannot be undone.')) {
      try {
        await chrome.storage.local.clear();
        this.updateSaveStatus('✓ All data cleared', 'success');
      } catch (error) {
        this.updateSaveStatus('✗ Failed to clear data', 'error');
      }
    }
  }

  async downloadOfflineModels() {
    this.updateSaveStatus('⬇️ Downloading offline models...', 'warning');
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'downloadOfflineModel',
        data: { modelName: 'whisper-tiny' }
      });
      
      if (response.success) {
        this.updateSaveStatus('✓ Offline models downloaded', 'success');
      } else {
        this.updateSaveStatus('⚠️ ' + response.message, 'warning');
      }
    } catch (error) {
      this.updateSaveStatus('✗ Failed to download models', 'error');
    }
  }

  exportDebugLogs() {
    const logs = {
      timestamp: new Date().toISOString(),
      settings: this.settings,
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      }
    };
    
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `video-translator-logs-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  initializeI18n() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const message = chrome.i18n.getMessage(key);
      if (message) {
        element.textContent = message;
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new OptionsController();
});

// Warn about unsaved changes
window.addEventListener('beforeunload', (e) => {
  const controller = window.optionsController;
  if (controller && controller.hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = '';
  }
});
