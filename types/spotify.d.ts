export {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: Spotify.PlayerInit) => Spotify.Player;
    };
  }

  namespace Spotify {
    interface PlayerInit {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }

    interface ReadyState {
      device_id: string;
    }

    interface Player {
      connect(): Promise<boolean>;
      addListener(
        event:
          | "ready"
          | "not_ready"
          | "player_state_changed"
          | "initialization_error"
          | "authentication_error"
          | "account_error",
        cb: (data: any) => void
      ): boolean;
    }
  }
}
