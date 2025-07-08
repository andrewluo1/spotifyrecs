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
  genre: string;
};

const STATIC_GENRES = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "chill",
    "club",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "forro",
    "french",
    "funk",
    "garage",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indie",
    "indie-pop",
    "industrial",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rainy-day",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trip-hop",
    "work-out",
    "world-music"
  ];

export default function SwipeClient() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('access_token') ?? '';

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const fetchTracks = useCallback(async () => {
    if (!token) return;
    try {
      let genres: string[];
      try {
        const res = await fetch(
          'https://api.spotify.com/v1/recommendations/available-genre-seeds',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error();
        genres = (await res.json()).genres;
      } catch {
        genres = STATIC_GENRES;
      }

      const seed = genres[Math.floor(Math.random() * genres.length)];
      setSelectedGenre(seed);

      let recs: any[] = [];
      const recsRes = await fetch(
        `https://api.spotify.com/v1/recommendations` +
          `?seed_genres=${encodeURIComponent(seed)}` +
          `&limit=20&market=US&max_popularity=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (recsRes.ok) {
        ({ tracks: recs } = await recsRes.json());
      } else {
        console.warn(`Recs failed (${recsRes.status}), falling back to search.`);
        const searchRes = await fetch(
          `https://api.spotify.com/v1/search` +
            `?q=genre:"${encodeURIComponent(seed)}"` +
            `&type=track&limit=50&market=US`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const searchJson = await searchRes.json();
        recs = searchJson.tracks.items
          .filter((t: any) => t.popularity >= 50)
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);
      }

      const batch: Track[] = recs.map((t: any) => ({
        id: t.id,
        name: t.name,
        artist: t.artists[0]?.name ?? 'Unknown',
        uri: t.uri,
        image: t.album.images[0]?.url ?? '',
        genre: seed,
      }));
      setTracks(prev => [...prev, ...batch]);
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
    return <p className="text-white p-4">Please log in to Spotify.</p>;
  if (tracks.length === 0 || currentIndex >= tracks.length)
    return <p className="text-white p-4">Loading tracks…</p>;

  const current = tracks[currentIndex];

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="mb-3 text-black">
        <strong>Current genre:</strong> {current.genre || 'Loading…'}{' '}
        <em>(refresh for new one)</em>
      </div>

      <div className="relative w-80 h-[540px] overflow-hidden">
        <TinderCard
          key={current.id}
          className="absolute inset-0 select-none touch-action-none cursor-grab active:cursor-grabbing"
          onSwipe={d => handleSwipe(d as 'left' | 'right', current)}
          preventSwipe={['up', 'down']}
          swipeRequirementType="position"
          swipeThreshold={80}
        >
          <div className="bg-white w-full h-full rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 flex-1 flex flex-col justify-between">
              <SpotifyPlayer
                token={token}
                uris={[current.uri]}
                autoPlay
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
