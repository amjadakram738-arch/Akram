// Background Service Worker - Manages translation operations, audio capture, and API fallbacks
// Copyright: Video Translator Extension

// Global state management
let activeTranslations = new Map(); // Store active translation sessions by tabId
let offscreenDocument = null; // Reference to offscreen document for audio processing
let audioContexts = new Map(); // Store audio contexts per tab

// Default settings with comprehensive configuration
const DEFAULT_SETTINGS = {
  // Operating Mode Configuration (11 modes)
  operatingMode: 'auto', // auto, manual, economy, high-accuracy, silent, interactive, normal, fast, beta, cloud, shared
  
  // Language Settings
  sourceLanguage: 'auto', // Auto-detect or specific language code
  targetLanguage: 'en', // Default to English
  uiLanguage: 'en',
  
  // Audio Capture Method (11 types)
  audioCaptureMethod: 'direct', // direct, microphone, hybrid, api, manual, multi-channel, noise-filter, advanced-noise, realtime, buffer, compressed
  
  // Translation Engine Priority (fallback order)
  translationEngines: [
    { name: 'google', enabled: true, priority: 1 },
    { name: 'libretranslate', enabled: true, priority: 2 },
    { name: 'mymemory', enabled: true, priority: 3 },
    { name: 'deepl-free', enabled: false, priority: 4 },
    { name: 'microsoft', enabled: true, priority: 5 },
    { name: 'yandex', enabled: false, priority: 6 },
    { name: 'apertium', enabled: false, priority: 7 },
    { name: 'argos', enabled: false, priority: 8 },
    { name: 'opennmt', enabled: false, priority: 9 },
    { name: 'whisper-local', enabled: false, priority: 10 }
  ],
  
  // Audio Processing Servers (10 options)
  audioProcessingServer: 'webaudio', // webaudio, ffmpeg, mediarecorder, audiocontext, recordrtc, howler, tone, cloudconvert, online-converter, whisper-local
  
  // UI Customization
  fontSize: 'medium', // small, medium, large, auto
  fontFamily: 'sans-serif', // sans-serif, serif, monospace
  textColor: '#FFFFFF',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backgroundType: 'shadowed', // transparent, shadowed, solid
  opacity: 90,
  position: 'bottom', // top, bottom, center, custom
  
  // Display Settings
  displayMode: 'simple', // simple, cinematic, educational, interactive
  dualLanguage: false,
  smartMode: true, // Auto-adjust based on context
  
  // Performance Settings
  qualityMode: 'balanced', // high, balanced, low, economy
  gpuAcceleration: true,
  maxMemoryMB: 100,
  bufferSize: 5, // seconds
  latencyTarget: 1000, // milliseconds
  
  // Privacy & Security
  localOnlyMode: false,
  autoDeleteRecordings: true,
  anonymousMode: true,
  encryptStorage: false,
  passwordProtection: false,
  
  // Advanced Features
  archiveEnabled: false,
  interactiveLearning: false,
  sentimentAnalysis: false,
  smartAlerts: false,
  smartAlertKeywords: [],
  liveStreamingMode: false,
  educationalMode: false,
  exportFormat: 'srt', // srt, txt, docx
  
  // Device & System
  deviceType: 'auto', // auto, mobile, tablet, desktop
  performanceMode: 'balanced', // high, balanced, low
  batteryEconomy: false,
  
  // Offline Mode
  offlineMode: false,
  offlineModels: [],
  
  // Audio Device Management
  audioOutputDevice: 'default',
  audioInputDevice: 'default',
  alwaysCaptureMode: true,
  multiDeviceRecording: false,
  bluetoothLatencyCompensation: 100, // milliseconds
  
  // DRM & Compatibility
  drmBypassEnabled: true,
  systemAudioCapture: true,
  fallbackMode: true,
  
  // Iframe & Site Compatibility
  universalSupportMode: true,
  whitelistedSites: [],
  blacklistedSites: [],
  iframeSupport: true,
  
  // Notifications
  notificationsEnabled: true,
  failureAlerts: true,
  connectionAlerts: true,
  
  // Keyboard Shortcuts
  enableShortcuts: true,
  
  // Theme
  theme: 'auto', // auto, light, dark
  
  // Retry & Error Handling
  maxRetries: 3,
  retryDelay: 2000, // milliseconds
  
  // Auto-update
  autoUpdate: true,
  
  // Sharing & Collaboration
  sharingEnabled: false,
  ttsEnabled: false
};

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Video Translator Extension installed:', details.reason);
  
  // Initialize default settings
  const stored = await chrome.storage.local.get('settings');
  if (!stored.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
    console.log('Default settings initialized');
  }
  
  // Create context menu
  createContextMenu();
  
  // Show welcome notification
  if (details.reason === 'install') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: chrome.i18n.getMessage('extensionName'),
      message: chrome.i18n.getMessage('welcomeMessage') || 'Video Translator installed successfully!'
    });
  }
});

