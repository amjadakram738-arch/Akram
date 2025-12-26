import { AppConfig } from './common';

export interface UITheme {
  id: string;
  name: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    textPrimary: string;
    textSecondary: string;
    accentColor: string;
    accentLight: string;
    borderColor: string;
    successColor: string;
    warningColor: string;
    errorColor: string;
  };
}

export interface PopupState {
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  mode: string;
  sourceLanguage: string;
  targetLanguage: string;
  translationEngine: string;
  translationCount: number;
  lastTranslationTime: number | null;
}

export interface OverlaySettings {
  visible: boolean;
  position: { x: number; y: number };
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  opacity: number;
  fontFamily: string;
  displayMode: string;
  positionMode: 'top' | 'bottom' | 'center' | 'custom';
  customX?: number;
  customY?: number;
}

export interface QuickSettings {
  subtitlesEnabled: boolean;
  audioCaptureEnabled: boolean;
  autoTranslate: boolean;
  showOriginal: boolean;
}

export interface PopupActions {
  toggleActive: () => void;
  changeMode: (mode: string) => void;
  changeSourceLanguage: (lang: string) => void;
  changeTargetLanguage: (lang: string) => void;
  openSettings: () => void;
  retryTranslation: () => void;
}

export interface SettingsPanelState {
  activeTab: string;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: number | null;
}

export interface DashboardState {
  isLoading: boolean;
  stats: DashboardStatsData | null;
  error: string | null;
  refreshInterval: number;
}

export interface DashboardStatsData {
  totalVideos: number;
  totalTranslations: number;
  totalTimeSaved: number;
  averageResponseTime: number;
  accuracyRate: number;
  todayTranslations: number;
  weekTranslations: number;
  monthTranslations: number;
  topLanguages: Array<{ language: string; count: number }>;
  engineUsage: Array<{ engine: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
  memoryUsage: number;
  cpuUsage: number;
}

export interface MessagePayloads {
  GET_STATUS: undefined;
  STATUS_RESPONSE: PopupState;
  MODE_CHANGED: { mode: string };
  LANGUAGE_CHANGED: { source: string; target: string };
  TOGGLE_SUBTITLES: { enabled: boolean };
  TRANSLATION_COMPLETE: { text: string; translation: string };
  ERROR: { message: string; code: string };
  RETRY_TRANSLATION: undefined;
  GET_STATISTICS: undefined;
  STATISTICS_RESPONSE: DashboardStatsData;
}

export type MessageType = keyof MessagePayloads;

export interface Message<T extends MessageType = MessageType> {
  type: T;
  payload: MessagePayloads[T];
}

export interface SettingsSaveOptions {
  validate?: boolean;
  encrypt?: boolean;
  sync?: boolean;
}

export interface ThemeMode {
  mode: 'light' | 'dark' | 'auto';
  systemPreference: 'light' | 'dark';
  userPreference: 'light' | 'dark' | null;
}

export interface AudioLevel {
  current: number;
  peak: number;
  threshold: number;
}

export interface VideoInfo {
  id: string;
  platform: string;
  url: string;
  title: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
}

export interface SubtitleInfo {
  id: string;
  startTime: number;
  endTime: number;
  originalText: string;
  translatedText: string;
  confidence: number;
}

export interface TranslationSession {
  id: string;
  startTime: number;
  videoUrl: string;
  sourceLanguage: string;
  targetLanguage: string;
  translations: SubtitleInfo[];
  status: 'active' | 'paused' | 'completed' | 'error';
}
