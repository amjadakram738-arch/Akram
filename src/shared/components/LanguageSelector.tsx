import React, { useState } from 'react';
import styles from './LanguageSelector.module.css';

interface Language {
  code: string;
  name: string;
  flag?: string;
}

interface Props {
  value: string;
  onChange: (language: string) => void;
  placeholder?: string;
  languages?: Language[];
}

const DEFAULT_LANGUAGES: Language[] = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

export const LanguageSelector: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'Select language',
  languages = DEFAULT_LANGUAGES,
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = languages.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.code.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLanguage = languages.find(l => l.code === value) || languages[0];

  return (
    <div className={styles.container}>
      <div 
        className={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLanguage.name}
      </div>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className={styles.options}>
            {filtered.map((lang) => (
              <div
                key={lang.code}
                className={`${styles.option} ${value === lang.code ? styles.selected : ''}`}
                onClick={() => {
                  onChange(lang.code);
                  setIsOpen(false);
                  setSearch('');
                }}
              >
                <span className={styles.name}>{lang.name}</span>
                <span className={styles.code}>{lang.code}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
