// global.d.ts
export {}; // ensures this file is treated as a module

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }

  namespace YT {
    class Player {
      constructor(
        elementId: string | HTMLElement,
        options: {
          height?: string;
          width?: string;
          videoId: string;
          playerVars?: any;
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
          };
        }
      );
      playVideo(): void;
      pauseVideo(): void;
      mute(): void;
      unMute(): void;
      setVolume(volume: number): void;
      getDuration(): number;
      getCurrentTime(): number;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
    }

    enum PlayerState {
      UNSTARTED = -1,
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5,
    }
  }
}
