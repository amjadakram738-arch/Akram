const MESSAGE_TIMEOUT = 30000;

let messageIdCounter = 0;

const generateMessageId = (): string => {
  return `msg_${Date.now()}_${++messageIdCounter}`;
};

export const sendMessage = async <T = unknown>(
  message: any,
  options: { timeout?: number; retry?: number; retryDelay?: number } = {}
): Promise<T> => {
  const { timeout = MESSAGE_TIMEOUT, retry = 0, retryDelay = 1000 } = options;
  const messageId = generateMessageId();
  
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Message timeout: ${messageId}`));
    }, timeout);

    chrome.runtime.sendMessage({ ...message, id: messageId }, (response: any) => {
      clearTimeout(timeoutId);
      
      if (chrome.runtime.lastError) {
        if (retry > 0) {
          setTimeout(async () => {
            try {
              const result = await sendMessage<T>(message, { ...options, retry: retry - 1, retryDelay });
              resolve(result);
            } catch (error) {
              reject(error);
            }
          }, retryDelay);
        } else {
          reject(new Error(chrome.runtime.lastError.message));
        }
        return;
      }

      if (response) {
        resolve(response as T);
      } else {
        reject(new Error('No response received'));
      }
    });
  });
};

export const sendMessageToTab = async <T = unknown>(
  tabId: number,
  message: any,
  options: { timeout?: number } = {}
): Promise<T> => {
  const { timeout = MESSAGE_TIMEOUT } = options;
  const messageId = generateMessageId();

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Tab message timeout: ${messageId}`));
    }, timeout);

    chrome.tabs.sendMessage(tabId, { ...message, id: messageId }, (response: any) => {
      clearTimeout(timeoutId);

      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (response) {
        resolve(response as T);
      } else {
        reject(new Error('No response received from tab'));
      }
    });
  });
};

export const broadcastMessage = (message: any): void => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {
          // Tab might not have content script loaded
        });
      }
    });
  });
};

export const MESSAGE_TYPES = {
  GET_STATUS: 'GET_STATUS',
  STATUS: 'STATUS',
  TOGGLE_ACTIVE: 'TOGGLE_ACTIVE',
  MODE_CHANGED: 'MODE_CHANGED',
  LANGUAGE_CHANGED: 'LANGUAGE_CHANGED',
  ENGINE_CHANGED: 'ENGINE_CHANGED',
  TRANSLATION_REQUEST: 'TRANSLATION_REQUEST',
  TRANSLATION_RESPONSE: 'TRANSLATION_RESPONSE',
  SHOW_SUBTITLE: 'SHOW_SUBTITLE',
  HIDE_SUBTITLE: 'HIDE_SUBTITLE',
  ERROR: 'ERROR',
  GET_STATISTICS: 'GET_STATISTICS',
  STATISTICS: 'STATISTICS',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  SETTINGS_CHANGED: 'SETTINGS_CHANGED',
  CLEAR_DATA: 'CLEAR_DATA',
  DATA_CLEARED: 'DATA_CLEARED',
  EXPORT_SETTINGS: 'EXPORT_SETTINGS',
  IMPORT_SETTINGS: 'IMPORT_SETTINGS',
  KEYBOARD_SHORTCUT: 'KEYBOARD_SHORTCUT',
  AUDIO_LEVEL: 'AUDIO_LEVEL',
  VIDEO_DETECTED: 'VIDEO_DETECTED',
} as const;

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];
