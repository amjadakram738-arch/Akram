export interface VideoPlayer {
  type: string;
  element: HTMLVideoElement | HTMLIFrameElement | null;
  getAudio?: () => any;
}

export class VideoDetector {
  static detectPlayers(): VideoPlayer[] {
    const players: VideoPlayer[] = [];

    // HTML5 Video
    document.querySelectorAll('video').forEach((video) => {
      players.push({
        type: 'html5',
        element: video,
      });
    });

    // YouTube
    if (this.isYouTube()) {
      const ytVideo = document.querySelector('video');
      if (ytVideo) {
        players.push({
          type: 'youtube',
          element: ytVideo,
        });
      }
    }

    // Generic iframe detection
    document.querySelectorAll('iframe').forEach((iframe) => {
      players.push({
        type: 'iframe',
        element: iframe,
      });
    });

    return players;
  }

  private static isYouTube(): boolean {
    return /youtube\.com|youtu\.be/.test(window.location.hostname);
  }

  private static isVimeo(): boolean {
    return /vimeo\.com/.test(window.location.hostname);
  }

  private static isNetflix(): boolean {
    return /netflix\.com/.test(window.location.hostname);
  }
}
