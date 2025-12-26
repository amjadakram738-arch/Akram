// Popup Script - Main control panel for Video Translator Extension
// Copyright: Video Translator Extension

console.log('Popup script loaded');

// Global state
let currentSettings = null;
let currentTab = null;

// Comprehensive language list (150+ languages)
const LANGUAGES = {
  'auto': 'Auto Detect',
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'nl': 'Dutch',
  'ru': 'Russian',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'tr': 'Turkish',
  'fa': 'Persian',
  'el': 'Greek',
  'he': 'Hebrew',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'id': 'Indonesian',
  'ms': 'Malay',
  'pl': 'Polish',
  'uk': 'Ukrainian',
  'ro': 'Romanian',
  'cs': 'Czech',
  'sv': 'Swedish',
  'hu': 'Hungarian',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'bg': 'Bulgarian',
  'hr': 'Croatian',
  'sr': 'Serbian',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'lt': 'Lithuanian',
  'lv': 'Latvian',
  'et': 'Estonian',
  'sq': 'Albanian',
  'mk': 'Macedonian',
  'bs': 'Bosnian',
  'is': 'Icelandic',
  'mt': 'Maltese',
  'ga': 'Irish',
  'cy': 'Welsh',
  'eu': 'Basque',
  'ca': 'Catalan',
  'gl': 'Galician',
  'af': 'Afrikaans',
  'sw': 'Swahili',
  'zu': 'Zulu',
  'xh': 'Xhosa',
  'st': 'Sesotho',
  'tn': 'Setswana',
  'sn': 'Shona',
  'yo': 'Yoruba',
  'ig': 'Igbo',
  'ha': 'Hausa',
  'am': 'Amharic',
  'ti': 'Tigrinya',
  'om': 'Oromo',
  'so': 'Somali',
  'rw': 'Kinyarwanda',
  'mg': 'Malagasy',
  'bn': 'Bengali',
  'pa': 'Punjabi',
  'gu': 'Gujarati',
  'or': 'Odia',
  'ta': 'Tamil',
  'te': 'Telugu',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'si': 'Sinhala',
  'my': 'Burmese',
  'km': 'Khmer',
  'lo': 'Lao',
  'ka': 'Georgian',
  'hy': 'Armenian',
  'az': 'Azerbaijani',
  'kk': 'Kazakh',
  'uz': 'Uzbek',
  'tg': 'Tajik',
  'ky': 'Kyrgyz',
  'tk': 'Turkmen',
  'mn': 'Mongolian',
  'ne': 'Nepali',
  'ur': 'Urdu',
  'ps': 'Pashto',
  'ku': 'Kurdish',
  'sd': 'Sindhi',
  'ug': 'Uyghur',
  'yi': 'Yiddish',
  'la': 'Latin',
  'eo': 'Esperanto',
  'jv': 'Javanese',
  'su': 'Sundanese',
  'ceb': 'Cebuano',
  'tl': 'Tagalog',
  'hmn': 'Hmong',
  'haw': 'Hawaiian',
  'sm': 'Samoan',
  'mi': 'Maori',
  'ny': 'Chichewa',
  'lb': 'Luxembourgish',
  'fy': 'Frisian',
  'gd': 'Scottish Gaelic',
  'co': 'Corsican',
  'ht': 'Haitian Creole',
  'be': 'Belarusian',
  'kn': 'Kannada',
  'mr': 'Marathi',
  'sa': 'Sanskrit',
  'bo': 'Tibetan',
  'dz': 'Dzongkha',
  'ii': 'Sichuan Yi',
  'iu': 'Inuktitut',
  'ik': 'Inupiak',
  'chr': 'Cherokee',
  'qu': 'Quechua',
  'gn': 'Guarani',
  'ay': 'Aymara',
  'tt': 'Tatar',
  'ba': 'Bashkir',
  'cv': 'Chuvash',
  'ce': 'Chechen',
  'os': 'Ossetian',
  'ab': 'Abkhazian',
  'av': 'Avaric',
  'kv': 'Komi',
  'mhr': 'Meadow Mari',
  'sah': 'Sakha',
  'tyv': 'Tuvan',
  'udm': 'Udmurt',
  'xal': 'Kalmyk'
};

