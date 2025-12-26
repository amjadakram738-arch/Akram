// Content Script - Injected into web pages to detect videos and display subtitles
// Copyright: Video Translator Extension

console.log('Video Translator content script loaded');

// Global state
let isTranslationActive = false;
let currentSettings = null;
let videoElements = new Set();
let subtitleOverlays = new Map();
let audioCapture = null;
let recognitionBuffer = [];
let currentVideoElement = null;

// Initialize content script
async function initialize() {
  console.log('Initializing Video Translator...');
  
  // Load settings
  currentSettings = await loadSettings();
  
  // Apply theme
  applyTheme(currentSettings.theme);
  
  // Detect existing videos
  detectVideos();
  
  // Setup mutation observer to detect dynamically added videos
  setupVideoDetectionObserver();
  
  // Listen for video events
  setupVideoEventListeners();
  
  // Check if translation should be active
  checkTranslationStatus();
}

// Load settings from background
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
      if (response && response.success) {
        resolve(response.settings);
      } else {
        resolve(getDefaultSettings());
      }
    });
  });
}

// Get default settings (fallback)
function getDefaultSettings() {
  return {
    operatingMode: 'auto',
    sourceLanguage: 'auto',
    targetLanguage: 'en',
    fontSize: 'medium',
    fontFamily: 'sans-serif',
    textColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'bottom',
    displayMode: 'simple',
    theme: 'auto'
  };
}

// Detect all video elements on the page
function detectVideos() {
  // Find all video elements including in iframes
  const videos = document.querySelectorAll('video');
  
  videos.forEach(video => {
    if (!videoElements.has(video)) {
      videoElements.add(video);
      console.log('Video detected:', video);
      
      // Create subtitle overlay for this video
      if (isTranslationActive) {
        createSubtitleOverlay(video);
      }
    }
  });
  
  // Also check iframes if iframe support is enabled
  if (currentSettings && currentSettings.iframeSupport) {
    detectIframeVideos();
  }
}

// Detect videos in iframes
function detectIframeVideos() {
  const iframes = document.querySelectorAll('iframe');
  
  iframes.forEach(iframe => {
    try {
      // Try to access iframe content (will fail for cross-origin)
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const videos = iframeDoc.querySelectorAll('video');
      
      videos.forEach(video => {
        if (!videoElements.has(video)) {
          videoElements.add(video);
          console.log('Video detected in iframe:', video);
          
          if (isTranslationActive) {
            createSubtitleOverlay(video);
          }
        }
      });
    } catch (error) {
      // Cross-origin iframe, use postMessage for communication
      console.log('Cross-origin iframe detected, using postMessage');
    }
  });
}