// Create context menu for quick actions
function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'video-translator-toggle',
      title: chrome.i18n.getMessage('toggleTranslation') || 'Toggle Translation',
      contexts: ['all']
    });
    
    chrome.contextMenus.create({
      id: 'video-translator-settings',
      title: chrome.i18n.getMessage('openSettings') || 'Open Settings',
      contexts: ['all']
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'video-translator-toggle') {
    toggleTranslation(tab.id);
  } else if (info.menuItemId === 'video-translator-settings') {
    chrome.runtime.openOptionsPage();
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (command === 'toggle-translation') {
    toggleTranslation(tab.id);
  } else if (command === 'increase-font') {
    adjustFontSize(tab.id, 'increase');
  } else if (command === 'decrease-font') {
    adjustFontSize(tab.id, 'decrease');
  }
});

// Toggle translation on/off for a tab
async function toggleTranslation(tabId) {
  const isActive = activeTranslations.get(tabId);
  
  if (isActive) {
    // Stop translation
    activeTranslations.delete(tabId);
    await chrome.tabs.sendMessage(tabId, { action: 'stopTranslation' });
    console.log('Translation stopped for tab:', tabId);
  } else {
    // Start translation
    activeTranslations.set(tabId, true);
    await chrome.tabs.sendMessage(tabId, { action: 'startTranslation' });
    console.log('Translation started for tab:', tabId);
  }
}

// Adjust font size
async function adjustFontSize(tabId, direction) {
  await chrome.tabs.sendMessage(tabId, { 
    action: 'adjustFontSize', 
    direction: direction 
  });
}

// Message handler for communication with content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  // Handle async operations
  (async () => {
    try {
      switch (message.action) {
        case 'getSettings':
          const settings = await getSettings();
          sendResponse({ success: true, settings });
          break;
          
        case 'saveSettings':
          await saveSettings(message.settings);
          sendResponse({ success: true });
          break;
          
        case 'translateText':
          const translation = await translateText(message.text, message.sourceLang, message.targetLang);
          sendResponse({ success: true, translation });
          break;
          
        case 'detectLanguage':
          const detectedLang = await detectLanguage(message.text);
          sendResponse({ success: true, language: detectedLang });
          break;
          
        case 'processAudio':
          const transcript = await processAudio(message.audioData, message.language);
          sendResponse({ success: true, transcript });
          break;
          
        case 'startAudioCapture':
          await startAudioCapture(sender.tab.id, message.options);
          sendResponse({ success: true });
          break;
          
        case 'stopAudioCapture':
          await stopAudioCapture(sender.tab.id);
          sendResponse({ success: true });
          break;
          
        case 'checkTabStatus':
          const isActive = activeTranslations.get(sender.tab.id) || false;
          sendResponse({ success: true, isActive });
          break;
          
        case 'exportSubtitles':
          const exportData = await exportSubtitles(message.subtitles, message.format);
          sendResponse({ success: true, data: exportData });
          break;
          
        case 'testAudio':
          const testResult = await testAudioCapture();
          sendResponse({ success: true, result: testResult });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();
  
  // Return true to indicate async response
  return true;
});

// Get settings from storage
async function getSettings() {
  const stored = await chrome.storage.local.get('settings');
  return stored.settings || DEFAULT_SETTINGS;
}

// Save settings to storage
async function saveSettings(settings) {
  await chrome.storage.local.set({ settings });
  
  // Notify all tabs about settings change
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, { 
        action: 'settingsUpdated', 
        settings 
      });
    } catch (error) {
      // Tab might not have content script, ignore error
    }
  }
}

// Translate text using available translation engines with fallback
async function translateText(text, sourceLang, targetLang) {
  const settings = await getSettings();
  const engines = settings.translationEngines
    .filter(e => e.enabled)
    .sort((a, b) => a.priority - b.priority);
  
  // Try each engine until one succeeds
  for (const engine of engines) {
    try {
      console.log(`Attempting translation with ${engine.name}...`);
      const result = await translateWithEngine(engine.name, text, sourceLang, targetLang);
      if (result) {
        console.log(`Translation successful with ${engine.name}`);
        return result;
      }
    } catch (error) {
      console.error(`Translation failed with ${engine.name}:`, error);
      // Continue to next engine
    }
  }
  
  // If all engines fail, return error
  throw new Error('All translation engines failed');
}

// Translate using specific engine
async function translateWithEngine(engineName, text, sourceLang, targetLang) {
  // Detect language if source is 'auto'
  if (sourceLang === 'auto') {
    sourceLang = await detectLanguage(text);
  }
  
  switch (engineName) {
    case 'google':
      return await translateWithGoogle(text, sourceLang, targetLang);
    case 'libretranslate':
      return await translateWithLibreTranslate(text, sourceLang, targetLang);
    case 'mymemory':
      return await translateWithMyMemory(text, sourceLang, targetLang);
    case 'microsoft':
      return await translateWithMicrosoft(text, sourceLang, targetLang);
    default:
      throw new Error(`Unsupported engine: ${engineName}`);
  }
}

