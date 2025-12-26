import React, { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  group?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  disabled = false,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    opt.description?.toLowerCase().includes(search.toLowerCase())
  );

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

    const availableOptions = filteredOptions.filter(opt => !opt.disabled);

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && focusedIndex < availableOptions.length) {
          onChange(availableOptions[focusedIndex].value);
          setIsOpen(false);
          setSearch('');
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => (prev < availableOptions.length - 1 ? prev + 1 : prev));
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
      case 'Delete':
        if (search && searchable) {
          setSearch(search.slice(0, -1));
        }
        break;

      default:
        if (searchable && e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
          setSearch(prev => prev + e.key.toLowerCase());
          setFocusedIndex(0);
        }
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch('');
  };

  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = option.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
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
        {selectedOption ? (
          <div className={styles.selected}>
            {selectedOption.icon && <span className={styles.icon}>{selectedOption.icon}</span>}
            <span className={styles.label}>{selectedOption.label}</span>
          </div>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className={styles.dropdown} ref={dropdownRef} role="listbox">
          {searchable && (
            <div className={styles.search}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                autoFocus
              />
            </div>
          )}

          <div className={styles.options}>
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <div key={group} className={styles.group}>
                {group !== 'default' && (
                  <div className={styles.groupLabel}>{group}</div>
                )}
                {groupOptions.map((option, index) => {
                  const globalIndex = filteredOptions.indexOf(option);
                  return (
                    <div
                      key={option.value}
                      className={`${styles.option} ${value === option.value ? styles.selected : ''} ${focusedIndex === globalIndex ? styles.focused : ''} ${option.disabled ? styles.disabled : ''}`}
                      onClick={() => !option.disabled && handleOptionClick(option.value)}
                      onMouseEnter={() => setFocusedIndex(globalIndex)}
                      role="option"
                      aria-selected={value === option.value}
                    >
                      {option.icon && <span className={styles.icon}>{option.icon}</span>}
                      <div className={styles.optionContent}>
                        <span className={styles.optionLabel}>{option.label}</span>
                        {option.description && (
                          <span className={styles.optionDescription}>{option.description}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className={styles.noOptions}>No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