// Setup mutation observer to detect dynamically added videos
function setupVideoDetectionObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'VIDEO') {
          if (!videoElements.has(node)) {
            videoElements.add(node);
            console.log('New video detected:', node);
            
            if (isTranslationActive) {
              createSubtitleOverlay(node);
            }
          }
        } else if (node.querySelectorAll) {
          // Check if added node contains videos
          const videos = node.querySelectorAll('video');
          videos.forEach(video => {
            if (!videoElements.has(video)) {
              videoElements.add(video);
              console.log('New video detected:', video);
              
              if (isTranslationActive) {
                createSubtitleOverlay(video);
              }
            }
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Setup event listeners for videos
function setupVideoEventListeners() {
  // Listen for play events on the entire document
  document.addEventListener('play', (event) => {
    if (event.target.nodeName === 'VIDEO') {
      handleVideoPlay(event.target);
    }
  }, true);
  
  // Listen for pause events
  document.addEventListener('pause', (event) => {
    if (event.target.nodeName === 'VIDEO') {
      handleVideoPause(event.target);
    }
  }, true);
  
  // Listen for timeupdate events
  document.addEventListener('timeupdate', (event) => {
    if (event.target.nodeName === 'VIDEO') {
      handleVideoTimeUpdate(event.target);
    }
  }, true);
}

// Handle video play event
function handleVideoPlay(video) {
  console.log('Video playing:', video);
  currentVideoElement = video;
  
  if (isTranslationActive) {
    startAudioCaptureForVideo(video);
  }
}

// Handle video pause event
function handleVideoPause(video) {
  console.log('Video paused:', video);
  
  if (isTranslationActive) {
    // Continue capturing if in certain modes
    if (currentSettings.alwaysCaptureMode) {
      // Keep capturing
    } else {
      pauseAudioCapture();
    }
  }
}

// Handle video time update
function handleVideoTimeUpdate(video) {
  // Update subtitle overlay position if needed
  const overlay = subtitleOverlays.get(video);
  if (overlay) {
    updateOverlayPosition(overlay, video);
  }
}

// Create subtitle overlay for a video
function createSubtitleOverlay(video) {
  // Check if overlay already exists
  if (subtitleOverlays.has(video)) {
    return subtitleOverlays.get(video);
  }
  
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'video-translator-overlay';
  overlay.style.cssText = getOverlayStyles();
  
  // Create subtitle text element
  const subtitleText = document.createElement('div');
  subtitleText.className = 'video-translator-subtitle';
  subtitleText.style.cssText = getSubtitleStyles();
  
  overlay.appendChild(subtitleText);
  
  // Make overlay draggable
  makeDraggable(overlay);
  
  // Position overlay relative to video
  positionOverlay(overlay, video);
  
  // Insert overlay into DOM
  if (video.parentElement) {
    // Try to insert as sibling
    video.parentElement.style.position = 'relative';
    video.parentElement.appendChild(overlay);
  } else {
    // Fallback: append to body
    document.body.appendChild(overlay);
  }
  
  // Store reference
  subtitleOverlays.set(video, overlay);
  
  console.log('Subtitle overlay created for video');
  return overlay;
}

// Get overlay container styles
function getOverlayStyles() {
  const settings = currentSettings || getDefaultSettings();
  
  return `
    position: absolute;
    z-index: 999999;
    pointer-events: auto;
    display: flex;
    justify-content: center;
    align-items: ${settings.position === 'top' ? 'flex-start' : settings.position === 'center' ? 'center' : 'flex-end'};
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 20px;
  `;
}

// Get subtitle text styles
function getSubtitleStyles() {
  const settings = currentSettings || getDefaultSettings();
  
  const fontSizes = {
    small: '14px',
    medium: '18px',
    large: '24px',
    auto: '18px'
  };
  
  const fontSize = fontSizes[settings.fontSize] || '18px';
  
  return `
    font-family: ${settings.fontFamily}, sans-serif;
    font-size: ${fontSize};
    color: ${settings.textColor};
    background: ${settings.backgroundColor};
    padding: 8px 16px;
    border-radius: 4px;
    text-align: center;
    max-width: 80%;
    word-wrap: break-word;
    opacity: ${(settings.opacity || 90) / 100};
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    line-height: 1.4;
    user-select: none;
    cursor: move;
  `;
}

// Position overlay relative to video
function positionOverlay(overlay, video) {
  const rect = video.getBoundingClientRect();
  
  // Position overlay to match video dimensions
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.top = `0px`;
  overlay.style.left = `0px`;
}

// Update overlay position (for responsive videos)
function updateOverlayPosition(overlay, video) {
  const rect = video.getBoundingClientRect();
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

// Make overlay draggable
function makeDraggable(element) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  
  element.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);
  
  // Touch support
  element.addEventListener('touchstart', dragStart);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', dragEnd);
  
  function dragStart(e) {
    if (e.target.closest('.video-translator-subtitle')) {
      initialX = e.clientX || e.touches[0].clientX;
      initialY = e.clientY || e.touches[0].clientY;
      isDragging = true;
    }
  }
  
  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = (e.clientX || e.touches[0].clientX) - initialX;
      currentY = (e.clientY || e.touches[0].clientY) - initialY;
      initialX = e.clientX || e.touches[0].clientX;
      initialY = e.clientY || e.touches[0].clientY;
      
      const subtitle = element.querySelector('.video-translator-subtitle');
      const currentTransform = subtitle.style.transform || 'translate(0px, 0px)';
      const matches = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      
      let x = 0, y = 0;
      if (matches) {
        x = parseFloat(matches[1]);
        y = parseFloat(matches[2]);
      }
      
      subtitle.style.transform = `translate(${x + currentX}px, ${y + currentY}px)`;
    }
  }
  
  function dragEnd() {
    isDragging = false;
  }
}

// Display subtitle text
function displaySubtitle(text, duration = 3000) {
  subtitleOverlays.forEach((overlay) => {
    const subtitle = overlay.querySelector('.video-translator-subtitle');
    if (subtitle) {
      subtitle.textContent = text;
      subtitle.style.display = 'block';
      
      // Auto-hide after duration (if not in educational mode)
      if (currentSettings.displayMode !== 'educational') {
        setTimeout(() => {
          subtitle.style.display = 'none';
        }, duration);
      }
    }
  });
}

// Start audio capture for video
async function startAudioCaptureForVideo(video) {
  console.log('Starting audio capture...');
  
  try {
    // Request audio capture permission
    chrome.runtime.sendMessage({
      action: 'startAudioCapture',
      options: {
        video: true,
        audio: true
      }
    }, (response) => {
      if (response && response.success) {
        console.log('Audio capture started');
        initializeAudioRecognition(video);
      }
    });
  } catch (error) {
    console.error('Failed to start audio capture:', error);
    showError('Failed to start audio capture');
  }
}

