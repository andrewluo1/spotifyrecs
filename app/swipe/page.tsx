// app/swipe/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import TinderCard from 'react-tinder-card';
import SpotifyPlayer from '../components/SpotifyPlayer';

type Track = {
  id: string;
  name: string;
  artist: string;
  uri: string;
  image: string;
};

export default function SwipePage() {
  const token = useSearchParams().get('access_token') ?? '';
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        const offset = Math.floor(Math.random() * 1000);
        const res = await fetch(
          `https://api.spotify.com/v1/search` +
            `?q=${encodeURIComponent(letter)}` +
            `&type=track&limit=10&offset=${offset}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Search ${res.status}: ${body}`);
        }
        const json = await res.json();
        setTracks(
          json.tracks.items.map((t: any) => ({
            id: t.id,
            name: t.name,
            artist: t.artists[0]?.name ?? 'Unknown',
            uri: t.uri,
            image: t.album.images[0]?.url ?? '',
          }))
        );
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      }
    })();
  }, [token]);

  const handleSwipe = useCallback(
    async (dir: 'left' | 'right', track: Track) => {
      if (dir === 'right') {
        try {
          await fetch(`https://api.spotify.com/v1/me/tracks?ids=${track.id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          console.error('Save failed', e);
        }
      }
      setCurrentIndex(i => i + 1);
    },
    [token]
  );

  if (error)
    return <p className="text-red-400 p-4">Error loading tracks: {error}</p>;
  if (!token)
    return (
      <p className="text-white p-4">
        No access token—please log in first.
      </p>
    );
  if (tracks.length === 0)
    return <p className="text-white p-4">Loading tracks…</p>;

  const current = tracks[currentIndex];

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="relative w-80 h-[520px]">
        {current && (
          <TinderCard
            key={current.id}
            className="absolute inset-0"
            onSwipe={d => handleSwipe(d as 'left' | 'right', current)}
            preventSwipe={['up', 'down']}
            swipeRequirementType='position'
            swipeThreshold={80}
          >
            <div className="bg-white w-full h-full rounded-2xl shadow-xl overflow-hidden flex flex-col">
              <div className="flex-1 flex flex-col justify-between p-4">
                <SpotifyPlayer
                  token={token}
                  uri={current.uri}
                  play
                  showSaveIcon
                  hideCoverArt={true}
                  layout="compact"
                />
              </div>
            </div>
          </TinderCard>
        )}
      </div>
    </div>
  );
}
