import { getOverlayManager } from './OverlayManager';
import { VideoDetector, DetectedPlayer } from './VideoDetector';

let overlayManager: ReturnType<typeof getOverlayManager> | null = null;
let isActive: boolean = false;
let currentSettings: any = null;
let lastSubtitleTime: number = 0;
const SUBTITLE_THROTTLE_MS = 100;

function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

function initialize() {
  overlayManager = getOverlayManager();
  overlayManager.inject();

  setupMessageListener();
  setupKeyboardShortcuts();
  startPlayerMonitoring();

  console.log('Video Translator content script initialized');
}

function setupMessageListener() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'TOGGLE_SUBTITLES':
        isActive = message.enabled;
        if (isActive && message.settings) {
          currentSettings = message.settings;
          overlayManager?.updateSettings(currentSettings);
        }
        sendResponse({ success: true });
        break;

      case 'UPDATE_SETTINGS':
        currentSettings = message.settings;
        overlayManager?.updateSettings(currentSettings);
        sendResponse({ success: true });
        break;

      case 'SHOW_OVERLAY':
        overlayManager?.show();
        sendResponse({ success: true });
        break;

      case 'HIDE_OVERLAY':
        overlayManager?.hide();
        sendResponse({ success: true });
        break;

      case 'GET_OVERLAY_STATE':
        sendResponse({ 
          isActive, 
          isVisible: overlayManager?.show !== undefined,
          settings: currentSettings 
        });
        break;

      case 'SET_POSITION':
        overlayManager?.setPosition(message.x, message.y);
        sendResponse({ success: true });
        break;

      case 'TRANSLATE_TEXT':
        handleTranslation(message.text, message.sourceLang, message.targetLang)
          .then(translation => sendResponse({ translation }))
          .catch(error => sendResponse({ error: error.message }));
        return true;
    }
  });
}

async function handleTranslation(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'TRANSLATE_REQUEST',
      text,
      sourceLang,
      targetLang,
    });
    
    if (response.translation) {
      return response.translation;
    }
    return text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text;
  }
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.key === 'Escape') {
      overlayManager?.hide();
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          isActive = !isActive;
          chrome.runtime.sendMessage({ 
            type: 'TOGGLE_SUBTITLES', 
            enabled: isActive 
          });
          if (isActive) {
            overlayManager?.show();
          } else {
            overlayManager?.hide();
          }
          break;

        case 't':
          e.preventDefault();
          quickTranslate();
          break;

        case 'd':
          e.preventDefault();
          cycleDisplayMode();
          break;
      }
    }
  });
}

async function quickTranslate() {
  const players = VideoDetector.getAllPlayers();
  if (players.length === 0) return;

  const player = players[0];
  const text = getCurrentSubtitle(player);

  if (text) {
    try {
      const stored = await chrome.storage.sync.get(['sourceLanguage', 'targetLanguage', 'translationEngine']);
      const response = await chrome.runtime.sendMessage({
        type: 'TRANSLATE_REQUEST',
        text,
        sourceLang: stored.sourceLanguage || 'auto',
        targetLang: stored.targetLanguage || 'en',
        engine: stored.translationEngine || 'google',
      });

      if (response.translation) {
        overlayManager?.updateSubtitle(text, response.translation, currentSettings);
      }
    } catch (error) {
      console.error('Quick translation failed:', error);
    }
  }
}

function cycleDisplayMode() {
  if (!currentSettings) {
    currentSettings = {};
  }

  const modes = ['simple', 'cinematic', 'educational', 'interactive'];
  const currentIndex = modes.indexOf(currentSettings.displayMode || 'simple');
  const nextMode = modes[(currentIndex + 1) % modes.length];

  currentSettings.displayMode = nextMode;
  overlayManager?.updateSettings(currentSettings);

  chrome.runtime.sendMessage({
    type: 'UPDATE_DISPLAY_MODE',
    displayMode: nextMode,
  });
}

function startPlayerMonitoring() {
  VideoDetector.startMonitoring((players) => {
    if (players.length > 0 && isActive) {
      monitorPlayers(players);
    }
  });
}

function monitorPlayers(players: DetectedPlayer[]) {
  players.forEach(player => {
    player.element.addEventListener('timeupdate', () => {
      const now = Date.now();
      if (now - lastSubtitleTime < SUBTITLE_THROTTLE_MS) return;

      const text = getCurrentSubtitle(player);
      if (text) {
        lastSubtitleTime = now;
        processSubtitle(text, player);
      }
    });

    player.element.addEventListener('play', () => {
      chrome.runtime.sendMessage({ type: 'VIDEO_PLAYED', playerId: player.id });
    });

    player.element.addEventListener('pause', () => {
      chrome.runtime.sendMessage({ type: 'VIDEO_PAUSED', playerId: player.id });
    });

    player.element.addEventListener('volumechange', () => {
      if (player.element.volume === 0 && isActive) {
        chrome.runtime.sendMessage({ type: 'VIDEO_MUTED', playerId: player.id });
      }
    });
  });
}

function getCurrentSubtitle(player: DetectedPlayer): string {
  const textTracks = player.element.textTracks;
  
  for (let i = 0; i < textTracks.length; i++) {
    const track = textTracks[i];
    if (track.mode === 'showing') {
      for (let j = 0; j < track.cues.length; j++) {
        const cue = track.cues[j];
        if (cue instanceof TextTrackCue) {
          const startTime = cue.startTime;
          const endTime = cue.endTime;
          
          if (player.element.currentTime >= startTime && player.element.currentTime <= endTime) {
            return cue.text;
          }
        }
      }
    }
  }

  return '';
}

async function processSubtitle(text: string, player: DetectedPlayer) {
  if (!text.trim() || !isActive) return;

  const cached = await getCachedTranslation(text);
  if (cached) {
    overlayManager?.updateSubtitle(text, cached, currentSettings);
    return;
  }

  try {
    const stored = await chrome.storage.sync.get(['sourceLanguage', 'targetLanguage', 'translationEngine']);
    
    const response = await chrome.runtime.sendMessage({
      type: 'TRANSLATE_REQUEST',
      text,
      sourceLang: stored.sourceLanguage || 'auto',
      targetLang: stored.targetLanguage || 'en',
      engine: stored.translationEngine || 'google',
    });

    if (response.translation) {
      await cacheTranslation(text, response.translation);
      overlayManager?.updateSubtitle(text, response.translation, currentSettings);

      await updateTranslationCount();
    }
  } catch (error) {
    console.error('Subtitle translation failed:', error);
    overlayManager?.updateSubtitle(text, '', currentSettings);
  }
}

async function getCachedTranslation(text: string): Promise<string | null> {
  try {
    const cache = await chrome.storage.local.get(`cache_${hashText(text)}`);
    const cached = cache[`cache_${hashText(text)}`];
    
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.timestamp > Date.now() - 86400000) {
        return parsed.translation;
      }
    }
  } catch {
    // Cache miss or error
  }
  return null;
}

async function cacheTranslation(original: string, translation: string): Promise<void> {
  try {
    await chrome.storage.local.set({
      [`cache_${hashText(original)}`]: JSON.stringify({
        original,
        translation,
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    console.error('Failed to cache translation:', error);
  }
}

function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return String(hash);
}

async function updateTranslationCount(): Promise<void> {
  try {
    const stored = await chrome.storage.local.get('translationCount');
    const count = (stored.translationCount as number) || 0;
    await chrome.storage.local.set({ translationCount: count + 1 });
  } catch (error) {
    console.error('Failed to update translation count:', error);
  }
}

init();

export { init, overlayManager };
