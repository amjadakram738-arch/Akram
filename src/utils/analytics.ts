import { formatNumber } from './formatters';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp?: number;
}

interface SessionData {
  startTime: number;
  videosProcessed: number;
  translationsCount: number;
  errorsCount: number;
  totalDuration: number;
}

let sessionData: SessionData = {
  startTime: Date.now(),
  videosProcessed: 0,
  translationsCount: 0,
  errorsCount: 0,
  totalDuration: 0,
};

let eventBuffer: AnalyticsEvent[] = [];
const BUFFER_FLUSH_INTERVAL = 30000;

const flushBuffer = async (): Promise<void> => {
  if (eventBuffer.length === 0) return;

  const eventsToSend = [...eventBuffer];
  eventBuffer = [];

  try {
    await chrome.storage.local.set({
      analyticsEvents: eventsToSend,
      lastFlushTime: Date.now(),
    });
  } catch (error) {
    console.error('Failed to flush analytics:', error);
  }
};

if (typeof setInterval !== 'undefined') {
  setInterval(flushBuffer, BUFFER_FLUSH_INTERVAL);
}

export const trackEvent = (event: AnalyticsEvent): void => {
  eventBuffer.push({
    ...event,
    timestamp: Date.now(),
  });

  if (eventBuffer.length >= 100) {
    flushBuffer();
  }
};

export const trackTranslation = (sourceLang: string, targetLang: string, engine: string, duration: number): void => {
  sessionData.translationsCount++;

  trackEvent({
    category: 'Translation',
    action: 'translate',
    label: `${sourceLang}->${targetLang}`,
    value: Math.round(duration),
  });
};

export const trackVideoStart = (platform: string): void => {
  sessionData.videosProcessed++;

  trackEvent({
    category: 'Video',
    action: 'start',
    label: platform,
  });
};

export const trackError = (errorCode: string, errorMessage: string): void => {
  sessionData.errorsCount++;

  trackEvent({
    category: 'Error',
    action: errorCode,
    label: errorMessage,
  });
};

export const trackSettingChange = (settingName: string, newValue: string): void => {
  trackEvent({
    category: 'Settings',
    action: 'change',
    label: settingName,
    value: parseInt(newValue) || 0,
  });
};

export const trackFeatureUsage = (featureName: string): void => {
  trackEvent({
    category: 'Feature',
    action: 'use',
    label: featureName,
  });
};

export const trackExtensionInstall = (version: string): void => {
  trackEvent({
    category: 'Extension',
    action: 'install',
    label: version,
  });
};

export const trackExtensionUpdate = (fromVersion: string, toVersion: string): void => {
  trackEvent({
    category: 'Extension',
    action: 'update',
    label: `${fromVersion}->${toVersion}`,
  });
};

export const getSessionStats = (): SessionData => {
  return { ...sessionData };
};

export const getSessionDuration = (): number => {
  return Date.now() - sessionData.startTime;
};

export const getUsageMetrics = async (): Promise<{
  totalTranslations: number;
  totalVideos: number;
  totalErrors: number;
  averageSessionDuration: number;
  topLanguages: Array<{ language: string; count: number }>;
  topEngines: Array<{ engine: string; count: number }>;
}> => {
  const stored = await chrome.storage.local.get([
    'totalTranslations',
    'totalVideos',
    'totalErrors',
    'sessionDurations',
    'languageStats',
    'engineStats',
  ]);

  return {
    totalTranslations: (stored.totalTranslations as number) || 0,
    totalVideos: (stored.totalVideos as number) || 0,
    totalErrors: (stored.totalErrors as number) || 0,
    averageSessionDuration: (stored.sessionDurations as number[])?.reduce((a, b) => a + b, 0) / ((stored.sessionDurations as number[])?.length || 1) || 0,
    topLanguages: (stored.languageStats as Array<{ language: string; count: number }>) || [],
    topEngines: (stored.engineStats as Array<{ engine: string; count: number }>) || [],
  };
};

export const incrementCounter = async (key: string): Promise<void> => {
  const stored = await chrome.storage.local.get(key);
  const current = (stored[key] as number) || 0;
  await chrome.storage.local.set({ [key]: current + 1 });
};

export const recordSessionEnd = async (): Promise<void> => {
  const duration = getSessionDuration();
  
  const stored = await chrome.storage.local.get('sessionDurations');
  const durations = (stored.sessionDurations as number[]) || [];
  durations.push(duration);

  await chrome.storage.local.set({
    sessionDurations: durations.slice(-100),
    totalTranslations: (sessionData.translationsCount || 0) + ((stored.totalTranslations as number) || 0),
    totalVideos: (sessionData.videosProcessed || 0) + ((stored.totalVideos as number) || 0),
    totalErrors: (sessionData.errorsCount || 0) + ((stored.totalErrors as number) || 0),
  });

  sessionData = {
    startTime: Date.now(),
    videosProcessed: 0,
    translationsCount: 0,
    errorsCount: 0,
    totalDuration: 0,
  };
};

export const trackPerformanceMetric = (metric: string, value: number): void => {
  trackEvent({
    category: 'Performance',
    action: metric,
    value: Math.round(value),
  });
};

export const trackUIInteraction = (element: string, action: string): void => {
  trackEvent({
    category: 'UI',
    action: action,
    label: element,
  });
};
