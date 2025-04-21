"use client";
import TinderCard from "react-tinder-card";
import React, { useState, useEffect } from "react";

export default function SwipePage() {
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    // Example fetch - replace with your Spotify logic
    const exampleTracks = [
      { id: "1", name: "Track 1", preview_url: "...", artist: "Artist 1" },
      { id: "2", name: "Track 2", preview_url: "...", artist: "Artist 2" },
    ];
    setTracks(exampleTracks);
  }, []);

  const onSwipe = (direction: string, trackId: string) => {
    if (direction === "right") {
      // Call API to add to playlist
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      {tracks.map((track) => (
        <TinderCard
          key={track.id}
          onSwipe={(dir: string) => onSwipe(dir, track.id)}
          preventSwipe={["up", "down"]}
        >
          <div className="bg-white p-4 rounded-xl shadow-lg w-[300px] h-[400px] flex flex-col items-center justify-center">
            <p className="text-lg font-bold">{track.name}</p>
            <p className="text-sm">{track.artist}</p>
            <audio controls src={track.preview_url} className="mt-4" />
          </div>
        </TinderCard>
      ))}
    </div>
  );
}