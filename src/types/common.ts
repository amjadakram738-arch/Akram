export type OperatingMode = 'auto' | 'manual' | 'economy' | 'high_accuracy' | 'silent' | 'interactive' | 'normal' | 'fast' | 'beta' | 'cloud' | 'shared';

export type TranslationEngine = 'google' | 'libre' | 'mymemory' | 'deepl' | 'microsoft' | 'yandex' | 'apertium' | 'argos' | 'opennmt' | 'whisper';

export type AudioCaptureMethod = 'direct' | 'microphone' | 'hybrid' | 'api' | 'manual' | 'multi_channel' | 'noise_filter' | 'advanced_noise_filter' | 'real_time' | 'buffer' | 'compressed' | 'disabled';

export interface AppConfig {
  mode: OperatingMode;
  sourceLanguage: string;
  targetLanguage: string;
  translationEngine: TranslationEngine;
  audioCapture: AudioCaptureMethod;
  displaySettings: DisplaySettings;
  audioSettings: AudioSettings;
  performanceSettings: PerformanceSettings;
  privacySettings: PrivacySettings;
  integrationsSettings: IntegrationsSettings;
  advancedSettings: AdvancedSettings;
  theme: 'light' | 'dark' | 'auto';
  uiLanguage: string;
  autoUpdates: boolean;
}

export interface DisplaySettings {
  enabled: boolean;
  fontSize: number;
  fontFamily: 'sans' | 'serif' | 'monospace';
  fontColor: string;
  backgroundColor: string;
  opacity: number;
  position: 'top' | 'bottom' | 'center' | 'custom';
  customX?: number;
  customY?: number;
  displayMode: 'simple' | 'cinematic' | 'educational' | 'interactive';
  shadowEnabled: boolean;
  borderRadius: number;
}

export interface AudioSettings {
  captureMethod: string;
  microphoneSensitivity: 'low' | 'medium' | 'high';
  noiseFilterLevel: 'off' | 'light' | 'medium' | 'heavy';
  multiChannelEnabled: boolean;
  alwaysCapture: boolean;
  audioDevice: string;
}

export interface PerformanceSettings {
  mode: 'high' | 'balanced' | 'low';
  gpuAcceleration: boolean;
  memoryLimit: number;
  batterySaverMode: boolean;
  threadCount: number | 'auto';
}

export interface PrivacySettings {
  localOnlyMode: boolean;
  autoDeleteRecordings: 'disabled' | '1h' | '24h' | '1w';
  anonymousMode: boolean;
  passwordProtection: boolean;
  quickLock: boolean;
  dataEncryption: boolean;
}

export interface IntegrationsSettings {
  googleDrive: boolean;
  dropbox: boolean;
  whitelist: string[];
  blacklist: string[];
  supportedPlatforms: string[];
}

export interface AdvancedSettings {
  customEndpoints: string[];
  webhooks: string[];
  advancedAudio: boolean;
  developerMode: boolean;
  experimentalFeatures: boolean;
}

export interface TranslationResult {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
  confidence: number;
  engine: string;
  duration: number;
  cached: boolean;
}

export interface DashboardStats {
  totalVideos: number;
  totalTranslations: number;
  totalTimeSaved: number;
  averageResponseTime: number;
  accuracyRate: number;
  topLanguages: Array<{ language: string; count: number }>;
  dailyUsage: Array<{ date: string; count: number }>;
  enginePerformance: Array<{ engine: string; success: number; failure: number }>;
}
