// Translation Engine - Manages multiple translation services with fallback

export class TranslationEngine {
  constructor() {
    this.engines = {
      libre: this.libreTranslate.bind(this),
      deepl: this.deeplFree.bind(this),
      google: this.googleTranslate.bind(this),
      microsoft: this.microsoftTranslator.bind(this),
      mymemory: this.myMemory.bind(this),
      yandex: this.yandexTranslate.bind(this),
      apertium: this.apertiumTranslate.bind(this),
      argos: this.argosTranslate.bind(this)
    };

    this.fallbackOrder = ['google', 'libre', 'mymemory', 'microsoft', 'deepl'];
    this.cache = new Map();
  }

  async translate(text, sourceLang = 'auto', targetLang = 'en', preferredEngine = 'auto') {
    if (!text || text.trim() === '') {
      return '';
    }

    // Check cache first
    const cacheKey = `${text}-${sourceLang}-${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Detect language if auto
    if (sourceLang === 'auto') {
      sourceLang = await this.detectLanguage(text);
    }

    // If source and target are the same, return original
    if (sourceLang === targetLang) {
      return text;
    }

    let result = null;
    let errors = [];

    // Try preferred engine first
    if (preferredEngine !== 'auto' && this.engines[preferredEngine]) {
      try {
        result = await this.engines[preferredEngine](text, sourceLang, targetLang);
        if (result) {
          this.cache.set(cacheKey, result);
          return result;
        }
      } catch (error) {
        errors.push({ engine: preferredEngine, error: error.message });
      }
    }

    // Fallback to other engines
    for (const engine of this.fallbackOrder) {
      if (engine === preferredEngine) continue;

      try {
        result = await this.engines[engine](text, sourceLang, targetLang);
        if (result) {
          this.cache.set(cacheKey, result);
          return result;
        }
      } catch (error) {
        errors.push({ engine, error: error.message });
      }
    }

    // All engines failed
    console.error('All translation engines failed:', errors);
    throw new Error('Translation failed: All engines unavailable');
  }

  async detectLanguage(text) {
    try {
      // Use Google's free language detection
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data[2]) {
        return data[2];
      }
    } catch (error) {
      console.error('Language detection failed:', error);
    }

    return 'en'; // Default to English
  }

  // LibreTranslate - Free and Open Source
  async libreTranslate(text, source, target) {
    const mirrors = [
      'https://libretranslate.de/translate',
      'https://translate.argosopentech.com/translate',
      'https://translate.terraprint.co/translate'
    ];

    for (const url of mirrors) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            source: source,
            target: target,
            format: 'text'
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.translatedText;
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error('LibreTranslate failed');
  }

  // Google Translate - Free API
  async googleTranslate(text, source, target) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data[0]) {
        return data[0].map(item => item[0]).join('');
      }

      throw new Error('Invalid response from Google Translate');
    } catch (error) {
      throw new Error(`Google Translate failed: ${error.message}`);
    }
  }

  // DeepL Free API
  async deeplFree(text, source, target) {
    try {
      // DeepL free tier (limited)
      const url = 'https://api-free.deepl.com/v2/translate';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          text: text,
          source_lang: source.toUpperCase(),
          target_lang: target.toUpperCase()
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.translations[0].text;
      }

      throw new Error('DeepL request failed');
    } catch (error) {
      throw new Error(`DeepL failed: ${error.message}`);
    }
  }

  // Microsoft Translator - Free Tier
  async microsoftTranslator(text, source, target) {
    try {
      const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${source}&to=${target}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ text }])
      });

      if (response.ok) {
        const data = await response.json();
        return data[0].translations[0].text;
      }

      throw new Error('Microsoft Translator failed');
    } catch (error) {
      throw new Error(`Microsoft Translator failed: ${error.message}`);
    }
  }

  // MyMemory - Free Translation API
  async myMemory(text, source, target) {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData) {
        return data.responseData.translatedText;
      }

      throw new Error('MyMemory failed');
    } catch (error) {
      throw new Error(`MyMemory failed: ${error.message}`);
    }
  }

  // Yandex Translate
  async yandexTranslate(text, source, target) {
    try {
      const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=free&lang=${source}-${target}&text=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 200 && data.text) {
        return data.text[0];
      }

      throw new Error('Yandex failed');
    } catch (error) {
      throw new Error(`Yandex failed: ${error.message}`);
    }
  }

  // Apertium - Open Source Translation
  async apertiumTranslate(text, source, target) {
    try {
      const url = `https://www.apertium.org/apy/translate?langpair=${source}|${target}&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }

      throw new Error('Apertium failed');
    } catch (error) {
      throw new Error(`Apertium failed: ${error.message}`);
    }
  }

  // Argos Translate - Local/Free
  async argosTranslate(text, source, target) {
    try {
      const url = `https://libretranslate.com/translate`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: source,
          target: target
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.translatedText;
      }

      throw new Error('Argos failed');
    } catch (error) {
      throw new Error(`Argos failed: ${error.message}`);
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { code: 'ar', name: 'Arabic' },
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'nl', name: 'Dutch' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'hi', name: 'Hindi' },
      { code: 'tr', name: 'Turkish' },
      { code: 'fa', name: 'Persian' },
      { code: 'el', name: 'Greek' },
      { code: 'he', name: 'Hebrew' },
      { code: 'th', name: 'Thai' },
      { code: 'vi', name: 'Vietnamese' },
      { code: 'id', name: 'Indonesian' },
      { code: 'ms', name: 'Malay' },
      { code: 'pl', name: 'Polish' },
      { code: 'sv', name: 'Swedish' },
      { code: 'no', name: 'Norwegian' },
      { code: 'da', name: 'Danish' },
      { code: 'fi', name: 'Finnish' },
      { code: 'cs', name: 'Czech' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'ro', name: 'Romanian' },
      { code: 'bg', name: 'Bulgarian' },
      { code: 'hr', name: 'Croatian' },
      { code: 'sr', name: 'Serbian' },
      { code: 'uk', name: 'Ukrainian' },
      { code: 'bn', name: 'Bengali' },
      { code: 'ta', name: 'Tamil' }
      // ... 150+ languages supported
    ];
  }
}

export default TranslationEngine;
