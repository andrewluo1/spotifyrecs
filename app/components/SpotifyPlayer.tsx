"use client";

import SpotifyPlayer from "react-spotify-web-playback";

type Props = {
  token: string;
  uri: string;
};

export default function SpotifyPlayback({ token, uri }: Props) {
  return (
    <div className="mt-6 w-full max-w-xl">
      <SpotifyPlayer
        token={token}
        uris={[uri]}
        autoPlay={true}
        showSaveIcon
        styles={{
          activeColor: "#fff",
          bgColor: "#121212",
          color: "#fff",
          loaderColor: "#1db954",
          sliderColor: "#1db954",
          trackArtistColor: "#ccc",
          trackNameColor: "#fff",
          height: 60,        
        }}
        layout="compact"
      />
    </div>
  );
}
