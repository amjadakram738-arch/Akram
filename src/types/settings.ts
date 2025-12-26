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
  textAlign?: 'left' | 'center' | 'right';
  [key: string]: any;
}

export interface AudioSettings {
  captureMethod: string;
  microphoneSensitivity: 'low' | 'medium' | 'high';
  noiseFilterLevel: 'off' | 'light' | 'medium' | 'heavy';
  multiChannelEnabled: boolean;
  alwaysCapture: boolean;
  audioDevice: string;
  [key: string]: any;
}

export interface PerformanceSettings {
  mode: 'high' | 'balanced' | 'low';
  gpuAcceleration: boolean;
  memoryLimit: number;
  batterySaverMode: boolean;
  threadCount: number | 'auto';
  qualityMode?: 'high' | 'medium' | 'low';
  [key: string]: any;
}

export interface PrivacySettings {
  localOnlyMode: boolean;
  autoDeleteRecordings: 'disabled' | '1h' | '24h' | '1w' | '1m';
  anonymousMode: boolean;
  passwordProtection: boolean;
  quickLock: boolean;
  dataEncryption: boolean;
  [key: string]: any;
}

export interface IntegrationsSettings {
  googleDrive: boolean;
  dropbox: boolean;
  whitelist: string[];
  blacklist: string[];
  supportedPlatforms: string[];
  [key: string]: any;
}

export interface AdvancedSettings {
  customEndpoints: string[];
  webhooks: Array<{ url: string; events: string[] }>;
  advancedAudio: boolean;
  developerMode: boolean;
  experimentalFeatures: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  maxRetries?: number;
  timeout?: number;
  retryAttempts?: number;
  cacheEnabled?: boolean;
  [key: string]: any;
}
