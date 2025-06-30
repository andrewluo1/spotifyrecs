"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import SpotifyPlayer from "../components/SpotifyPlayer";

type Track = {
  id: string;
  name: string;
  artist: string;
  uri: string;
  image: string;
};

export default function SwipePage() {
  const token = useSearchParams()?.get("access_token")!;
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // fetch real data (or use your demo array)
  useEffect(() => {
    const demo = [
      {
        id: "1",
        name: "Billie Jean",
        artist: "Michael Jackson",
        uri: "spotify:track:5ChkMS8OtdzJeqyybCc9R5",
        image: "https://i.scdn.co/image/ab67616d0000b2731d527804823338ead6195ecc",
      },
      {
        id: "2",
        name: "Blinding Lights",
        artist: "The Weeknd",
        uri: "spotify:track:0VjIjW4GlUZAMYd2vXMi3b",
        image: "https://i.scdn.co/image/ab67616d0000b2733b6ef7f8b0e5d1c5c6a111aa",
      },
    ];
    setTracks(demo);
  }, []);
  // on swipe: if right, save track; then always advance
  const handleSwipe = async (dir: string, track: Track) => {
    if (dir === "right") {
      await fetch(`https://api.spotify.com/v1/me/tracks?ids=${track.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setCurrentIndex((i) => i + 1);
  };

  const current = tracks[currentIndex];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {current ? (
        <TinderCard
        key={current.id}
        onSwipe={(dir) => handleSwipe(dir, currentTrack)}
        preventSwipe={["up", "down"]}
      >
        <div className="bg-white w-80 h-[520px] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <img
            src={current.image}
            alt={current.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {current.name}
              </h2>
              <p className="mt-1 text-gray-600">{current.artist}</p>
            </div>
            <div className="mt-4">
              <SpotifyPlayer
                token={token}
                uri={current.uri}
                play
                showSaveIcon
                styles={{
                  activeColor: "#1db954",
                  bgColor: "#f3f3f3",
                  color: "#000",
                  loaderColor: "#1db954",
                  sliderColor: "#1db954",
                  trackNameColor: "#000",
                  trackArtistColor: "#555",
                  height: 57,
                  sliderHeight: 2,
                  borderRadius: 8,
                }}
                layout="compact"
              />
            </div>
          </div>
        </div>
      </TinderCard>

      ) : (
        <p className="text-white">No more tracks</p>
      )}
    </div>
  );
}
