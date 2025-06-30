"use client";

export default function LoginPage() {
  const handleLogin = () => {
    const scopes = [
      "user-read-email",
      "user-read-private",
      "playlist-modify-public",
      "playlist-modify-private",
      "streaming",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-library-read",
      "user-library-modify",
    ].join(" ");

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
      response_type: "code",
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!, 
      scope: scopes,
      show_dialog: "true",
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={handleLogin} className="bg-green-600 text-white px-6 py-3 rounded-lg">
        Log in with Spotify
      </button>
    </div>
  );
}
