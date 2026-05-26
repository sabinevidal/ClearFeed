'use client';

import { useState } from 'react';
import type { Video, VideoPattern, Pattern } from '@prisma/client';

type VideoWithPatterns = Video & {
  patterns: (VideoPattern & { pattern: Pattern })[];
  submittedBy: { name: string };
};

interface ReviewQueueProps {
  videos: VideoWithPatterns[];
}

export function ReviewQueue({ videos }: ReviewQueueProps) {
  const [localVideos, setLocalVideos] = useState(videos);

  async function handleReview(videoId: string, action: 'APPROVE' | 'BLOCK') {
    try {
      await fetch(`/api/videos/${videoId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      setLocalVideos((prev) => prev.filter((v) => v.id !== videoId));
    } catch {
      // Silently fail
    }
  }

  if (localVideos.length === 0) {
    return (
      <div className="warm-card p-8 text-center">
        <i className="fas fa-check-circle text-status-safe text-3xl mb-3" />
        <p className="text-bubble-desc text-brand-body">
          All caught up! No videos waiting for review.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-bubble-gap">
      {localVideos.map((video) => (
        <ReviewQueueItem
          key={video.id}
          video={video}
          onReview={handleReview}
        />
      ))}
    </div>
  );
}

function ReviewQueueItem({
  video,
  onReview,
}: {
  video: VideoWithPatterns;
  onReview: (id: string, action: 'APPROVE' | 'BLOCK') => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleAction(action: 'APPROVE' | 'BLOCK') {
    setLoading(true);
    await onReview(video.id, action);
  }

  const riskColor =
    (video.riskScore ?? 0) <= 4
      ? 'text-category-attention'
      : 'text-category-emotional';

  return (
    <div className="warm-card p-5">
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="w-28 h-20 rounded-bubble bg-cream-100 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-brand-dark truncate">
              {video.title}
            </h3>
            <span className={`text-video-meta font-semibold ${riskColor} shrink-0`}>
              {video.riskScore}/10
            </span>
          </div>

          <p className="text-video-meta text-brand-muted mb-2">
            Submitted by {video.submittedBy.name}
          </p>

          {/* Pattern tags */}
          {video.patterns.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {video.patterns.map((vp) => (
                <span
                  key={vp.id}
                  className="category-pill bg-cream-100/80 text-brand-body"
                >
                  {vp.pattern.name}
                </span>
              ))}
            </div>
          )}

          {/* AI rationale */}
          {video.patterns.length > 0 && (
            <p className="text-bubble-detail text-brand-body leading-relaxed line-clamp-2">
              {video.patterns[0].description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={`/analyze?video=${video.id}`}
            className="px-3 py-1.5 border border-white/50 text-video-meta text-brand-body rounded-pill hover:bg-cream-100/60 transition-colors text-center"
          >
            Review
          </a>
          <button
            onClick={() => handleAction('APPROVE')}
            disabled={loading}
            className="px-3 py-1.5 bg-status-safe text-white text-video-meta rounded-pill font-semibold hover:bg-status-safe/90 transition-colors disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction('BLOCK')}
            disabled={loading}
            className="px-3 py-1.5 bg-category-emotional text-white text-video-meta rounded-pill font-semibold hover:bg-category-emotional/90 transition-colors disabled:opacity-50"
          >
            Block
          </button>
        </div>
      </div>
    </div>
  );
}
