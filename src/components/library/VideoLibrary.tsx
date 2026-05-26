'use client';

import { useState } from 'react';
import { VideoCard } from './VideoCard';
import { SubmitVideoForm } from './SubmitVideoForm';
import type { Video, VideoPattern, Pattern } from '@prisma/client';

type VideoWithPatterns = Video & {
  patterns: (VideoPattern & { pattern: Pattern })[];
};

interface VideoLibraryProps {
  videos: VideoWithPatterns[];
  userRole?: string;
}

type CategoryFilter = 'recent' | 'educational' | 'all';

export function VideoLibrary({ videos, userRole }: VideoLibraryProps) {
  const [category, setCategory] = useState<CategoryFilter>('recent');
  const [localVideos, setLocalVideos] = useState(videos);

  const filteredVideos = localVideos.filter((video) => {
    if (category === 'educational') return video.category === 'Educational';
    if (category === 'recent') return true; // Show all, sorted by date
    return true;
  });

  function handleVideoAdded(video: VideoWithPatterns) {
    setLocalVideos((prev) => [video, ...prev]);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-1">
        Your Video Library
      </h1>
      <p className="text-sm text-brand-body mb-6">
        Browse your curated, ad-free library of approved videos. No tricks, no
        traps — just great content.
      </p>

      <SubmitVideoForm onVideoAdded={handleVideoAdded} />

      {/* Category filters */}
      <div className="flex gap-2 mb-6">
        <CategoryButton
          label="Recently Added"
          active={category === 'recent'}
          onClick={() => setCategory('recent')}
        />
        <CategoryButton
          label="Educational"
          active={category === 'educational'}
          onClick={() => setCategory('educational')}
        />
        <CategoryButton
          label="All Videos"
          active={category === 'all'}
          onClick={() => setCategory('all')}
        />
      </div>

      {/* Video grid */}
      {filteredVideos.length === 0 ? (
        <EmptyState userRole={userRole} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} userRole={userRole} />
          ))}
        </div>
      )}

      {/* Info banner */}
      <div className="mt-8 bg-cream-50 border border-cream-300 rounded-2xl p-5 flex items-center gap-4">
        <i className="fas fa-lightbulb text-accent-gold text-lg" />
        <div className="flex-1">
          <p className="text-sm font-bold text-brand-dark">
            Want to learn what these scores mean?
          </p>
          <p className="text-xs text-brand-body mt-0.5">
            Explore our Pattern Library to discover the tricks videos use — and
            how you can spot them yourself!
          </p>
        </div>
        <a
          href="/patterns"
          className="text-sm text-cream-100 bg-brand-dark px-4 py-2 rounded-lg font-bold hover:bg-[#2a2a2a] transition-colors whitespace-nowrap"
        >
          Explore Patterns
        </a>
      </div>
    </div>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
        active
          ? 'bg-brand-dark text-cream-100'
          : 'bg-cream-200 text-brand-body hover:bg-cream-300'
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState({ userRole }: { userRole?: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-card overflow-hidden border border-brand-border">
        <div className="h-48 bg-cream-100 flex items-center justify-center">
          <i className="fas fa-film text-4xl text-cream-300" />
        </div>
        <div className="p-4">
          <p className="text-xs text-brand-muted mb-1">No videos yet</p>
          <p className="font-bold text-sm text-brand-dark mb-1">
            {userRole === 'CHILD'
              ? 'Paste a YouTube link above to get started!'
              : 'Submit videos for analysis or approve pending ones.'}
          </p>
        </div>
      </div>
    </div>
  );
}
