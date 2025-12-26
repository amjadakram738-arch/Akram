import { TranslationEngine } from '../types/common';

export const TRANSLATION_ENGINES: { 
  id: TranslationEngine; 
  name: string; 
  description: string; 
  free: boolean; 
  apiKeyRequired: boolean;
  languages: number;
  icon: string;
  quality: 'high' | 'medium' | 'low';
  speed: 'fast' | 'medium' | 'slow';
  fallbackOrder: number;
}[] = [
  { 
    id: 'google', 
    name: 'Google Translate', 
    description: 'Free Google Translate API - No API key required',
    free: true, 
    apiKeyRequired: false,
    languages: 133,
    icon: '🌐',
    quality: 'medium',
    speed: 'fast',
    fallbackOrder: 1
  },
  { 
    id: 'libre', 
    name: 'LibreTranslate', 
    description: 'Open-source translation engine - Self-hosted option available',
    free: true, 
    apiKeyRequired: false,
    languages: 19,
    icon: '🔓',
    quality: 'medium',
    speed: 'medium',
    fallbackOrder: 2
  },
  { 
    id: 'mymemory', 
    name: 'MyMemory', 
    description: 'Free translation memory with human translations',
    free: true, 
    apiKeyRequired: false,
    languages: 100,
    icon: '📚',
    quality: 'high',
    speed: 'fast',
    fallbackOrder: 3
  },
  { 
    id: 'deepl', 
    name: 'DeepL', 
    description: 'High-quality neural machine translation (Free tier available)',
    free: true, 
    apiKeyRequired: true,
    languages: 29,
    icon: '🧠',
    quality: 'high',
    speed: 'medium',
    fallbackOrder: 4
  },
  { 
    id: 'microsoft', 
    name: 'Microsoft Translator', 
    description: 'Azure-based translation with extensive language support',
    free: true, 
    apiKeyRequired: true,
    languages: 100,
    icon: '📦',
    quality: 'medium',
    speed: 'fast',
    fallbackOrder: 5
  },
  { 
    id: 'yandex', 
    name: 'Yandex Translate', 
    description: 'Russian-based translation service with good quality',
    free: true, 
    apiKeyRequired: true,
    languages: 100,
    icon: '🦈',
    quality: 'medium',
    speed: 'fast',
    fallbackOrder: 6
  },
  { 
    id: 'apertium', 
    name: 'Apertium', 
    description: 'Rule-based open-source translation platform',
    free: true, 
    apiKeyRequired: false,
    languages: 40,
    icon: '⚙️',
    quality: 'low',
    speed: 'fast',
    fallbackOrder: 7
  },
  { 
    id: 'argos', 
    name: 'Argos Translate', 
    description: 'Open-source neural machine translation',
    free: true, 
    apiKeyRequired: false,
    languages: 20,
    icon: '🔮',
    quality: 'high',
    speed: 'slow',
    fallbackOrder: 8
  },
  { 
    id: 'opennmt', 
    name: 'OpenNMT', 
    description: 'Open-source neural machine translation toolkit',
    free: true, 
    apiKeyRequired: false,
    languages: 30,
    icon: '🔧',
    quality: 'high',
    speed: 'slow',
    fallbackOrder: 9
  },
  { 
    id: 'whisper', 
    name: 'Whisper', 
    description: 'OpenAI Whisper for speech-to-text and translation',
    free: true, 
    apiKeyRequired: false,
    languages: 90,
    icon: '🎤',
    quality: 'high',
    speed: 'slow',
    fallbackOrder: 10
  },
];

export const DEFAULT_ENGINE: TranslationEngine = 'google';

export const getEngineInfo = (engineId: TranslationEngine) => {
  return TRANSLATION_ENGINES.find(e => e.id === engineId) || TRANSLATION_ENGINES[0];
};
