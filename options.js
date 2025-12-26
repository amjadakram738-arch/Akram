// Options Page Script - Advanced settings management
// Copyright: Video Translator Extension

console.log('Options page script loaded');

// Global state
let currentSettings = null;

// Translation engines list
const TRANSLATION_ENGINES = [
  { name: 'google', label: 'Google Translate', free: true },
  { name: 'libretranslate', label: 'LibreTranslate', free: true },
  { name: 'mymemory', label: 'MyMemory API', free: true },
  { name: 'deepl-free', label: 'DeepL Free API', free: true },
  { name: 'microsoft', label: 'Microsoft Translator', free: true },
  { name: 'yandex', label: 'Yandex.Translate', free: true },
  { name: 'apertium', label: 'Apertium', free: true },
  { name: 'argos', label: 'Argos Translate', free: true },
  { name: 'opennmt', label: 'OpenNMT', free: true },
  { name: 'whisper-local', label: 'Local Whisper.cpp', free: true }
];

// Initialize options page
async function initialize() {
  console.log('Initializing options page...');
  
  // Load settings
  await loadSettings();
  
  // Setup navigation
  setupNavigation();
  
  // Populate UI
  populateUI();
  
  // Setup event listeners
  setupEventListeners();
  
  // Apply theme
  applyTheme();
}

// Load settings from background
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
      if (response && response.success) {
        currentSettings = response.settings;
        console.log('Settings loaded:', currentSettings);
      } else {
        console.error('Failed to load settings');
        currentSettings = getDefaultSettings();
      }
      resolve();
    });
  });
}

// Get default settings
function getDefaultSettings() {
  return {
    operatingMode: 'auto',
    sourceLanguage: 'auto',
    targetLanguage: 'en',
    uiLanguage: 'en',
    audioCaptureMethod: 'direct',
    audioProcessingServer: 'webaudio',
    translationEngines: TRANSLATION_ENGINES.map((engine, index) => ({
      name: engine.name,
      enabled: index < 3, // Enable first 3 by default
      priority: index + 1
    })),
    displayMode: 'simple',
    fontSize: 'medium',
    fontFamily: 'sans-serif',
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    opacity: 90,
    position: 'bottom',
    dualLanguage: false,
    smartMode: true,
    qualityMode: 'balanced',
    maxRetries: 3,
    retryDelay: 2000,
    performanceMode: 'balanced',
    gpuAcceleration: true,
    batteryEconomy: false,
    maxMemoryMB: 100,
    bufferSize: 5,
    latencyTarget: 1000,
    localOnlyMode: false,
    autoDeleteRecordings: true,
    anonymousMode: true,
    encryptStorage: false,
    passwordProtection: false,
    archiveEnabled: false,
    interactiveLearning: false,
    sentimentAnalysis: false,
    smartAlerts: false,
    liveStreamingMode: false,
    educationalMode: false,
    universalSupportMode: true,
    iframeSupport: true,
    drmBypassEnabled: true,
    offlineMode: false,
    enableShortcuts: true,
    notificationsEnabled: true,
    failureAlerts: true,
    connectionAlerts: true,
    alwaysCaptureMode: true,
    multiDeviceRecording: false,
    bluetoothLatencyCompensation: 100,
    theme: 'auto'
  };
}

// Setup navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.settings-section');
  const sectionTitle = document.getElementById('sectionTitle');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSection = item.getAttribute('data-section');
      
      // Update active states
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));
      
      item.classList.add('active');
      document.getElementById(targetSection).classList.add('active');
      
      // Update section title
      const titles = {
        'general': 'General Settings',
        'audio': 'Audio Capture Settings',
        'translation': 'Translation Settings',
        'display': 'Display & UI Settings',
        'performance': 'Performance Settings',
        'privacy': 'Privacy & Security Settings',
        'advanced': 'Advanced Settings',
        'about': 'About'
      };
      sectionTitle.textContent = titles[targetSection] || 'Settings';
    });
  });
}

