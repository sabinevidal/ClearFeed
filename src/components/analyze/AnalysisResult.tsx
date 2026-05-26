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

  const riskColor =
    result.riskScore <= 3
      ? 'text-status-safe'
      : result.riskScore <= 6
        ? 'text-accent-gold'
        : 'text-status-warning';

  const riskBg =
    result.riskScore <= 3
      ? 'bg-status-safe-light'
      : result.riskScore <= 6
        ? 'bg-accent-gold-light'
        : 'bg-status-warning-light';

  return (
    <div className="bg-white rounded-card p-6 mb-6 border border-brand-border">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-24 h-16 rounded bg-cream-100 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-brand-dark">{video.title}</h2>
          <p className="text-xs text-brand-muted mt-1">
            {video.youtubeUrl}
          </p>
        </div>
        <div
          className={`${riskBg} px-4 py-2 rounded-xl flex items-center gap-2`}
        >
          <span className={`text-2xl font-bold ${riskColor}`}>
            {result.riskScore}
          </span>
          <span className="text-xs text-brand-muted">/10</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-cream-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-brand-body leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Detected patterns */}
      {result.patterns.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-brand-dark mb-3">
            Detected Patterns ({result.patterns.length})
          </h3>
          <div className="flex flex-col gap-3">
            {result.patterns.map((pattern, i) => (
              <div
                key={i}
                className="border border-brand-border rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <i className="fas fa-exclamation-triangle text-accent-gold text-xs" />
                  <span className="text-sm font-bold text-brand-dark">
                    {pattern.patternName}
                  </span>
                  {pattern.timestamp && (
                    <span className="text-xs text-brand-muted ml-auto">
                      @ {pattern.timestamp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-body leading-relaxed ml-5">
                  {pattern.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.patterns.length === 0 && (
        <div className="mb-6 text-center py-4">
          <i className="fas fa-check-circle text-status-safe text-2xl mb-2" />
          <p className="text-sm text-brand-body">
            No manipulation patterns detected.
          </p>
        </div>
      )}

      {/* Parent actions */}
      {userRole === 'PARENT' && !reviewDone && (
        <div className="flex gap-3 pt-4 border-t border-brand-border">
          <button
            onClick={() => handleReview('APPROVE')}
            disabled={reviewLoading}
            className="flex-1 py-3 bg-status-safe text-white rounded-lg font-bold text-sm hover:bg-status-safe/90 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-check mr-2" />
            Approve for Library
          </button>
          <button
            onClick={() => handleReview('BLOCK')}
            disabled={reviewLoading}
            className="flex-1 py-3 bg-status-warning text-white rounded-lg font-bold text-sm hover:bg-status-warning/90 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-ban mr-2" />
            Block Video
          </button>
        </div>
      )}

      {reviewDone && (
        <div className="pt-4 border-t border-brand-border text-center">
          <p className="text-sm text-status-safe font-bold">
            <i className="fas fa-check-circle mr-1" />
            Review submitted
          </p>
        </div>
      )}

      {/* Navigation links */}
      <div className="flex gap-4 mt-6 text-xs">
        <a href="/library" className="text-brand-body hover:text-brand-dark">
          ← Back to Approved Library
        </a>
        <a href="/patterns" className="text-brand-body hover:text-brand-dark">
          Learn Why These Patterns Matter
        </a>
        {userRole === 'PARENT' && (
          <a
            href="/dashboard"
            className="text-brand-body hover:text-brand-dark"
          >
            Return to Dashboard
          </a>
        )}
      </div>
    </div>
  );
}