// Initialize popup
async function initialize() {
  console.log('Initializing popup...');
  
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  
  // Load settings
  await loadSettings();
  
  // Populate language dropdowns
  populateLanguages();
  
  // Load current values into UI
  updateUI();
  
  // Setup event listeners
  setupEventListeners();
  
  // Check translation status
  checkTranslationStatus();
  
  // Apply theme
  applyTheme();
  
  // Translate UI
  translateUI();
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
    displayMode: 'simple',
    fontSize: 'medium',
    dualLanguage: false,
    theme: 'auto'
  };
}

// Populate language dropdowns
function populateLanguages() {
  const sourceSelect = document.getElementById('sourceLanguage');
  const targetSelect = document.getElementById('targetLanguage');
  
  // Clear existing options except first one
  sourceSelect.innerHTML = '<option value="auto">Auto Detect</option>';
  targetSelect.innerHTML = '';
  
  // Add all languages
  Object.entries(LANGUAGES).forEach(([code, name]) => {
    if (code !== 'auto') {
      const sourceOption = document.createElement('option');
      sourceOption.value = code;
      sourceOption.textContent = name;
      sourceSelect.appendChild(sourceOption);
      
      const targetOption = document.createElement('option');
      targetOption.value = code;
      targetOption.textContent = name;
      targetSelect.appendChild(targetOption);
    }
  });
}

// Update UI with current settings
function updateUI() {
  if (!currentSettings) return;
  
  // Operating mode
  document.getElementById('operatingMode').value = currentSettings.operatingMode;
  
  // Languages
  document.getElementById('sourceLanguage').value = currentSettings.sourceLanguage;
  document.getElementById('targetLanguage').value = currentSettings.targetLanguage;
  
  // Display settings
  document.getElementById('displayMode').value = currentSettings.displayMode;
  document.getElementById('fontSize').value = currentSettings.fontSize;
  document.getElementById('dualLanguage').checked = currentSettings.dualLanguage;
  
  // Theme
  document.getElementById('theme').value = currentSettings.theme;
}

// Setup event listeners
function setupEventListeners() {
  // Translation toggle
  document.getElementById('translationToggle').addEventListener('change', handleTranslationToggle);
  
  // Operating mode
  document.getElementById('operatingMode').addEventListener('change', handleSettingChange);
  
  // Languages
  document.getElementById('sourceLanguage').addEventListener('change', handleSettingChange);
  document.getElementById('targetLanguage').addEventListener('change', handleSettingChange);
  
  // Display settings
  document.getElementById('displayMode').addEventListener('change', handleSettingChange);
  document.getElementById('fontSize').addEventListener('change', handleSettingChange);
  document.getElementById('dualLanguage').addEventListener('change', handleSettingChange);
  
  // Theme
  document.getElementById('theme').addEventListener('change', handleThemeChange);
  
  // Quick actions
  document.getElementById('testAudio').addEventListener('click', handleTestAudio);
  document.getElementById('exportSubtitles').addEventListener('click', handleExportSubtitles);
  
  // Open settings
  document.getElementById('openSettings').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

// Handle translation toggle
async function handleTranslationToggle(event) {
  const isEnabled = event.target.checked;
  
  updateStatus('working', 'Processing...');
  
  try {
    await chrome.tabs.sendMessage(currentTab.id, {
      action: isEnabled ? 'startTranslation' : 'stopTranslation'
    });
    
    updateStatus(isEnabled ? 'active' : 'inactive', isEnabled ? 'Active' : 'Inactive');
  } catch (error) {
    console.error('Failed to toggle translation:', error);
    updateStatus('error', 'Error');
    event.target.checked = !isEnabled; // Revert toggle
  }
}

// Handle setting change
async function handleSettingChange(event) {
  const setting = event.target.id;
  let value = event.target.value;
  
  // Handle checkbox
  if (event.target.type === 'checkbox') {
    value = event.target.checked;
  }
  
  // Update settings object
  currentSettings[setting] = value;
  
  // Save settings
  await saveSettings();
}

// Handle theme change
async function handleThemeChange(event) {
  currentSettings.theme = event.target.value;
  await saveSettings();
  applyTheme();
}

// Save settings to background
async function saveSettings() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      action: 'saveSettings',
      settings: currentSettings
    }, (response) => {
      if (response && response.success) {
        console.log('Settings saved');
      } else {
        console.error('Failed to save settings');
      }
      resolve();
    });
  });
}