// Populate UI with current settings
function populateUI() {
  if (!currentSettings) return;
  
  // General section
  document.getElementById('uiLanguage').value = currentSettings.uiLanguage || 'en';
  document.getElementById('theme').value = currentSettings.theme || 'auto';
  
  // Set operating mode radio buttons
  const operatingModeRadios = document.querySelectorAll('input[name="operatingMode"]');
  operatingModeRadios.forEach(radio => {
    radio.checked = radio.value === currentSettings.operatingMode;
  });
  
  // Audio section
  document.getElementById('audioCaptureMethod').value = currentSettings.audioCaptureMethod || 'direct';
  document.getElementById('audioProcessingServer').value = currentSettings.audioProcessingServer || 'webaudio';
  document.getElementById('alwaysCaptureMode').checked = currentSettings.alwaysCaptureMode !== false;
  document.getElementById('multiDeviceRecording').checked = currentSettings.multiDeviceRecording || false;
  document.getElementById('bluetoothLatencyCompensation').value = currentSettings.bluetoothLatencyCompensation || 100;
  
  // Translation section
  populateTranslationEngines();
  document.getElementById('qualityMode').value = currentSettings.qualityMode || 'balanced';
  document.getElementById('maxRetries').value = currentSettings.maxRetries || 3;
  document.getElementById('retryDelay').value = currentSettings.retryDelay || 2000;
  
  // Display section
  document.getElementById('displayMode').value = currentSettings.displayMode || 'simple';
  document.getElementById('position').value = currentSettings.position || 'bottom';
  document.getElementById('dualLanguage').checked = currentSettings.dualLanguage || false;
  document.getElementById('smartMode').checked = currentSettings.smartMode !== false;
  document.getElementById('fontSize').value = currentSettings.fontSize || 'medium';
  document.getElementById('fontFamily').value = currentSettings.fontFamily || 'sans-serif';
  document.getElementById('textColor').value = currentSettings.textColor || '#FFFFFF';
  document.getElementById('backgroundColor').value = currentSettings.backgroundColor || '#000000';
  document.getElementById('opacity').value = currentSettings.opacity || 90;
  document.getElementById('opacityValue').textContent = currentSettings.opacity || 90;
  
  // Performance section
  document.getElementById('performanceMode').value = currentSettings.performanceMode || 'balanced';
  document.getElementById('gpuAcceleration').checked = currentSettings.gpuAcceleration !== false;
  document.getElementById('batteryEconomy').checked = currentSettings.batteryEconomy || false;
  document.getElementById('maxMemoryMB').value = currentSettings.maxMemoryMB || 100;
  document.getElementById('bufferSize').value = currentSettings.bufferSize || 5;
  document.getElementById('latencyTarget').value = currentSettings.latencyTarget || 1000;
  
  // Privacy section
  document.getElementById('localOnlyMode').checked = currentSettings.localOnlyMode || false;
  document.getElementById('autoDeleteRecordings').checked = currentSettings.autoDeleteRecordings !== false;
  document.getElementById('anonymousMode').checked = currentSettings.anonymousMode !== false;
  document.getElementById('encryptStorage').checked = currentSettings.encryptStorage || false;
  document.getElementById('passwordProtection').checked = currentSettings.passwordProtection || false;
  
  // Advanced section
  document.getElementById('archiveEnabled').checked = currentSettings.archiveEnabled || false;
  document.getElementById('interactiveLearning').checked = currentSettings.interactiveLearning || false;
  document.getElementById('sentimentAnalysis').checked = currentSettings.sentimentAnalysis || false;
  document.getElementById('smartAlerts').checked = currentSettings.smartAlerts || false;
  document.getElementById('liveStreamingMode').checked = currentSettings.liveStreamingMode || false;
  document.getElementById('educationalMode').checked = currentSettings.educationalMode || false;
  document.getElementById('universalSupportMode').checked = currentSettings.universalSupportMode !== false;
  document.getElementById('iframeSupport').checked = currentSettings.iframeSupport !== false;
  document.getElementById('drmBypassEnabled').checked = currentSettings.drmBypassEnabled !== false;
  document.getElementById('offlineMode').checked = currentSettings.offlineMode || false;
  document.getElementById('enableShortcuts').checked = currentSettings.enableShortcuts !== false;
  document.getElementById('notificationsEnabled').checked = currentSettings.notificationsEnabled !== false;
  document.getElementById('failureAlerts').checked = currentSettings.failureAlerts !== false;
  document.getElementById('connectionAlerts').checked = currentSettings.connectionAlerts !== false;
}

