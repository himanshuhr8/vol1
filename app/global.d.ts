// global.d.ts

export {};

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }

  namespace YT {
    enum PlayerState {
      UNSTARTED = -1,
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5,
    }

    interface PlayerOptions {
      height?: string;
      width?: string;
      videoId?: string;
      playerVars?: {
        autoplay?: 0 | 1;
        controls?: 0 | 1;
        modestbranding?: 1;
        fs?: 0 | 1;
        rel?: 0 | 1;
      };
      events?: {
        onReady?: (event: any) => void;
        onStateChange?: (event: any) => void;
      };
    }

    class Player {
      constructor(elementId: string, options: PlayerOptions);
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      mute(): void;
      unMute(): void;
      setVolume(volume: number): void;
      getCurrentTime(): number;
      getDuration(): number;
    }
    interface PlayerEvent {
      target: Player;
    }

    interface OnStateChangeEvent extends PlayerEvent {
      data: PlayerState;
    }
  }
}
