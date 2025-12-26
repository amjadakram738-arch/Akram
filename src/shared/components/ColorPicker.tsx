import React, { useState, useRef, useEffect } from 'react';
import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presets?: string[];
  alpha?: boolean;
  className?: string;
}

const DEFAULT_PRESETS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#008000', '#000080', '#808080', '#FFC0CB', '#A52A2A',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  presets = DEFAULT_PRESETS,
  alpha = false,
  className = '',
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const [alphaValue, setAlphaValue] = useState(100);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(color);
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        setAlphaValue(Math.round((parseFloat(match[4] || '1') * 100)));
      }
    } else {
      setAlphaValue(100);
    }
  }, [color]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange(value);
    }
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    if (alpha) {
      onChange(`rgba(${r}, ${g}, ${b}, ${alphaValue / 100})`);
    } else {
      onChange(`rgb(${r}, ${g}, ${b})`);
    }
  };

  const handleAlphaChange = (value: number) => {
    setAlphaValue(value);
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      onChange(`rgba(${match[1]}, ${match[2]}, ${match[3]}, ${value / 100})`);
    }
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const currentRgb = hexToRgb(color) || { r: 255, g: 255, b: 255 };

  return (
    <div className={`${styles.container} ${className}`} ref={pickerRef}>
      <div
        className={styles.swatch}
        style={{
          backgroundColor: alpha ? color.replace(/[\d.]+\)$/, `${alphaValue / 100})`) : color,
        }}
        onClick={() => setShowPicker(!showPicker)}
      />

      <input
        type="text"
        className={styles.hexInput}
        value={hexInput}
        onChange={(e) => handleHexChange(e.target.value)}
        placeholder="#FFFFFF"
      />

      {showPicker && (
        <div className={styles.picker}>
          <div className={styles.main}>
            <div className={styles.hue}>
              <input
                type="range"
                min="0"
                max="360"
                className={styles.hueSlider}
                onChange={(e) => {
                  const hue = parseInt(e.target.value);
                  onChange(`hsl(${hue}, 100%, 50%)`);
                }}
              />
            </div>
            <div className={styles.saturationLightness}>
              <div
                className={styles.slPreview}
                style={{ backgroundColor: `hsl(${currentRgb.r}, 100%, 50%)` }}
              />
            </div>
          </div>

          <div className={styles.rgbSection}>
            <label>
              R:
              <input
                type="number"
                min="0"
                max="255"
                value={currentRgb.r}
                onChange={(e) => handleRgbChange(parseInt(e.target.value) || 0, currentRgb.g, currentRgb.b)}
              />
            </label>
            <label>
              G:
              <input
                type="number"
                min="0"
                max="255"
                value={currentRgb.g}
                onChange={(e) => handleRgbChange(currentRgb.r, parseInt(e.target.value) || 0, currentRgb.b)}
              />
            </label>
            <label>
              B:
              <input
                type="number"
                min="0"
                max="255"
                value={currentRgb.b}
                onChange={(e) => handleRgbChange(currentRgb.r, currentRgb.g, parseInt(e.target.value) || 0)}
              />
            </label>
          </div>

          {alpha && (
            <div className={styles.alphaSection}>
              <label>Opacity: {alphaValue}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={alphaValue}
                onChange={(e) => handleAlphaChange(parseInt(e.target.value))}
                className={styles.alphaSlider}
              />
            </div>
          )}

          <div className={styles.presets}>
            {presets.map((preset) => (
              <button
                key={preset}
                className={`${styles.preset} ${color.toLowerCase() === preset.toLowerCase() ? styles.active : ''}`}
                style={{ backgroundColor: preset }}
                onClick={() => {
                  onChange(preset);
                  setHexInput(preset);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