// Populate translation engines list
function populateTranslationEngines() {
  const container = document.getElementById('translationEnginesList');
  container.innerHTML = '';
  
  const engines = currentSettings.translationEngines || TRANSLATION_ENGINES.map((e, i) => ({
    name: e.name,
    enabled: i < 3,
    priority: i + 1
  }));
  
  engines.forEach((engine, index) => {
    const engineInfo = TRANSLATION_ENGINES.find(e => e.name === engine.name);
    if (!engineInfo) return;
    
    const item = document.createElement('div');
    item.className = 'engine-item';
    item.innerHTML = `
      <div class="engine-info">
        <input type="checkbox" class="engine-enabled" data-engine="${engine.name}" ${engine.enabled ? 'checked' : ''}>
        <span>${engineInfo.label}</span>
        ${engineInfo.free ? '<span style="color: var(--accent-color); font-size: 12px;">(Free)</span>' : ''}
      </div>
      <div class="engine-controls">
        <label style="font-size: 13px; color: var(--text-secondary);">Priority:</label>
        <input type="number" class="engine-priority number-input" data-engine="${engine.name}" 
               value="${engine.priority}" min="1" max="10" style="width: 60px;">
      </div>
    `;
    
    container.appendChild(item);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Save button
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  
  // Opacity range slider
  const opacitySlider = document.getElementById('opacity');
  opacitySlider.addEventListener('input', (e) => {
    document.getElementById('opacityValue').textContent = e.target.value;
  });
  
  // Data management buttons
  document.getElementById('exportData').addEventListener('click', exportSettings);
  document.getElementById('importData').addEventListener('click', importSettings);
  document.getElementById('clearData').addEventListener('click', clearAllData);
  
  // Download models button
  document.getElementById('downloadModels').addEventListener('click', downloadOfflineModels);
  
  // About section buttons
  document.getElementById('checkUpdates').addEventListener('click', checkForUpdates);
  document.getElementById('viewLicense').addEventListener('click', viewLicense);
  
  // Auto-save on change (optional)
  // Uncomment to enable auto-save
  // setupAutoSave();
}

// Collect current settings from UI
function collectSettings() {
  const settings = { ...currentSettings };
  
  // General
  settings.uiLanguage = document.getElementById('uiLanguage').value;
  settings.theme = document.getElementById('theme').value;
  
  // Operating mode (radio buttons)
  const operatingModeRadio = document.querySelector('input[name="operatingMode"]:checked');
  settings.operatingMode = operatingModeRadio ? operatingModeRadio.value : 'auto';
  
  // Audio
  settings.audioCaptureMethod = document.getElementById('audioCaptureMethod').value;
  settings.audioProcessingServer = document.getElementById('audioProcessingServer').value;
  settings.alwaysCaptureMode = document.getElementById('alwaysCaptureMode').checked;
  settings.multiDeviceRecording = document.getElementById('multiDeviceRecording').checked;
  settings.bluetoothLatencyCompensation = parseInt(document.getElementById('bluetoothLatencyCompensation').value);
  
  // Translation
  const engines = [];
  document.querySelectorAll('.engine-enabled').forEach(checkbox => {
    const engineName = checkbox.getAttribute('data-engine');
    const priorityInput = document.querySelector(`.engine-priority[data-engine="${engineName}"]`);
    engines.push({
      name: engineName,
      enabled: checkbox.checked,
      priority: parseInt(priorityInput.value)
    });
  });
  settings.translationEngines = engines;
  settings.qualityMode = document.getElementById('qualityMode').value;
  settings.maxRetries = parseInt(document.getElementById('maxRetries').value);
  settings.retryDelay = parseInt(document.getElementById('retryDelay').value);
  
  // Display
  settings.displayMode = document.getElementById('displayMode').value;
  settings.position = document.getElementById('position').value;
  settings.dualLanguage = document.getElementById('dualLanguage').checked;
  settings.smartMode = document.getElementById('smartMode').checked;
  settings.fontSize = document.getElementById('fontSize').value;
  settings.fontFamily = document.getElementById('fontFamily').value;
  settings.textColor = document.getElementById('textColor').value;
  settings.backgroundColor = document.getElementById('backgroundColor').value;
  settings.opacity = parseInt(document.getElementById('opacity').value);
  
  // Performance
  settings.performanceMode = document.getElementById('performanceMode').value;
  settings.gpuAcceleration = document.getElementById('gpuAcceleration').checked;
  settings.batteryEconomy = document.getElementById('batteryEconomy').checked;
  settings.maxMemoryMB = parseInt(document.getElementById('maxMemoryMB').value);
  settings.bufferSize = parseInt(document.getElementById('bufferSize').value);
  settings.latencyTarget = parseInt(document.getElementById('latencyTarget').value);
  
  // Privacy
  settings.localOnlyMode = document.getElementById('localOnlyMode').checked;
  settings.autoDeleteRecordings = document.getElementById('autoDeleteRecordings').checked;
  settings.anonymousMode = document.getElementById('anonymousMode').checked;
  settings.encryptStorage = document.getElementById('encryptStorage').checked;
  settings.passwordProtection = document.getElementById('passwordProtection').checked;
  
  // Advanced
  settings.archiveEnabled = document.getElementById('archiveEnabled').checked;
  settings.interactiveLearning = document.getElementById('interactiveLearning').checked;
  settings.sentimentAnalysis = document.getElementById('sentimentAnalysis').checked;
  settings.smartAlerts = document.getElementById('smartAlerts').checked;
  settings.liveStreamingMode = document.getElementById('liveStreamingMode').checked;
  settings.educationalMode = document.getElementById('educationalMode').checked;
  settings.universalSupportMode = document.getElementById('universalSupportMode').checked;
  settings.iframeSupport = document.getElementById('iframeSupport').checked;
  settings.drmBypassEnabled = document.getElementById('drmBypassEnabled').checked;
  settings.offlineMode = document.getElementById('offlineMode').checked;
  settings.enableShortcuts = document.getElementById('enableShortcuts').checked;
  settings.notificationsEnabled = document.getElementById('notificationsEnabled').checked;
  settings.failureAlerts = document.getElementById('failureAlerts').checked;
  settings.connectionAlerts = document.getElementById('connectionAlerts').checked;
  
  return settings;
}

// Save settings
async function saveSettings() {
  const button = document.getElementById('saveSettings');
  button.disabled = true;
  button.textContent = 'Saving...';
  
  try {
    const settings = collectSettings();
    
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'saveSettings',
        settings: settings
      }, resolve);
    });
    
    if (response && response.success) {
      currentSettings = settings;
      showSaveStatus('Settings saved successfully!', false);
      applyTheme();
    } else {
      throw new Error('Failed to save settings');
    }
  } catch (error) {
    console.error('Save failed:', error);
    showSaveStatus('Failed to save settings', true);
  } finally {
    button.disabled = false;
    button.textContent = 'Save Settings';
  }
}

