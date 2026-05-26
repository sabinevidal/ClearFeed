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
      <div className="bg-white rounded-card p-8 border border-brand-border text-center">
        <i className="fas fa-check-circle text-status-safe text-3xl mb-3" />
        <p className="text-sm text-brand-body">
          All caught up! No videos waiting for review.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
      ? 'text-accent-gold'
      : 'text-status-warning';

  return (
    <div className="bg-white rounded-card p-5 border border-brand-border">
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="w-28 h-20 rounded-lg bg-cream-100 overflow-hidden shrink-0">
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
            <h3 className="text-sm font-bold text-brand-dark truncate">
              {video.title}
            </h3>
            <span className={`text-xs font-bold ${riskColor} shrink-0`}>
              {video.riskScore}/10
            </span>
          </div>

          <p className="text-xs text-brand-muted mb-2">
            Submitted by {video.submittedBy.name}
          </p>

          {/* Pattern tags */}
          {video.patterns.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {video.patterns.map((vp) => (
                <span
                  key={vp.id}
                  className="text-[10px] bg-cream-100 text-brand-body px-2 py-0.5 rounded-full"
                >
                  {vp.pattern.name}
                </span>
              ))}
            </div>
          )}

          {/* AI rationale */}
          {video.patterns.length > 0 && (
            <p className="text-xs text-brand-body leading-relaxed line-clamp-2">
              {video.patterns[0].description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={`/analyze?video=${video.id}`}
            className="px-3 py-1.5 border border-brand-border text-xs text-brand-body rounded-lg hover:bg-cream-50 transition-colors text-center"
          >
            Review
          </a>
          <button
            onClick={() => handleAction('APPROVE')}
            disabled={loading}
            className="px-3 py-1.5 bg-status-safe text-white text-xs rounded-lg font-bold hover:bg-status-safe/90 transition-colors disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction('BLOCK')}
            disabled={loading}
            className="px-3 py-1.5 bg-status-warning text-white text-xs rounded-lg font-bold hover:bg-status-warning/90 transition-colors disabled:opacity-50"
          >
            Block
          </button>
        </div>
      </div>
    </div>
  );
}
