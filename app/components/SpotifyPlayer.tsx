// app/components/SpotifyPlayer.tsx
'use client';

import ReactSpotifyWebPlayer from 'react-spotify-web-playback';
import type { ComponentProps } from 'react';

// Inherit all props from the underlying player component
type SpotifyWebPlayerProps = ComponentProps<typeof ReactSpotifyWebPlayer>;

export default function SpotifyPlayer(props: SpotifyWebPlayerProps) {
  return (
    <div className="mt-6 w-full max-w-xl">
      <ReactSpotifyWebPlayer {...props} />
    </div>
  );
}
