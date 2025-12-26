import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UI_LANGUAGES, TRANSLATION_LANGUAGES, RTL_LANGUAGES } from '../../constants/languages';
import styles from './LanguageSelector.module.css';

interface Language {
  code: string;
  name: string;
  flag?: string;
}

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  placeholder?: string;
  languages?: Language[];
  showAutoDetect?: boolean;
  className?: string;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select language',
  languages = TRANSLATION_LANGUAGES,
  showAutoDetect = true,
  className = '',
  disabled = false,
}) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isRtl = RTL_LANGUAGES.includes(value);

  const filtered = languages.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.code.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLanguage = languages.find(l => l.code === value) || {
    code: value,
    name: value === 'auto' ? 'Auto Detect' : value,
  };

  const scrollToFocused = useCallback(() => {
    if (listRef.current && focusedIndex >= 0) {
      const focusedElement = listRef.current.children[focusedIndex + 1] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  useEffect(() => {
    scrollToFocused();
  }, [focusedIndex, scrollToFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && focusedIndex < filtered.length) {
          onChange(filtered[focusedIndex].code);
          setIsOpen(false);
          setSearch('');
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;

      case 'Escape':
        setIsOpen(false);
        setSearch('');
        break;

      case 'Backspace':
        if (search === '' && value !== 'auto') {
          setSearch('');
        }
        break;
    }
  };

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''} ${isRtl ? styles.rtl : ''}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        className={styles.trigger}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedLanguage.flag && (
          <span className={styles.flag}>{selectedLanguage.flag}</span>
        )}
        <span className={styles.name}>
          {selectedLanguage.name || placeholder}
        </span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <div className={styles.searchWrapper}>
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder={placeholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setFocusedIndex(0);
              }}
              autoFocus
            />
          </div>

          <div className={styles.options} ref={listRef}>
            {showAutoDetect && !search && (
              <div
                className={`${styles.option} ${value === 'auto' ? styles.selected : ''} ${focusedIndex === 0 ? styles.focused : ''}`}
                onClick={() => handleSelect('auto')}
                onMouseEnter={() => setFocusedIndex(0)}
                role="option"
                aria-selected={value === 'auto'}
              >
                <span className={styles.flag}>🔄</span>
                <span className={styles.name}>Auto Detect</span>
                <span className={styles.code}>auto</span>
              </div>
            )}

            {filtered.map((lang, index) => (
              <div
                key={lang.code}
                className={`${styles.option} ${value === lang.code ? styles.selected : ''} ${focusedIndex === index + (showAutoDetect && !search ? 1 : 0) ? styles.focused : ''}`}
                onClick={() => handleSelect(lang.code)}
                onMouseEnter={() => setFocusedIndex(index + (showAutoDetect && !search ? 1 : 0))}
                role="option"
                aria-selected={value === lang.code}
              >
                {lang.flag && <span className={styles.flag}>{lang.flag}</span>}
                <span className={styles.name}>{lang.name}</span>
                <span className={styles.code}>{lang.code}</span>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className={styles.noResults}>
                No languages found for "{search}"
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <span>{languages.length} languages available</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface UILanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  className?: string;
}

export const UILanguageSelector: React.FC<UILanguageSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <LanguageSelector
      value={value}
      onChange={onChange}
      languages={UI_LANGUAGES}
      placeholder="Select UI language"
      showAutoDetect={false}
      className={className}
    />
  );
};
