'use client';

import type { VideoPattern, Pattern } from '@prisma/client';

interface VideoPlayerProps {
  youtubeId: string;
  patterns: (VideoPattern & { pattern: Pattern })[];
}

export function VideoPlayer({ youtubeId }: VideoPlayerProps) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black">
      {/* YouTube embed */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
