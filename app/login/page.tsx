"use client";
import React from "react";

export default function LoginPage() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;
    const scope = [
      "user-read-private",
      "user-read-email",
      "playlist-modify-public",
      "playlist-modify-private",
      "streaming",
    ].join(" ");

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl"
      >
        Log in with Spotify
      </button>
    </div>
  );
}