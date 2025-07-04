'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SwipeClient = dynamic(() => import('./SwipeClient'), {
  ssr: false,
});

export default function Page() {
  return (
    <div
      className="
        flex 
        flex-col 
        items-center 
        justify-center 
        min-h-screen 
        bg-cover 
        bg-center 
        bg-[url('/bg3.webp')]
        text-white
        p-6
      "
    >
      <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">
        Discover Your Next Favorite Tracks
      </h1>

      <Suspense fallback={<p className="text-xl">Loading swipe UI…</p>}>
        <SwipeClient />
      </Suspense>
      
      <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">
        Swiping Right Adds to Liked Songs, Swiping Left Skips
      </h2>
    </div>
    
  );
}