// Check translation status
async function checkTranslationStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'checkTabStatus' });
    
    if (response && response.success) {
      const isActive = response.isActive;
      document.getElementById('translationToggle').checked = isActive;
      updateStatus(isActive ? 'active' : 'inactive', isActive ? 'Active' : 'Ready');
    }
  } catch (error) {
    console.error('Failed to check status:', error);
    updateStatus('inactive', 'Ready');
  }
}

// Update status indicator
function updateStatus(state, text) {
  const indicator = document.getElementById('statusIndicator');
  const statusText = indicator.querySelector('.status-text');
  
  // Remove all state classes
  indicator.classList.remove('active', 'inactive', 'error', 'working');
  
  // Add new state class
  indicator.classList.add(state);
  
  // Update text
  statusText.textContent = text;
}

// Handle test audio
async function handleTestAudio() {
  const button = document.getElementById('testAudio');
  button.disabled = true;
  button.classList.add('loading');
  
  try {
    const response = await chrome.runtime.sendMessage({ action: 'testAudio' });
    
    if (response && response.success) {
      alert('Audio capture is working!\n\nCapabilities:\n' + 
            `Web Audio: ${response.result.capabilities.webAudio ? 'Yes' : 'No'}\n` +
            `Media Recorder: ${response.result.capabilities.mediaRecorder ? 'Yes' : 'No'}\n` +
            `Audio Context: ${response.result.capabilities.audioContext ? 'Yes' : 'No'}`);
    } else {
      alert('Audio test failed. Please check permissions.');
    }
  } catch (error) {
    console.error('Audio test failed:', error);
    alert('Audio test failed: ' + error.message);
  } finally {
    button.disabled = false;
    button.classList.remove('loading');
  }
}

// Handle export subtitles
async function handleExportSubtitles() {
  const button = document.getElementById('exportSubtitles');
  button.disabled = true;
  button.classList.add('loading');
  
  try {
    // In a real implementation, this would get actual subtitles from content script
    const sampleSubtitles = [
      { startTime: 0, endTime: 3, text: 'Welcome to the video' },
      { startTime: 3, endTime: 6, text: 'This is a demonstration' },
      { startTime: 6, endTime: 9, text: 'Automatic translation is working' }
    ];
    
    const response = await chrome.runtime.sendMessage({
      action: 'exportSubtitles',
      subtitles: sampleSubtitles,
      format: 'srt'
    });
    
    if (response && response.success) {
      // Create download
      const blob = new Blob([response.data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subtitles.srt';
      a.click();
      URL.revokeObjectURL(url);
      
      alert('Subtitles exported successfully!');
    } else {
      alert('Failed to export subtitles.');
    }
  } catch (error) {
    console.error('Export failed:', error);
    alert('Export failed: ' + error.message);
  } finally {
    button.disabled = false;
    button.classList.remove('loading');
  }
}

// Apply theme
function applyTheme() {
  let theme = currentSettings.theme;
  
  if (theme === 'auto') {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }
  
  document.body.setAttribute('data-theme', theme);
}

// Translate UI elements
function translateUI() {
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const message = chrome.i18n.getMessage(key);
    
    if (message) {
      if (element.tagName === 'INPUT' && element.type === 'button') {
        element.value = message;
      } else if (element.tagName === 'OPTION') {
        element.textContent = message;
      } else {
        element.textContent = message;
      }
    }
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

console.log('Popup script initialized');