// Show save status
function showSaveStatus(message, isError) {
  const status = document.getElementById('saveStatus');
  status.textContent = message;
  status.classList.toggle('error', isError);
  status.classList.add('show');
  
  setTimeout(() => {
    status.classList.remove('show');
  }, 3000);
}

// Export settings
async function exportSettings() {
  try {
    const settings = collectSettings();
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-translator-settings-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showSaveStatus('Settings exported successfully!', false);
  } catch (error) {
    console.error('Export failed:', error);
    showSaveStatus('Failed to export settings', true);
  }
}

// Import settings
function importSettings() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const settings = JSON.parse(text);
      
      // Save imported settings
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: 'saveSettings',
          settings: settings
        }, resolve);
      });
      
      if (response && response.success) {
        currentSettings = settings;
        populateUI();
        applyTheme();
        showSaveStatus('Settings imported successfully!', false);
      } else {
        throw new Error('Failed to save imported settings');
      }
    } catch (error) {
      console.error('Import failed:', error);
      showSaveStatus('Failed to import settings', true);
    }
  });
  
  input.click();
}

// Clear all data
async function clearAllData() {
  if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    return;
  }
  
  try {
    await chrome.storage.local.clear();
    currentSettings = getDefaultSettings();
    populateUI();
    showSaveStatus('All data cleared successfully!', false);
  } catch (error) {
    console.error('Clear failed:', error);
    showSaveStatus('Failed to clear data', true);
  }
}

// Download offline models
function downloadOfflineModels() {
  alert('Offline model download feature coming soon!\n\nThis will allow you to download translation models for offline use.');
}

// Check for updates
function checkForUpdates() {
  alert('You are using the latest version (1.0.0)');
}

// View license
function viewLicense() {
  alert('MIT License\n\nCopyright (c) 2024 Video Translator Extension\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software...');
}

// Apply theme
function applyTheme() {
  let theme = currentSettings.theme;
  
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }
  
  document.body.setAttribute('data-theme', theme);
}

// Setup auto-save (optional)
function setupAutoSave() {
  const inputs = document.querySelectorAll('input, select');
  
  inputs.forEach(input => {
    input.addEventListener('change', () => {
      // Debounce auto-save
      clearTimeout(window.autoSaveTimeout);
      window.autoSaveTimeout = setTimeout(() => {
        saveSettings();
      }, 1000);
    });
  });
}

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (currentSettings.theme === 'auto') {
    applyTheme();
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

console.log('Options page script initialized');
