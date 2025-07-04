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

export default function SwipeClient() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('access_token') ?? '';

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
  if (!token) return;
  try {
    const len = Math.random() < 0.5 ? 2 : 3;
    const query = Array.from({ length: len }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join('');

    const limit = 50;
    const maxOffset = 1000 - limit;               
    const offset = Math.floor(Math.random() * (maxOffset + 5));

    const res = await fetch(
      `https://api.spotify.com/v1/search` +
        `?q=${encodeURIComponent(query)}` +
        `&type=track&limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(await res.text());

    const {
      tracks: { items },
    } = await res.json();

    const filtered = items.filter((t: any) => t.popularity >= 30 && t.popularity <= 75);

    const batch = filtered
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        artist: t.artists[0]?.name ?? 'Unknown',
        uri: t.uri,
        image: t.album.images[0]?.url ?? '',
      }));

    setTracks((prev) => [...prev, ...batch]);
  } catch (e: any) {
    console.error('fetchTracks error', e);
    setError(e.message);
  }
}, [token]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    if (tracks.length > 0 && currentIndex >= tracks.length - 3) {
      fetchTracks();
    }
  }, [currentIndex, tracks.length, fetchTracks]);

  const handleSwipe = useCallback(
    async (dir: 'left' | 'right', track: Track) => {
      if (dir === 'right') {
        await fetch(`https://api.spotify.com/v1/me/tracks?ids=${track.id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(console.error);
      }
      setCurrentIndex(i => i + 1);
    },
    [token]
  );

  if (error)
    return <p className="text-red-400 p-4">Error: {error}</p>;
  if (!token)
    return <p className="text-white p-4">Please log in.</p>;
  if (tracks.length === 0 || currentIndex >= tracks.length)
    return <p className="text-white p-4">Loading tracks…</p>;

  const current = tracks[currentIndex];

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="relative w-80 h-[520px] overflow-hidden">
        <TinderCard
          key={current.id}
          className="absolute inset-0 select-none touch-action-none cursor-grab active:cursor-grabbing"
          onSwipe={d => handleSwipe(d as 'left' | 'right', current)}
          preventSwipe={['up', 'down']}
          swipeRequirementType="position"
          swipeThreshold={80}
        >
          <div className="bg-white w-full h-full rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col justify-between p-4">
              <SpotifyPlayer  
                token={token}
                uris={[current.uri]}
                autoPlay={true}
                showSaveIcon
                hideCoverArt={false}
                layout="compact"
              />
            </div>
          </div>
        </TinderCard>
      </div>
    </div>
  );
}
