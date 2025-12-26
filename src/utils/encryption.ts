const ENCRYPTION_KEY = 'video-translator-secure-key';

const base64Encode = (str: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return '';
  }
};

const base64Decode = (str: string): string => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return '';
  }
};

const simpleXOR = (input: string, key: string): string => {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += String.fromCharCode(
      input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
};

export const encrypt = (data: string, customKey?: string): string => {
  if (!data) return '';
  
  const key = customKey || ENCRYPTION_KEY;
  const encoded = base64Encode(data);
  const encrypted = simpleXOR(encoded, key);
  return base64Encode(encrypted);
};

export const decrypt = (encryptedData: string, customKey?: string): string => {
  if (!encryptedData) return '';
  
  try {
    const key = customKey || ENCRYPTION_KEY;
    const decoded = base64Decode(encryptedData);
    const decrypted = simpleXOR(decoded, key);
    const result = base64Decode(decrypted);
    return result;
  } catch {
    console.error('Decryption failed');
    return '';
  }
};

export const hash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateKey = (length = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
};

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    const encrypted = encrypt(value);
    localStorage.setItem(key, encrypted);
  },

  async getItem(key: string): Promise<string | null> {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decrypt(encrypted);
  },

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    localStorage.clear();
  },
};

export const encryptSettings = async (settings: Record<string, unknown>): Promise<string> => {
  const jsonString = JSON.stringify(settings);
  return encrypt(jsonString);
};

export const decryptSettings = async (encryptedString: string): Promise<Record<string, unknown> | null> => {
  try {
    const decrypted = decrypt(encryptedString);
    return JSON.parse(decrypted);
  } catch {
    console.error('Failed to decrypt settings');
    return null;
  }
};
