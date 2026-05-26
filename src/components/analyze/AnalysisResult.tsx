'use client';

import { useState } from 'react';
import type { Video } from '@prisma/client';

interface PatternDetection {
  patternName: string;
  timestamp?: string;
  description: string;
}

interface AnalysisResultProps {
  video: Video;
  result: {
    riskScore: number;
    patterns: PatternDetection[];
    summary: string;
  };
  userRole?: string;
}

function getCategoryColor(patternName: string): string {
  const name = patternName.toLowerCase();
  if (name.includes('attention') || name.includes('hook')) return '#E8A830';
  if (name.includes('emotion') || name.includes('facial')) return '#E86B4A';
  if (name.includes('urgency') || name.includes('countdown')) return '#3B8FE8';
  if (name.includes('retention') || name.includes('loop')) return '#6B5AC7';
  if (name.includes('visual') || name.includes('before')) return '#2EAAA0';
  if (name.includes('audio') || name.includes('music')) return '#C75AAF';
  return '#E8A830';
}

export function AnalysisResult({
  video,
  result,
  userRole,
}: AnalysisResultProps) {
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  async function handleReview(action: 'APPROVE' | 'BLOCK') {
    setReviewLoading(true);
    try {
      await fetch(`/api/videos/${video.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      setReviewDone(true);
    } catch {
      // Silently fail for now
    } finally {
      setReviewLoading(false);
    }
  }

  const scoreColor =
    result.riskScore <= 3
      ? '#2e7d32'
      : result.riskScore <= 6
        ? '#E8A830'
        : '#E86B4A';

  return (
    <div className="warm-card p-6 mb-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-24 h-16 rounded-bubble bg-cream-100 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-brand-dark">{video.title}</h2>
          <p className="text-video-meta text-brand-muted mt-1">
            {video.youtubeUrl}
          </p>
        </div>
        {/* Score badge */}
        <div className="score-badge shadow-bubble" style={{ backgroundColor: `${scoreColor}10` }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(${scoreColor} ${(10 - result.riskScore) * 10}%, #e5e5e5 0)`,
            }}
          >
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: scoreColor }}>
                {result.riskScore}
              </span>
            </div>
          </div>
          <span className="text-video-meta text-brand-muted">/10 risk</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-cream-100/60 rounded-bubble p-4 mb-6">
        <p className="text-bubble-desc text-brand-body leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Detected patterns */}
      {result.patterns.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-brand-dark">
              Detected Patterns
            </h3>
            <span className="detection-pill bg-category-attention/[0.08] text-brand-dark">
              {result.patterns.length}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {result.patterns.map((pattern, i) => {
              const color = getCategoryColor(pattern.patternName);
              return (
                <div
                  key={i}
                  className="bubble-card relative overflow-hidden"
                >
                  {/* Gradient blob */}
                  <div
                    className="gradient-blob -z-10 -top-4 -left-4 opacity-25"
                    style={{
                      background: `radial-gradient(circle, ${color}88 0%, ${color}44 40%, transparent 70%)`,
                      width: '100px',
                      height: '100px',
                    }}
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-semibold text-brand-dark">
                      {pattern.patternName}
                    </span>
                    {pattern.timestamp && (
                      <span className="text-timeline-label text-brand-muted ml-auto">
                        @ {pattern.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-bubble-detail text-brand-body leading-relaxed ml-4">
                    {pattern.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result.patterns.length === 0 && (
        <div className="mb-6 text-center py-4">
          <i className="fas fa-check-circle text-status-safe text-2xl mb-2" />
          <p className="text-bubble-desc text-brand-body">
            No manipulation patterns detected.
          </p>
        </div>
      )}

      {/* Parent actions */}
      {userRole === 'PARENT' && !reviewDone && (
        <div className="flex gap-3 pt-4 border-t border-white/30">
          <button
            onClick={() => handleReview('APPROVE')}
            disabled={reviewLoading}
            className="flex-1 py-3 bg-status-safe text-white rounded-pill font-semibold text-sm hover:bg-status-safe/90 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-check mr-2" />
            Approve for Library
          </button>
          <button
            onClick={() => handleReview('BLOCK')}
            disabled={reviewLoading}
            className="flex-1 py-3 bg-category-emotional text-white rounded-pill font-semibold text-sm hover:bg-category-emotional/90 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-ban mr-2" />
            Block Video
          </button>
        </div>
      )}

      {reviewDone && (
        <div className="pt-4 border-t border-white/30 text-center">
          <p className="text-sm text-status-safe font-semibold">
            <i className="fas fa-check-circle mr-1" />
            Review submitted
          </p>
        </div>
      )}

      {/* Navigation links */}
      <div className="flex gap-4 mt-6 text-video-meta">
        <a href="/library" className="text-brand-body hover:text-brand-dark transition-colors">
          ← Back to Approved Library
        </a>
        <a href="/patterns" className="text-brand-body hover:text-brand-dark transition-colors">
          Learn Why These Patterns Matter
        </a>
        {userRole === 'PARENT' && (
          <a
            href="/dashboard"
            className="text-brand-body hover:text-brand-dark transition-colors"
          >
            Return to Dashboard
          </a>
        )}
      </div>
    </div>
  );
}
