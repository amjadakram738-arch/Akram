import React, { useState, useRef, useEffect } from 'react';
import styles from './Slider.module.css';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  unit?: string;
  className?: string;
  disabled?: boolean;
  marks?: { value: number; label: string }[];
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  showValue = false,
  unit = '',
  className = '',
  disabled = false,
  marks,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (disabled || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = Math.round((newPercentage / 100) * (max - min) / step) * step + min;

    onChange(Math.max(min, Math.min(max, newValue)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        updateValue(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, min, max, step]);

  return (
    <div className={`${styles.container} ${className} ${disabled ? styles.disabled : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.sliderWrapper}>
        <div
          ref={trackRef}
          className={styles.track}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className={styles.trackBackground} />
          <div
            className={styles.trackProgress}
            style={{ width: `${percentage}%` }}
          />
          <div
            className={`${styles.thumb} ${isDragging ? styles.dragging : ''}`}
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>

      {marks && (
        <div className={styles.marks}>
          {marks.map((mark) => (
            <div
              key={mark.value}
              className={styles.mark}
              style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
            >
              <div className={styles.markTick} />
              <span className={styles.markLabel}>{mark.label}</span>
            </div>
          ))}
        </div>
      )}

      {(showValue || unit) && (
        <div className={styles.valueDisplay}>
          <span className={styles.value}>{value}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
      )}
    </div>
  );
};

interface RangeSliderProps {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  className?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  values,
  onChange,
  className = '',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (index: 0 | 1) => (e: React.MouseEvent) => {
    const updatePosition = (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const newValue = Math.round((percentage / 100) * (max - min)) + min;

      if (index === 0) {
        onChange([Math.min(newValue, values[1] - 1), values[1]]);
      } else {
        onChange([values[0], Math.max(newValue, values[0] + 1)]);
      }
    };

    const handleMove = (e: MouseEvent) => updatePosition(e.clientX);
    const handleEnd = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
  };

  const leftPercentage = ((values[0] - min) / (max - min)) * 100;
  const rightPercentage = ((values[1] - min) / (max - min)) * 100;

  return (
    <div className={`${styles.container} ${styles.rangeContainer} ${className}`}>
      <div
        ref={trackRef}
        className={`${styles.track} ${styles.rangeTrack}`}
      >
        <div className={styles.trackBackground} />
        <div
          className={styles.rangeProgress}
          style={{ left: `${leftPercentage}%`, right: `${100 - rightPercentage}%` }}
        />
        <div
          className={styles.thumb}
          style={{ left: `${leftPercentage}%` }}
          onMouseDown={handleMouseDown(0)}
        />
        <div
          className={styles.thumb}
          style={{ left: `${rightPercentage}%` }}
          onMouseDown={handleMouseDown(1)}
        />
      </div>
      <div className={styles.rangeValues}>
        <span>{values[0]}</span>
        <span>{values[1]}</span>
      </div>
    </div>
  );
};
