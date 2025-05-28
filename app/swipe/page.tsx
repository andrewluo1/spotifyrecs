"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import WebPlayback from "../components/WebPlayback";


export default function SwipePage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("access_token");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load tracks once
  useEffect(() => {
    if (!token) return;
    console.log("Token in swipe page:", token);

    fetch("https://api.spotify.com/v1/me/top/tracks?limit=20", {
    headers: { Authorization: `Bearer ${token}` },
    })
  .then(res => res.json())
  .then(data => {
    console.log("Spotify API response:", data);

    if (data.items) {
      const formatted = data.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        uri: track.uri,
        image: track.album.images[0].url,
      }));
      setTracks(formatted);
    } else {
      console.error("No tracks in response:", data);
    }
  });

    fetch("https://api.spotify.com/v1/me/top/tracks?limit=20", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const formatted = data.items.map((track: any) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          uri: track.uri,
          image: track.album.images[0].url,
        }));
        setTracks(formatted);
      });
  }, [token]);

  // Swipe handler
  const handleSwipe = async (dir: string) => {
    const track = tracks[currentIndex];
    if (dir === "right" && track && deviceId && token) {
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: [track.uri] }),
        }
      );
    }
    // Show next track
    setCurrentIndex((prev) => prev + 1);
  };

  const currentTrack = tracks[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <WebPlayback token={token!} onReady={setDeviceId} />

      {currentTrack ? (
        <TinderCard
          key={currentTrack.id}
          onSwipe={handleSwipe}
          preventSwipe={["up", "down"]}
        >
          <div className="bg-white text-black p-6 w-[300px] h-[400px] rounded-xl shadow-lg flex flex-col items-center justify-between">
            <img
              src={currentTrack.image}
              alt="Album Art"
              className="w-full h-48 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-lg font-bold">{currentTrack.name}</h2>
              <p className="text-sm">{currentTrack.artist}</p>
            </div>
          </div>
        </TinderCard>
      ) : (
        <p className="text-gray-400 mt-8">No more tracks</p>
      )}
    </div>
  );
}