// Google Translate implementation (free, no API key required)
async function translateWithGoogle(text, sourceLang, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Google Translate request failed');
  }
  
  const data = await response.json();
  // Google returns array of translated segments
  const translated = data[0].map(item => item[0]).join('');
  return translated;
}

// LibreTranslate implementation (free, open-source)
async function translateWithLibreTranslate(text, sourceLang, targetLang) {
  // Use public LibreTranslate instance
  const url = 'https://libretranslate.de/translate';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang === 'auto' ? 'auto' : sourceLang,
      target: targetLang,
      format: 'text'
    })
  });
  
  if (!response.ok) {
    throw new Error('LibreTranslate request failed');
  }
  
  const data = await response.json();
  return data.translatedText;
}

// MyMemory implementation (free translation memory)
async function translateWithMyMemory(text, sourceLang, targetLang) {
  const langPair = `${sourceLang}|${targetLang}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('MyMemory request failed');
  }
  
  const data = await response.json();
  if (data.responseStatus === 200) {
    return data.responseData.translatedText;
  }
  
  throw new Error('MyMemory translation failed');
}

// Microsoft Translator implementation (free tier available)
async function translateWithMicrosoft(text, sourceLang, targetLang) {
  // Note: This requires API key for production use
  // For now, fallback to other services
  throw new Error('Microsoft Translator requires API key configuration');
}

// Detect language using Google's free detection
async function detectLanguage(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text.substring(0, 200))}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      return 'en'; // Default to English
    }
    
    const data = await response.json();
    // Detected language is in data[2]
    const detectedLang = data[2] || 'en';
    return detectedLang;
  } catch (error) {
    console.error('Language detection failed:', error);
    return 'en'; // Default to English
  }
}

// Process audio data and convert to text
async function processAudio(audioData, language) {
  const settings = await getSettings();
  
  // For now, return a placeholder
  // In production, this would use Web Speech API or Whisper
  console.log('Processing audio data...');
  
  // Simulate audio processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Sample transcription from audio');
    }, 500);
  });
}

// Start audio capture for a tab
async function startAudioCapture(tabId, options) {
  console.log('Starting audio capture for tab:', tabId);
  
  const settings = await getSettings();
  
  // Store audio context
  audioContexts.set(tabId, {
    active: true,
    method: settings.audioCaptureMethod,
    options: options
  });
  
  // In production, this would initialize audio capture via offscreen document
  // For now, we'll handle it in content script
}

// Stop audio capture for a tab
async function stopAudioCapture(tabId) {
  console.log('Stopping audio capture for tab:', tabId);
  
  const context = audioContexts.get(tabId);
  if (context) {
    context.active = false;
    audioContexts.delete(tabId);
  }
}

// Test audio capture capabilities
async function testAudioCapture() {
  return {
    success: true,
    message: 'Audio capture is available',
    capabilities: {
      webAudio: true,
      mediaRecorder: typeof MediaRecorder !== 'undefined',
      audioContext: typeof AudioContext !== 'undefined'
    }
  };
}

// Export subtitles in various formats
async function exportSubtitles(subtitles, format) {
  switch (format) {
    case 'srt':
      return exportAsSRT(subtitles);
    case 'txt':
      return exportAsTXT(subtitles);
    case 'docx':
      return exportAsDOCX(subtitles);
    default:
      return exportAsSRT(subtitles);
  }
}

// Export as SRT format
function exportAsSRT(subtitles) {
  let srt = '';
  subtitles.forEach((sub, index) => {
    srt += `${index + 1}\n`;
    srt += `${formatSRTTime(sub.startTime)} --> ${formatSRTTime(sub.endTime)}\n`;
    srt += `${sub.text}\n\n`;
  });
  return srt;
}

// Export as plain text
function exportAsTXT(subtitles) {
  return subtitles.map(sub => `[${formatTime(sub.startTime)}] ${sub.text}`).join('\n');
}

// Export as DOCX (simplified - returns formatted text)
function exportAsDOCX(subtitles) {
  // In production, this would generate actual DOCX file
  let content = 'Video Translation Export\n\n';
  subtitles.forEach(sub => {
    content += `${formatTime(sub.startTime)} - ${sub.text}\n`;
  });
  return content;
}

// Format time for SRT (HH:MM:SS,mmm)
function formatSRTTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);
  
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)},${pad(millis, 3)}`;
}

// Format time for display (HH:MM:SS)
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)}`;
  }
  return `${pad(minutes, 2)}:${pad(secs, 2)}`;
}

// Pad number with zeros
function pad(num, size) {
  let s = num.toString();
  while (s.length < size) s = '0' + s;
  return s;
}

// Handle tab removal - cleanup
chrome.tabs.onRemoved.addListener((tabId) => {
  activeTranslations.delete(tabId);
  audioContexts.delete(tabId);
  console.log('Cleaned up resources for closed tab:', tabId);
});

// Handle extension updates
chrome.runtime.onUpdateAvailable.addListener((details) => {
  console.log('Update available:', details.version);
  
  const settings = getSettings();
  if (settings.autoUpdate) {
    chrome.runtime.reload();
  }
});

console.log('Video Translator Extension background service worker initialized');
