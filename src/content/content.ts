import { OverlayManager } from './OverlayManager';
import { VideoDetector } from './VideoDetector';
import { AppConfig } from '../types/common';
import './content.css';

class ContentScript {
  private overlay: OverlayManager;
  private settings: AppConfig | null = null;

  constructor() {
    this.overlay = new OverlayManager();
    this.init();
  }

  private async init() {
    console.log('Video Translator content script initialized');
    this.overlay.inject();
    
    // Load settings
    chrome.storage.sync.get(null, (items) => {
      this.settings = items as AppConfig;
    });

    // Listen for messages from background/popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'UPDATE_SUBTITLE') {
        if (this.settings && this.settings.displaySettings.enabled) {
          this.overlay.updateSubtitle(message.text, this.settings.displaySettings);
          this.overlay.show();
        }
      } else if (message.type === 'SETTINGS_CHANGED') {
        this.settings = message.settings;
      } else if (message.type === 'TOGGLE_SUBTITLES') {
        if (message.enabled) {
          this.overlay.show();
        } else {
          this.overlay.hide();
        }
      }
    });

    // Detect videos periodically
    setInterval(() => {
      const players = VideoDetector.detectPlayers();
      if (players.length > 0) {
        // Handle players found
      }
    }, 2000);
  }
}

new ContentScript();
