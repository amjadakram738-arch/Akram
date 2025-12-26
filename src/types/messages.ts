export interface Message {
  id: string;
  timestamp: number;
  direction: 'toBackground' | 'toContent' | 'toPopup' | 'toOptions';
}

export interface VideoDetectedMessage extends Message {
  type: 'VIDEO_DETECTED';
  payload: { videoId: string; platform: string; url: string };
}

export interface SubtitleCapturedMessage extends Message {
  type: 'SUBTITLE_CAPTURED';
  payload: { text: string; startTime: number; endTime: number };
}

export interface AudioLevelMessage extends Message {
  type: 'AUDIO_LEVEL';
  payload: { level: number; peak: number };
}

export interface TranslationRequestMessage extends Message {
  type: 'TRANSLATION_REQUEST';
  payload: { text: string; sourceLang: string; targetLang: string };
}

export interface OverlayReadyMessage extends Message {
  type: 'OVERLAY_READY';
  payload: { videoId: string };
}

export interface KeyboardShortcutMessage extends Message {
  type: 'KEYBOARD_SHORTCUT';
  payload: { shortcut: string };
}

export interface GetOverlayStateMessage extends Message {
  type: 'GET_OVERLAY_STATE';
  payload: undefined;
}

export interface ShowSubtitleMessage extends Message {
  type: 'SHOW_SUBTITLE';
  payload: { text: string; translatedText?: string; position?: { x: number; y: number } };
}

export interface HideSubtitleMessage extends Message {
  type: 'HIDE_SUBTITLE';
  payload: undefined;
}

export interface UpdateStyleMessage extends Message {
  type: 'UPDATE_STYLE';
  payload: { style: Record<string, string> };
}

export interface TranslationResultMessage extends Message {
  type: 'TRANSLATION_RESULT';
  payload: { requestId: string; translation: string; confidence: number };
}

export interface ErrorMessage extends Message {
  type: 'ERROR';
  payload: { code: string; message: string };
}

export interface SettingsUpdatedMessage extends Message {
  type: 'SETTINGS_UPDATED';
  payload: { settings: Record<string, unknown> };
}

export interface OverlayStateMessage extends Message {
  type: 'OVERLAY_STATE';
  payload: { visible: boolean; settings: Record<string, unknown> };
}

export interface GetStatusMessage extends Message {
  type: 'GET_STATUS';
  payload: undefined;
}

export interface ToggleActiveMessage extends Message {
  type: 'TOGGLE_ACTIVE';
  payload: { enabled: boolean };
}

export interface SetModeMessage extends Message {
  type: 'SET_MODE';
  payload: { mode: string };
}

export interface SetLanguagesMessage extends Message {
  type: 'SET_LANGUAGES';
  payload: { source: string; target: string };
}

export interface SetEngineMessage extends Message {
  type: 'SET_ENGINE';
  payload: { engine: string };
}

export interface QuickTranslateMessage extends Message {
  type: 'QUICK_TRANSLATE';
  payload: { text: string };
}

export interface RetryMessage extends Message {
  type: 'RETRY';
  payload: { requestId: string };
}

export interface GetStatisticsMessage extends Message {
  type: 'GET_STATISTICS';
  payload: undefined;
}

export interface StatisticsMessage extends Message {
  type: 'STATISTICS';
  payload: Record<string, unknown>;
}

export interface StatusMessage extends Message {
  type: 'STATUS';
  payload: { 
    isActive: boolean; 
    mode: string;
    sourceLanguage: string;
    targetLanguage: string;
    engine: string;
    translationCount: number;
  };
}

export interface TranslationCompleteMessage extends Message {
  type: 'TRANSLATION_COMPLETE';
  payload: { requestId: string; translation: string };
}

export interface SettingsExportMessage extends Message {
  type: 'SETTINGS_EXPORT';
  payload: { settings: string };
}

export interface SaveSettingsMessage extends Message {
  type: 'SAVE_SETTINGS';
  payload: { settings: Record<string, unknown> };
}

export interface ResetSettingsMessage extends Message {
  type: 'RESET_SETTINGS';
  payload: undefined;
}

export interface GetAllSettingsMessage extends Message {
  type: 'GET_ALL_SETTINGS';
  payload: undefined;
}

export interface ClearDataMessage extends Message {
  type: 'CLEAR_DATA';
  payload: { type: 'translations' | 'cache' | 'all' };
}

export interface SetShortcutMessage extends Message {
  type: 'SET_SHORTCUT';
  payload: { action: string; shortcut: string };
}

export interface AllSettingsMessage extends Message {
  type: 'ALL_SETTINGS';
  payload: Record<string, unknown>;
}

export interface SettingsSavedMessage extends Message {
  type: 'SETTINGS_SAVED';
  payload: { timestamp: number };
}

export interface DataClearedMessage extends Message {
  type: 'DATA_CLEARED';
  payload: { type: string };
}

export type ToBackgroundMessage = 
  | VideoDetectedMessage
  | SubtitleCapturedMessage
  | AudioLevelMessage
  | TranslationRequestMessage
  | OverlayReadyMessage
  | KeyboardShortcutMessage
  | GetOverlayStateMessage
  | GetStatusMessage
  | ToggleActiveMessage
  | SetModeMessage
  | SetLanguagesMessage
  | SetEngineMessage
  | QuickTranslateMessage
  | RetryMessage
  | GetStatisticsMessage
  | SaveSettingsMessage
  | ResetSettingsMessage
  | GetAllSettingsMessage
  | ClearDataMessage
  | SetShortcutMessage;

export type FromBackgroundMessage = 
  | ShowSubtitleMessage
  | HideSubtitleMessage
  | UpdateStyleMessage
  | TranslationResultMessage
  | ErrorMessage
  | SettingsUpdatedMessage
  | OverlayStateMessage
  | StatusMessage
  | TranslationCompleteMessage
  | StatisticsMessage
  | SettingsExportMessage
  | AllSettingsMessage
  | SettingsSavedMessage
  | DataClearedMessage;

export type ContentToBackground = ToBackgroundMessage;
export type BackgroundToContent = FromBackgroundMessage;
