// Content Script - Injected into web pages to display translations
// Detects video players, captures audio, and overlays subtitles

class VideoTranslatorContent {
  constructor() {
    this.isActive = false;
    this.settings = null;
    this.subtitleContainer = null;
    this.videoElements = [];
    this.audioContext = null;
    this.mediaRecorder = null;
    this.recognitionBuffer = [];
    this.currentSubtitle = '';
    
    this.init();
  }

  async init() {
    // Listen for messages from background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message).then(sendResponse).catch(error => {
        console.error('Content script error:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true;
    });

    // Detect video elements
    this.detectVideoElements();
    
    // Watch for dynamically added videos
    this.observeDOMChanges();
  }

  async handleMessage(message) {
    const { action, settings, delta } = message;

    switch (action) {
      case 'ping':
        return { success: true, pong: true };
      
      case 'initializeTranslation':
        return await this.initializeTranslation(settings);
      
      case 'stopTranslation':
        return this.stopTranslation();
      
      case 'adjustFontSize':
        return this.adjustFontSize(delta);
      
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  }

  async initializeTranslation(settings) {
    this.settings = settings;
    this.isActive = true;

    // Create subtitle container
    this.createSubtitleContainer();

    // Find and hook into video elements
    await this.setupVideoHooks();

    // Start audio capture based on mode
    await this.startAudioCapture();

    return { success: true };
  }

  stopTranslation() {
    this.isActive = false;

    // Stop audio capture
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

    // Remove subtitle container
    if (this.subtitleContainer) {
      this.subtitleContainer.remove();
      this.subtitleContainer = null;
    }

    return { success: true };
  }

  createSubtitleContainer() {
    // Remove existing container if present
    if (this.subtitleContainer) {
      this.subtitleContainer.remove();
    }

    // Create floating subtitle container
    this.subtitleContainer = document.createElement('div');
    this.subtitleContainer.id = 'video-translator-subtitles';
    this.subtitleContainer.className = 'vt-subtitle-container';
    
    // Apply settings
    this.applySubtitleStyles();

    // Add to page
    document.body.appendChild(this.subtitleContainer);

    // Make draggable if enabled
    if (this.settings.draggableSubtitles) {
      this.makeSubtitleDraggable();
    }
  }

  applySubtitleStyles() {
    if (!this.subtitleContainer) return;

    const s = this.settings;
    const container = this.subtitleContainer;

    // Position
    container.style.setProperty('--subtitle-position', s.subtitlePosition || 'bottom');
    
    // Font
    container.style.setProperty('--subtitle-font-size', `${s.fontSize || 20}px`);
    container.style.setProperty('--subtitle-font-family', s.fontFamily || 'Arial, sans-serif');
    
    // Colors
    container.style.setProperty('--subtitle-text-color', s.textColor || '#ffffff');
    container.style.setProperty('--subtitle-bg-color', s.backgroundColor || 'rgba(0, 0, 0, 0.8)');
    container.style.setProperty('--subtitle-opacity', s.opacity || '0.9');
    
    // Effects
    if (s.textShadow) {
      container.style.setProperty('--subtitle-text-shadow', '2px 2px 4px rgba(0,0,0,0.9)');
    }

    // Theme
    container.classList.toggle('vt-dark-theme', s.theme === 'dark');
    container.classList.toggle('vt-light-theme', s.theme === 'light');
  }

  detectVideoElements() {
    // Find all video elements
    const videos = document.querySelectorAll('video');
    this.videoElements = Array.from(videos);

    console.log(`Detected ${this.videoElements.length} video elements`);
  }

  observeDOMChanges() {
    // Watch for new video elements
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'VIDEO') {
              this.videoElements.push(node);
              if (this.isActive) {
                this.hookVideoElement(node);
              }
            } else {
              const videos = node.querySelectorAll('video');
              videos.forEach(v => {
                this.videoElements.push(v);
                if (this.isActive) {
                  this.hookVideoElement(v);
                }
              });
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  async setupVideoHooks() {
    for (const video of this.videoElements) {
      await this.hookVideoElement(video);
    }
  }

  async hookVideoElement(video) {
    // Position subtitle container near video
    this.positionSubtitleContainer(video);

    // Listen for video events
    video.addEventListener('play', () => this.onVideoPlay(video));
    video.addEventListener('pause', () => this.onVideoPause(video));
    video.addEventListener('seeked', () => this.onVideoSeeked(video));
  }

  positionSubtitleContainer(video) {
    if (!this.subtitleContainer || !video) return;

    const rect = video.getBoundingClientRect();
    const position = this.settings.subtitlePosition || 'bottom';

    switch (position) {
      case 'top':
        this.subtitleContainer.style.top = `${rect.top + 20}px`;
        this.subtitleContainer.style.bottom = 'auto';
        break;
      case 'middle':
        this.subtitleContainer.style.top = `${rect.top + rect.height / 2}px`;
        this.subtitleContainer.style.bottom = 'auto';
        break;
      case 'bottom':
      default:
        this.subtitleContainer.style.bottom = `${window.innerHeight - rect.bottom + 20}px`;
        this.subtitleContainer.style.top = 'auto';
        break;
    }

    this.subtitleContainer.style.left = `${rect.left}px`;
    this.subtitleContainer.style.width = `${rect.width}px`;
  }

  async startAudioCapture() {
    const captureMode = this.settings.captureMode || 'direct';

    try {
      switch (captureMode) {
        case 'direct':
          await this.captureDirectAudio();
          break;
        case 'microphone':
          await this.captureMicrophoneAudio();
          break;
        case 'hybrid':
          await this.captureHybridAudio();
          break;
        case 'system':
          await this.captureSystemAudio();
          break;
        default:
          await this.captureDirectAudio();
      }
    } catch (error) {
      console.error('Audio capture failed:', error);
      this.showError('Failed to capture audio. Please check permissions.');
    }
  }

  async captureDirectAudio() {
    // Capture audio directly from video element
    const video = this.videoElements[0];
    if (!video) {
      throw new Error('No video element found');
    }

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create media element source
      const source = this.audioContext.createMediaElementSource(video);
      
      // Create destination for capturing
      const destination = this.audioContext.createMediaStreamDestination();
      
      // Connect source to destination and speakers
      source.connect(destination);
      source.connect(this.audioContext.destination);

      // Start recording
      this.startRecording(destination.stream);
    } catch (error) {
      console.error('Direct capture failed, falling back to system capture:', error);
      await this.captureSystemAudio();
    }
  }

  async captureMicrophoneAudio() {
    // Capture audio from microphone
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: this.settings.noiseReduction || true,
          autoGainControl: true
        }
      });

      this.startRecording(stream);
    } catch (error) {
      throw new Error('Microphone access denied or unavailable');
    }
  }

  async captureSystemAudio() {
    // Capture system audio (tab audio)
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      this.startRecording(stream);
    } catch (error) {
      throw new Error('System audio capture not supported or denied');
    }
  }

  async captureHybridAudio() {
    // Try direct first, fallback to microphone
    try {
      await this.captureDirectAudio();
    } catch {
      await this.captureMicrophoneAudio();
    }
  }

  startRecording(stream) {
    // Create media recorder
    const options = { mimeType: 'audio/webm' };
    this.mediaRecorder = new MediaRecorder(stream, options);

    const audioChunks = [];
    
    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });

    this.mediaRecorder.addEventListener('stop', async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      await this.processAudioChunk(audioBlob);
      
      // Restart recording if still active
      if (this.isActive) {
        audioChunks.length = 0;
        this.mediaRecorder.start();
      }
    });

    // Record in chunks for real-time processing
    const chunkDuration = this.settings.chunkDuration || 3000; // 3 seconds
    this.mediaRecorder.start();
    
    // Stop and process periodically
    setInterval(() => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
    }, chunkDuration);
  }

  async processAudioChunk(audioBlob) {
    try {
      // Send audio to background for transcription
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result;
        
        // Request transcription from background
        const response = await chrome.runtime.sendMessage({
          action: 'transcribeAudio',
          data: { audio: base64Audio }
        });

        if (response.success && response.text) {
          // Translate the transcribed text
          await this.translateAndDisplay(response.text);
        }
      };
    } catch (error) {
      console.error('Audio processing failed:', error);
    }
  }

  async translateAndDisplay(text) {
    if (!text || text.trim() === '') return;

    try {
      // Get translation from background
      const response = await chrome.runtime.sendMessage({
        action: 'translateText',
        data: {
          text,
          sourceLang: this.settings.sourceLang || 'auto',
          targetLang: this.settings.targetLang || 'en',
          engine: this.settings.translationEngine || 'auto'
        }
      });

      if (response.success && response.translation) {
        this.displaySubtitle(response.translation);
      }
    } catch (error) {
      console.error('Translation failed:', error);
    }
  }

  displaySubtitle(text) {
    if (!this.subtitleContainer) return;

    this.currentSubtitle = text;
    this.subtitleContainer.textContent = text;
    this.subtitleContainer.classList.add('vt-visible');

    // Auto-hide after duration
    const duration = this.settings.subtitleDuration || 5000;
    setTimeout(() => {
      this.subtitleContainer.classList.remove('vt-visible');
    }, duration);
  }

  adjustFontSize(delta) {
    if (!this.settings) return { success: false };

    this.settings.fontSize = (this.settings.fontSize || 20) + delta;
    this.settings.fontSize = Math.max(12, Math.min(48, this.settings.fontSize));
    
    this.applySubtitleStyles();
    
    return { success: true, fontSize: this.settings.fontSize };
  }

  makeSubtitleDraggable() {
    if (!this.subtitleContainer) return;

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    this.subtitleContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = this.subtitleContainer.offsetLeft;
      startTop = this.subtitleContainer.offsetTop;
      this.subtitleContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      this.subtitleContainer.style.left = `${startLeft + deltaX}px`;
      this.subtitleContainer.style.top = `${startTop + deltaY}px`;
      this.subtitleContainer.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      this.subtitleContainer.style.cursor = 'grab';
    });
  }

  onVideoPlay(video) {
    console.log('Video started playing');
  }

  onVideoPause(video) {
    console.log('Video paused');
  }

  onVideoSeeked(video) {
    console.log('Video seeked to', video.currentTime);
    // Clear current subtitle when seeking
    if (this.subtitleContainer) {
      this.subtitleContainer.classList.remove('vt-visible');
    }
  }

  showError(message) {
    if (!this.subtitleContainer) {
      this.createSubtitleContainer();
    }
    
    this.subtitleContainer.textContent = `⚠️ ${message}`;
    this.subtitleContainer.classList.add('vt-visible', 'vt-error');
    
    setTimeout(() => {
      this.subtitleContainer.classList.remove('vt-visible', 'vt-error');
    }, 5000);
  }
}

// Initialize content script
const videoTranslator = new VideoTranslatorContent();
