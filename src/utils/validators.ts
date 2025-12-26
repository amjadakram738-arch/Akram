export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('URL is required');
    return { isValid: false, errors };
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push('URL must use HTTP or HTTPS protocol');
    }
    if (!urlObj.hostname) {
      errors.push('URL must have a valid hostname');
    }
  } catch {
    errors.push('Invalid URL format');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateApiKey = (apiKey: string, serviceName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!apiKey) {
    errors.push(`${serviceName} API key is required`);
    return { isValid: false, errors };
  }

  if (apiKey.length < 8) {
    errors.push(`${serviceName} API key is too short`);
  }

  if (apiKey.includes(' ')) {
    errors.push(`${serviceName} API key should not contain spaces`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateLanguageCode = (code: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!code) {
    errors.push('Language code is required');
    return { isValid: false, errors };
  }

  const validCodeRegex = /^[a-z]{2}(_[A-Z]{2})?$/;
  if (!validCodeRegex.test(code) && code !== 'auto') {
    errors.push('Invalid language code format (e.g., en, es, zh_CN)');
  }

  return { isValid: errors.length === 0, errors };
};

export const validatePercentage = (value: number, min = 0, max = 100): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof value !== 'number' || isNaN(value)) {
    errors.push('Value must be a number');
    return { isValid: false, errors };
  }

  if (value < min || value > max) {
    errors.push(`Value must be between ${min}% and ${max}%`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateFontSize = (size: number): ValidationResult => {
  return validateRange(size, 8, 72, 'Font size');
};

export const validateRange = (value: number, min: number, max: number, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof value !== 'number' || isNaN(value)) {
    errors.push(`${fieldName} must be a number`);
    return { isValid: false, errors };
  }

  if (value < min || value > max) {
    errors.push(`${fieldName} must be between ${min} and ${max}`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateColor = (color: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!color) {
    errors.push('Color is required');
    return { isValid: false, errors };
  }

  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbaRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;

  if (!hexRegex.test(color) && !rgbaRegex.test(color)) {
    errors.push('Invalid color format. Use hex (#RRGGBB) or rgba() format');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateSettings = (settings: Record<string, unknown>): ValidationResult => {
  const errors: string[] = [];
  
  if (!settings || typeof settings !== 'object') {
    errors.push('Settings must be an object');
    return { isValid: false, errors };
  }

  if (settings.theme && !['light', 'dark', 'auto'].includes(String(settings.theme))) {
    errors.push('Theme must be light, dark, or auto');
  }

  if (settings.uiLanguage && !/^[a-z]{2}(_[A-Z]{2})?$/.test(String(settings.uiLanguage))) {
    errors.push('Invalid UI language code');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateShortcut = (shortcut: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!shortcut) {
    errors.push('Shortcut is required');
    return { isValid: false, errors };
  }

  const validModifiers = ['Ctrl', 'Alt', 'Shift', 'Meta', 'Command'];
  const parts = shortcut.split('+');
  
  if (parts.length < 2) {
    errors.push('Shortcut must include a modifier key (Ctrl, Alt, Shift, or Command)');
  }

  const key = parts[parts.length - 1];
  if (key && key.length === 1 && /^[A-Za-z]$/.test(key)) {
    // Valid single letter key
  } else if (!validModifiers.includes(key) && !['Escape', 'Enter', 'Space', 'Tab', 'Backspace'].includes(key)) {
    errors.push('Invalid key in shortcut');
  }

  return { isValid: errors.length === 0, errors };
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
};

export const validateFileSize = (file: File, maxSizeMB: number): ValidationResult => {
  const errors: string[] = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    errors.push(`File size exceeds ${maxSizeMB}MB limit`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateFileType = (file: File, allowedTypes: string[]): ValidationResult => {
  const errors: string[] = [];
  
  if (!allowedTypes.some(type => file.type.match(type))) {
    errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
};
