import { ToBackgroundMessage, FromBackgroundMessage, MessageHandler, MessageFilter } from '../types/messages';

const MESSAGE_TIMEOUT = 30000;

export interface MessageOptions {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

export interface MessageChannel {
  port: chrome.runtime.Port;
  handlers: Map<string, Set<MessageHandler>>;
}

let messageIdCounter = 0;

const generateMessageId = (): string => {
  return `msg_${Date.now()}_${++messageIdCounter}`;
};

export const sendMessage = async <T = unknown>(
  message: ToBackgroundMessage,
  options: MessageOptions = {}
): Promise<T> => {
  const { timeout = MESSAGE_TIMEOUT, retry = 0, retryDelay = 1000 } = options;
  const messageId = generateMessageId();
  
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Message timeout: ${messageId}`));
    }, timeout);

    chrome.runtime.sendMessage({ ...message, id: messageId }, (response: FromBackgroundMessage | undefined) => {
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
  message: ToBackgroundMessage,
  options: MessageOptions = {}
): Promise<T> => {
  const { timeout = MESSAGE_TIMEOUT } = options;
  const messageId = generateMessageId();

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Tab message timeout: ${messageId}`));
    }, timeout);

    chrome.tabs.sendMessage(tabId, { ...message, id: messageId }, (response: FromBackgroundMessage | undefined) => {
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

export const createMessageChannel = (
  name: string,
  handlers: Map<string, Set<MessageHandler>> = new Map()
): MessageChannel => {
  const port = chrome.runtime.connect({ name });

  port.onMessage.addListener((message: FromBackgroundMessage, sender) => {
    const handlersForType = handlers.get(message.type);
    if (handlersForType) {
      handlersForType.forEach(handler => {
        try {
          handler(message, sender);
        } catch (error) {
          console.error('Message handler error:', error);
        }
      });
    }
  });

  port.onDisconnect.addListener(() => {
    handlers.clear();
  });

  return { port, handlers };
};

export const addMessageHandler = (
  channel: MessageChannel,
  type: string,
  handler: MessageHandler
): (() => void) => {
  if (!channel.handlers.has(type)) {
    channel.handlers.set(type, new Set());
  }
  channel.handlers.get(type)!.add(handler);

  return () => {
    channel.handlers.get(type)?.delete(handler);
  };
};

export const broadcastMessage = (message: ToBackgroundMessage): void => {
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