// Initialize audio recognition
function initializeAudioRecognition(video) {
  // Use Web Speech API for audio recognition (if available)
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentSettings.sourceLanguage === 'auto' ? 'en-US' : currentSettings.sourceLanguage;
    
    recognition.onresult = async (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Display interim results
      if (interimTranscript) {
        displaySubtitle(interimTranscript, 1000);
      }
      
      // Translate and display final results
      if (finalTranscript) {
        translateAndDisplay(finalTranscript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Restart recognition
        setTimeout(() => {
          recognition.start();
        }, 1000);
      }
    };
    
    recognition.onend = () => {
      // Restart recognition if still active
      if (isTranslationActive) {
        recognition.start();
      }
    };
    
    // Start recognition
    try {
      recognition.start();
      audioCapture = recognition;
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  } else {
    // Fallback: Use simulated captions for demo
    console.log('Web Speech API not available, using simulation mode');
    startSimulatedCaptions();
  }
}

// Translate text and display
async function translateAndDisplay(text) {
  try {
    chrome.runtime.sendMessage({
      action: 'translateText',
      text: text,
      sourceLang: currentSettings.sourceLanguage,
      targetLang: currentSettings.targetLanguage
    }, (response) => {
      if (response && response.success) {
        const translation = response.translation;
        
        // Display based on mode
        if (currentSettings.displayMode === 'educational' && currentSettings.dualLanguage) {
          displaySubtitle(`${text}\n${translation}`, 5000);
        } else {
          displaySubtitle(translation, 4000);
        }
      } else {
        console.error('Translation failed');
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
  }
}

// Pause audio capture
function pauseAudioCapture() {
  if (audioCapture) {
    if (audioCapture.stop) {
      audioCapture.stop();
    }
  }
}

// Stop audio capture
function stopAudioCapture() {
  if (audioCapture) {
    if (audioCapture.stop) {
      audioCapture.stop();
    }
    audioCapture = null;
  }
}

// Start simulated captions (for testing)
function startSimulatedCaptions() {
  const samplePhrases = [
    'Welcome to the video',
    'This is a demonstration',
    'Automatic translation is working',
    'You can customize the settings',
    'Enjoy your content'
  ];
  
  let index = 0;
  const interval = setInterval(() => {
    if (!isTranslationActive) {
      clearInterval(interval);
      return;
    }
    
    const phrase = samplePhrases[index % samplePhrases.length];
    translateAndDisplay(phrase);
    index++;
  }, 5000);
}

// Check translation status
function checkTranslationStatus() {
  chrome.runtime.sendMessage({ action: 'checkTabStatus' }, (response) => {
    if (response && response.success) {
      isTranslationActive = response.isActive;
      
      if (isTranslationActive) {
        startTranslation();
      }
    }
  });
}

// Start translation
function startTranslation() {
  console.log('Starting translation...');
  isTranslationActive = true;
  
  // Detect videos
  detectVideos();
  
  // Create overlays for all videos
  videoElements.forEach(video => {
    createSubtitleOverlay(video);
  });
  
  // Start audio capture for playing videos
  if (currentVideoElement && !currentVideoElement.paused) {
    startAudioCaptureForVideo(currentVideoElement);
  }
}

// Stop translation
function stopTranslation() {
  console.log('Stopping translation...');
  isTranslationActive = false;
  
  // Stop audio capture
  stopAudioCapture();
  
  // Remove all overlays
  subtitleOverlays.forEach((overlay, video) => {
    overlay.remove();
  });
  subtitleOverlays.clear();
}

// Apply theme
function applyTheme(theme) {
  if (theme === 'auto') {
    // Detect system theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }
  
  document.documentElement.setAttribute('data-video-translator-theme', theme);
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'video-translator-error';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 9999999;
    font-family: sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  switch (message.action) {
    case 'startTranslation':
      startTranslation();
      sendResponse({ success: true });
      break;
      
    case 'stopTranslation':
      stopTranslation();
      sendResponse({ success: true });
      break;
      
    case 'settingsUpdated':
      currentSettings = message.settings;
      applyTheme(currentSettings.theme);
      // Refresh overlays with new settings
      if (isTranslationActive) {
        updateOverlayStyles();
      }
      sendResponse({ success: true });
      break;
      
    case 'adjustFontSize':
      adjustFontSize(message.direction);
      sendResponse({ success: true });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  
  return true;
});

// Adjust font size dynamically
function adjustFontSize(direction) {
  const sizes = ['small', 'medium', 'large'];
  const currentIndex = sizes.indexOf(currentSettings.fontSize);
  
  let newIndex = currentIndex;
  if (direction === 'increase' && currentIndex < sizes.length - 1) {
    newIndex++;
  } else if (direction === 'decrease' && currentIndex > 0) {
    newIndex--;
  }
  
  currentSettings.fontSize = sizes[newIndex];
  updateOverlayStyles();
}

// Update overlay styles
function updateOverlayStyles() {
  subtitleOverlays.forEach((overlay) => {
    const subtitle = overlay.querySelector('.video-translator-subtitle');
    if (subtitle) {
      subtitle.style.cssText = getSubtitleStyles();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

console.log('Video Translator content script initialized');
