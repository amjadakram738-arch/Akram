export interface DetectedPlayer {
  id: string;
  type: 'youtube' | 'netflix' | 'vimeo' | 'hulu' | 'disney' | 'amazon' | 'hbomax' | 'generic';
  element: HTMLVideoElement;
  container: HTMLElement;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  url: string;
  title?: string;
}

export class VideoDetector {
  private static players: Map<string, DetectedPlayer> = new Map();
  private static observers: MutationObserver[] = [];

  static detectPlayers(): DetectedPlayer[] {
    this.players.clear();
    this.detectYouTube();
    this.detectNetflix();
    this.detectVimeo();
    this.detectHulu();
    this.detectDisney();
    this.detectAmazon();
    this.detectHBO();
    this.detectGeneric();
    
    return Array.from(this.players.values());
  }

  private static detectYouTube(): void {
    const videos = document.querySelectorAll('video.html5-main-video');
    videos.forEach((video, index) => {
      const container = this.findContainer(video, [
        '.html5-video-player',
        '.ytp-large-play-button',
        '#movie_player',
      ]);
      
      if (container) {
        const player = this.createPlayer(video, container, 'youtube', `youtube-${index}`);
        
        const titleEl = document.querySelector('.title .yt-simple-endpoint, .ytd-video-title');
        if (titleEl) {
          player.title = titleEl.textContent?.trim();
        }

        const url = window.location.href;
        if (url.includes('watch?v=')) {
          const videoId = url.split('v=')[1]?.split('&')[0];
          player.url = `https://www.youtube.com/watch?v=${videoId}`;
        }

        this.players.set(player.id, player);
      }
    });
  }

  private static detectNetflix(): void {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
      const container = this.findContainer(video, [
        '.NFPlayer',
        '.player-wrapper',
        '[data-uia="video-player"]',
      ]);
      
      if (container && (document.domain.includes('netflix') || container.outerHTML.includes('netflix'))) {
        const player = this.createPlayer(video, container, 'netflix', `netflix-${index}`);
        player.url = window.location.href;
        this.players.set(player.id, player);
      }
    });
  }

  private static detectVimeo(): void {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
      const container = this.findContainer(video, [
        '.player',
        '.vp-video-wrapper',
        '[data-player]',
      ]);
      
      if (container) {
        const player = this.createPlayer(video, container, 'vimeo', `vimeo-${index}`);
        const playerData = container.dataset.player;
        player.url = playerData ? `https://vimeo.com/${playerData}` : window.location.href;
        this.players.set(player.id, player);
      }
    });
  }

  private static detectHulu(): void {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
      const container = this.findContainer(video, [
        '.player-container',
        '.video-player',
      ]);
      
      if (container && document.domain.includes('hulu')) {
        const player = this.createPlayer(video, container, 'hulu', `hulu-${index}`);
        player.url = window.location.href;
        this.players.set(player.id, player);
      }
    });
  }

  private static detectDisney(): void {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
      const container = this.findContainer(video, [
        '.player-wrapper',
        '.video-player',
      ]);
      
      if (container && (document.domain.includes('disneyplus') || document.domain.includes('disney'))) {
        const player = this.createPlayer(video, container, 'disney', `disney-${index}`);
        player.url = window.location.href;
        this.players.set(player.id, player);
      }
    });
  }

  private static detectAmazon(): void {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
      const container = this.findContainer(video, [
        '.player-container',
        '.video-player',
        '[data-player]',
      ]);
      
      if (container && document.domain.includes('amazon')) {
        const player = this.createPlayer(video, container, 'amazon', `amazon-${index}`);
        player.url = window.location.href;
        this.players.set(player.id, player);
      }
    });
  }

  private static detectHBO(): void {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
      const container = this.findContainer(video, [
        '.player-wrapper',
        '.video-player',
      ]);
      
      if (container && (document.domain.includes('hbomax') || document.domain.includes('hbo'))) {
        const player = this.createPlayer(video, container, 'hbomax', `hbomax-${index}`);
        player.url = window.location.href;
        this.players.set(player.id, player);
      }
    });
  }

  private static detectGeneric(): void {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
      if (this.players.has(`video-${index}`)) return;

      const container = this.findContainer(video, [
        'video',
        '[class*="player"]',
        '[class*="video"]',
        '[data-video]',
      ]);

      if (container) {
        const player = this.createPlayer(video, container, 'generic', `generic-${index}`);
        player.url = window.location.href;
        this.players.set(player.id, player);
      }
    });
  }

  private static findContainer(video: HTMLVideoElement, selectors: string[]): HTMLElement | null {
    let parent = video.parentElement;
    const maxDepth = 5;

    for (let i = 0; i < maxDepth && parent; i++) {
      for (const selector of selectors) {
        if (parent.matches(selector)) {
          return parent;
        }
      }
      parent = parent.parentElement;
    }

    return video.closest('[class*="player"]') || video.closest('[class*="video"]');
  }

  private static createPlayer(
    video: HTMLVideoElement,
    container: HTMLElement,
    type: DetectedPlayer['type'],
    id: string
  ): DetectedPlayer {
    return {
      id,
      type,
      element: video,
      container,
      isPlaying: !video.paused,
      currentTime: video.currentTime,
      duration: video.duration || 0,
      volume: video.volume,
      url: window.location.href,
    };
  }

  static startMonitoring(callback: (players: DetectedPlayer[]) => void): void {
    const checkPlayers = () => {
      const players = this.detectPlayers();
      if (players.length > 0) {
        callback(players);
      }
    };

    checkPlayers();

    const observer = new MutationObserver(() => {
      checkPlayers();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.observers.push(observer);

    const videoObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const videos = node.querySelectorAll?.('video');
            if (videos?.length > 0) {
              checkPlayers();
            }
            if (node instanceof HTMLVideoElement) {
              checkPlayers();
            }
          }
        });
      });
    });

    videoObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.observers.push(videoObserver);
  }

  static stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  static getPlayer(id: string): DetectedPlayer | undefined {
    return this.players.get(id);
  }

  static getAllPlayers(): DetectedPlayer[] {
    return Array.from(this.players.values());
  }
}
