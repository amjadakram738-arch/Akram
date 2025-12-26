export class OverlayManager {
  private container: HTMLElement | null = null;
  private subtitleContainer: HTMLElement | null = null;
  private isVisible: boolean = false;
  private settings: any = null;
  private currentPosition: { x: number; y: number } = { x: 0, y: 0 };
  private isDragging: boolean = false;
  private dragOffset: { x: number; y: number } = { x: 0, y: 0 };
  private animationFrameId: number | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.createContainer();
    this.setupEventListeners();
    this.loadSettings();
  }

  private createContainer(): void {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = 'video-translator-overlay';
    this.container.innerHTML = `
      <style>
        #video-translator-overlay {
          position: fixed;
          z-index: 999999;
          pointer-events: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #video-translator-subtitles {
          position: absolute;
          padding: 8px 16px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.85);
          color: #FFFFFF;
          font-size: 16px;
          line-height: 1.5;
          text-align: center;
          max-width: 80%;
          pointer-events: auto;
          cursor: move;
          transition: opacity 0.2s, transform 0.2s;
          user-select: none;
        }
        
        #video-translator-subtitles.dragging {
          opacity: 0.9;
          transform: scale(1.02);
        }
        
        #video-translator-subtitles.cinematic {
          font-size: 24px;
          font-weight: 600;
          padding: 16px 32px;
          border-radius: 8px;
        }
        
        #video-translator-subtitles.educational {
          background: rgba(0, 0, 0, 0.9);
          border-left: 4px solid #4A90E2;
        }
        
        #video-translator-subtitles.interactive {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #4A90E2;
        }
        
        .vt-controls {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 6px;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: auto;
        }
        
        #video-translator-subtitles:hover .vt-controls {
          opacity: 1;
        }
        
        .vt-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          transition: background 0.2s;
        }
        
        .vt-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .vt-btn.active {
          background: #4A90E2;
        }
      </style>
      
      <div id="video-translator-subtitles" style="display: none;">
        <div class="vt-controls">
          <button class="vt-btn" data-action="hide" title="Hide (Esc)">✕</button>
          <button class="vt-btn" data-action="copy" title="Copy">📋</button>
          <button class="vt-btn" data-action="settings" title="Settings">⚙️</button>
        </div>
        <span id="vt-subtitle-text"></span>
      </div>
    `;

    document.documentElement.appendChild(this.container);
    this.subtitleContainer = document.getElementById('video-translator-subtitles');
    
    if (this.subtitleContainer) {
      this.subtitleContainer.addEventListener('mousedown', this.handleDragStart.bind(this));
      
      this.subtitleContainer.querySelectorAll('.vt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = (e.target as HTMLElement).dataset.action;
          this.handleControlClick(action);
        });
      });
    }
  }

  private setupEventListeners(): void {
    document.addEventListener('mousemove', this.handleDragMove.bind(this));
    document.addEventListener('mouseup', this.handleDragEnd.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'UPDATE_SUBTITLE') {
        this.updateSubtitle(message.text, message.translatedText, message.settings);
      } else if (message.type === 'SHOW_OVERLAY') {
        this.show();
      } else if (message.type === 'HIDE_OVERLAY') {
        this.hide();
      } else if (message.type === 'UPDATE_SETTINGS') {
        this.updateSettings(message.settings);
      } else if (message.type === 'SET_POSITION') {
        this.setPosition(message.x, message.y);
      }
    });

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private async loadSettings(): Promise<void> {
    try {
      const stored = await chrome.storage.sync.get('displaySettings');
      this.settings = stored.displaySettings || {
        fontSize: 16,
        fontFamily: 'sans',
        fontColor: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0.85)',
        opacity: 100,
        position: 'bottom',
        displayMode: 'simple',
        shadowEnabled: true,
      };
      this.applySettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  private applySettings(): void {
    if (!this.subtitleContainer || !this.settings) return;

    const textEl = this.subtitleContainer.querySelector('#vt-subtitle-text');
    if (textEl) {
      textEl.textContent = this.subtitleContainer.dataset.original || '';
    }

    this.subtitleContainer.style.fontSize = `${this.settings.fontSize || 16}px`;
    this.subtitleContainer.style.fontFamily = this.settings.fontFamily || 'sans-serif';
    this.subtitleContainer.style.color = this.settings.fontColor || '#FFFFFF';
    this.subtitleContainer.style.backgroundColor = this.settings.backgroundColor || 'rgba(0,0,0,0.85)';
    this.subtitleContainer.style.opacity = `${(this.settings.opacity || 100) / 100}`;
    this.subtitleContainer.style.textShadow = this.settings.shadowEnabled !== false ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none';
    this.subtitleContainer.style.textAlign = this.settings.textAlign || 'center';

    this.subtitleContainer.classList.remove('cinematic', 'educational', 'interactive');
    if (this.settings.displayMode === 'cinematic') {
      this.subtitleContainer.classList.add('cinematic');
    } else if (this.settings.displayMode === 'educational') {
      this.subtitleContainer.classList.add('educational');
    } else if (this.settings.displayMode === 'interactive') {
      this.subtitleContainer.classList.add('interactive');
    }

    const opacity = (this.settings.opacity || 100) / 100;
    this.subtitleContainer.style.opacity = String(opacity);

    if (this.settings.position && this.settings.position !== 'custom') {
      this.positionToEdge(this.settings.position);
    }
  }

  private positionToEdge(position: string): void {
    if (!this.subtitleContainer) return;

    const padding = 20;
    const containerHeight = this.subtitleContainer.offsetHeight || 50;

    switch (position) {
      case 'top':
        this.currentPosition = { x: 50, y: padding };
        break;
      case 'bottom':
        this.currentPosition = { x: 50, y: window.innerHeight - containerHeight - padding };
        break;
      case 'center':
        this.currentPosition = { x: 50, y: (window.innerHeight - containerHeight) / 2 };
        break;
      default:
        this.currentPosition = { x: 50, y: window.innerHeight - containerHeight - padding };
    }

    this.updatePosition();
  }

  private updatePosition(): void {
    if (!this.subtitleContainer) return;

    const x = this.currentPosition.x;
    const y = this.currentPosition.y;

    if (typeof x === 'number') {
      this.subtitleContainer.style.left = `${x}px`;
      this.subtitleContainer.style.transform = 'translateX(-50%)';
    } else {
      this.subtitleContainer.style.left = x;
      this.subtitleContainer.style.transform = 'none';
    }
    this.subtitleContainer.style.top = `${y}px`;
  }

  private handleDragStart(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('vt-btn')) return;
    
    this.isDragging = true;
    this.subtitleContainer?.classList.add('dragging');
    
    const rect = this.subtitleContainer?.getBoundingClientRect();
    if (rect) {
      this.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    
    e.preventDefault();
  }

  private handleDragMove(e: MouseEvent): void {
    if (!this.isDragging || !this.subtitleContainer) return;

    this.currentPosition = {
      x: e.clientX - this.dragOffset.x + (this.subtitleContainer.offsetWidth / 2),
      y: e.clientY - this.dragOffset.y,
    };

    this.updatePosition();
  }

  private handleDragEnd(): void {
    this.isDragging = false;
    this.subtitleContainer?.classList.remove('dragging');
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.hide();
    } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.toggle();
    }
  }

  private handleResize(): void {
    if (this.settings?.position && this.settings.position !== 'custom') {
      this.positionToEdge(this.settings.position);
    }
  }

  private handleControlClick(action: string | undefined): void {
    switch (action) {
      case 'hide':
        this.hide();
        break;
      case 'copy':
        const text = this.subtitleContainer?.querySelector('#vt-subtitle-text')?.textContent;
        if (text) {
          navigator.clipboard.writeText(text);
        }
        break;
      case 'settings':
        chrome.runtime.openOptionsPage();
        break;
    }
  }

  public inject(): void {
    this.createContainer();
  }

  public show(): void {
    if (!this.subtitleContainer) return;
    this.subtitleContainer.style.display = 'block';
    this.isVisible = true;
  }

  public hide(): void {
    if (!this.subtitleContainer) return;
    this.subtitleContainer.style.display = 'none';
    this.isVisible = false;
  }

  public toggle(): void {
    this.isVisible ? this.hide() : this.show();
  }

  public updateSubtitle(original: string, translated: string, settings?: any): void {
    if (!this.subtitleContainer) return;

    const textEl = this.subtitleContainer.querySelector('#vt-subtitle-text');
    if (textEl) {
      const displayText = translated || original;
      textEl.textContent = displayText;
      this.subtitleContainer.dataset.original = original;
    }

    if (settings) {
      this.settings = { ...this.settings, ...settings };
      this.applySettings();
    }

    if (!this.isVisible) {
      this.show();
    }
  }

  public updateSettings(settings: any): void {
    this.settings = { ...this.settings, ...settings };
    this.applySettings();
  }

  public setPosition(x: number, y: number): void {
    this.currentPosition = { x, y };
    this.updatePosition();
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    document.removeEventListener('mousemove', this.handleDragMove.bind(this));
    document.removeEventListener('mouseup', this.handleDragEnd.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    this.container?.remove();
    this.container = null;
    this.subtitleContainer = null;
  }
}

let overlayManager: OverlayManager | null = null;

export const getOverlayManager = (): OverlayManager => {
  if (!overlayManager) {
    overlayManager = new OverlayManager();
  }
  return overlayManager;
};
