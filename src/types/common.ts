import { DisplaySettings, AudioSettings, PerformanceSettings, PrivacySettings, IntegrationsSettings, AdvancedSettings } from './settings';

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
  showHints?: boolean;
  compactMode?: boolean;
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
