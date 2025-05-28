"use client";
import { useEffect } from "react";

type Props = {
  token: string;
  onReady: (deviceId: string) => void;
};

export default function WebPlayback({ token, onReady }: Props) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Swipe Player",
        getOAuthToken: (cb: (token: string) => void) => cb(token),
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("✅ Device ready:", device_id);
        onReady(device_id);
      });

      player.connect();
    };
  }, [token, onReady]);

  return null;
}
