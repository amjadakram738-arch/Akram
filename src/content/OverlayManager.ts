import { DisplaySettings } from '../types/common';

export class OverlayManager {
  private container: HTMLElement;
  private subtitle: HTMLElement;
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };

  constructor() {
    this.container = this.createContainer();
    this.subtitle = this.createSubtitle();
  }

  private createContainer(): HTMLElement {
    const div = document.createElement('div');
    div.id = 'vt-subtitle-container';
    div.className = 'vt-subtitle-container';
    div.style.position = 'fixed';
    div.style.zIndex = '2147483647';
    div.style.pointerEvents = 'none';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.top = '0';
    div.style.left = '0';
    return div;
  }

  private createSubtitle(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'vt-subtitle';
    div.style.position = 'absolute';
    div.style.pointerEvents = 'auto';
    div.style.cursor = 'move';
    div.style.padding = '8px 16px';
    div.style.borderRadius = '4px';
    div.style.textAlign = 'center';
    div.style.transition = 'font-size 0.2s, background-color 0.2s';
    this.container.appendChild(div);
    return div;
  }

  public updateSubtitle(text: string, settings: DisplaySettings): void {
    this.subtitle.textContent = text;
    this.applyStyles(settings);
  }

  private applyStyles(settings: DisplaySettings): void {
    const style = this.subtitle.style;
    style.fontSize = `${settings.fontSize}px`;
    style.color = settings.fontColor;
    style.backgroundColor = `rgba(${this.hexToRgb(settings.backgroundColor)}, ${settings.opacity / 100})`;
    style.fontFamily = settings.fontFamily === 'sans' ? 'sans-serif' : settings.fontFamily === 'serif' ? 'serif' : 'monospace';
    style.borderRadius = `${settings.borderRadius}px`;
    
    if (settings.shadowEnabled) {
      style.textShadow = '1px 1px 2px #000';
    } else {
      style.textShadow = 'none';
    }

    // Position
    if (settings.position === 'top') {
      style.top = '20px';
      style.bottom = 'auto';
      style.left = '50%';
      style.transform = 'translateX(-50%)';
    } else if (settings.position === 'bottom') {
      style.bottom = '40px';
      style.top = 'auto';
      style.left = '50%';
      style.transform = 'translateX(-50%)';
    } else if (settings.position === 'center') {
      style.top = '50%';
      style.bottom = 'auto';
      style.left = '50%';
      style.transform = 'translate(-50%, -50%)';
    }
  }

  private hexToRgb(hex: string): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }

  public makeSubtitleDraggable(): void {
    this.subtitle.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragOffset.x = e.clientX - this.subtitle.offsetLeft;
      this.dragOffset.y = e.clientY - this.subtitle.offsetTop;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.subtitle.style.left = `${e.clientX - this.dragOffset.x}px`;
      this.subtitle.style.top = `${e.clientY - this.dragOffset.y}px`;
      this.subtitle.style.transform = 'none';
      this.subtitle.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  public show(): void {
    this.container.style.display = 'block';
  }

  public hide(): void {
    this.container.style.display = 'none';
  }

  public inject(): void {
    if (!document.getElementById('vt-subtitle-container')) {
      document.body.appendChild(this.container);
      this.makeSubtitleDraggable();
    }
  }
}
