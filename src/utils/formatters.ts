export const formatNumber = (num: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(hours.toString());
  parts.push(minutes.toString().padStart(2, '0'));
  parts.push(secs.toString().padStart(2, '0'));

  return parts.join(':');
};

export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

export const formatDate = (date: Date | number, format: 'short' | 'long' | 'relative' = 'short'): string => {
  const d = typeof date === 'number' ? new Date(date) : date;
  
  if (format === 'relative') {
    return formatTimeAgo(d.getTime());
  }

  const options: Intl.DateTimeFormatOptions = format === 'long' 
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' };

  return new Intl.DateTimeFormat('en-US', options).format(d);
};

export const formatPercentage = (value: number, decimals = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

export const formatMilliseconds = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

export const formatLanguageName = (code: string): string => {
  const languageNames = new Intl.DisplayNames([navigator.language], { type: 'language' });
  try {
    return languageNames.of(code) || code;
  } catch {
    return code;
  }
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatRelativeTime = (value: number, unit: 'second' | 'minute' | 'hour' | 'day'): string => {
  const pluralize = (val: number, noun: string) => `${val} ${noun}${val !== 1 ? 's' : ''}`;
  
  switch (unit) {
    case 'second': return pluralize(value, 'second');
    case 'minute': return pluralize(value, 'minute');
    case 'hour': return pluralize(value, 'hour');
    case 'day': return pluralize(value, 'day');
    default: return String(value);
  }
};
