'use client';

import { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { PatternCallout } from './PatternCallout';
import type { Video, VideoPattern, Pattern } from '@prisma/client';

type VideoWithPatterns = Video & {
  patterns: (VideoPattern & { pattern: Pattern })[];
};

interface LearningModePageProps {
  video: VideoWithPatterns | null;
  recentVideos: VideoWithPatterns[];
}

export function LearningModePage({
  video,
  recentVideos,
}: LearningModePageProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoWithPatterns | null>(
    video
  );

  if (!selectedVideo) {
    return (
      <div className="p-6">
        <h1 className="text-product-name text-brand-dark mb-2">
          Learning Mode
        </h1>
        <p className="text-bubble-desc text-brand-body mb-6">
          Watch videos with educational annotations that highlight manipulation
          patterns in real time.
        </p>

        {recentVideos.length === 0 ? (
          <div className="warm-card p-8 text-center">
            <i className="fas fa-play-circle text-4xl text-cream-300 mb-3" />
            <p className="text-brand-body text-bubble-desc">
              No analyzed videos available yet. Submit a video for analysis
              first!
            </p>
            <a
              href="/analyze"
              className="inline-block mt-4 px-5 py-2.5 bg-brand-dark text-white rounded-pill text-sm font-semibold hover:bg-brand-body transition-colors"
            >
              Analyze a Video
            </a>
          </div>
        ) : (
          <div>
            <h2 className="text-video-title text-brand-dark mb-4">
              Choose a video to study
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-col-gap">
              {recentVideos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVideo(v)}
                  className="warm-card p-4 flex items-center gap-4 hover:scale-[1.02] transition-all text-left"
                >
                  <div className="w-24 h-16 rounded-bubble bg-cream-100 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-dark truncate">
                      {v.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-video-meta text-category-emotional">
                        Risk: {v.riskScore}/10
                      </span>
                      <span className="text-video-meta text-brand-muted">
                        {v.patterns.length} pattern
                        {v.patterns.length !== 1 ? 's' : ''} detected
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Split patterns into left and right columns for visual balance
  const leftPatterns = selectedVideo.patterns.filter((_, i) => i % 2 === 0);
  const rightPatterns = selectedVideo.patterns.filter((_, i) => i % 2 === 1);

  return (
    <div className="p-4">
      {/* Header with detection counter */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setSelectedVideo(null)}
          className="text-brand-muted hover:text-brand-dark transition-colors"
        >
          <i className="fas fa-chevron-left text-sm" />
        </button>
        <h1 className="text-product-name text-brand-dark">Learning Mode</h1>
        <div className="ml-auto detection-pill bg-category-attention/[0.08]">
          <span className="w-[7px] h-[7px] rounded-full bg-category-attention animate-pulse-dot" />
          <span className="text-brand-dark">
            {selectedVideo.patterns.length} patterns detected
          </span>
        </div>
      </div>

      {/* Three-column layout: Left Bubbles — Video — Right Bubbles */}
      <div className="flex gap-col-gap items-start">
        {/* Left bubble column */}
        <div className="w-[260px] shrink-0 flex flex-col gap-bubble-gap justify-center">
          {leftPatterns.map((vp) => (
            <PatternCallout key={vp.id} videoPattern={vp} />
          ))}
        </div>

        {/* Video player (flex center) */}
        <div className="flex-1 min-w-0">
          <VideoPlayer
            youtubeId={selectedVideo.youtubeId}
            patterns={selectedVideo.patterns}
          />

          {/* Detection timeline */}
          <div className="mt-3 h-1.5 bg-cream-200 rounded-full relative overflow-hidden">
            {selectedVideo.patterns.map((vp, i) => {
              const position = ((i + 1) / (selectedVideo.patterns.length + 1)) * 100;
              return (
                <div
                  key={vp.id}
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-colors"
                  style={{
                    left: `${position}%`,
                    backgroundColor: getCategoryColorForPattern(vp.pattern.category),
                  }}
                />
              );
            })}
          </div>

          {/* Score badge below video */}
          {selectedVideo.riskScore !== null && (
            <div className="flex justify-center mt-4">
              <div className="score-badge bg-white/80 backdrop-blur-sm border border-white/50 shadow-bubble">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${getScoreColor(selectedVideo.riskScore)} ${(10 - selectedVideo.riskScore) * 10}%, #e5e5e5 0)`,
                  }}
                >
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <span className="text-sm font-bold text-brand-dark">
                      {10 - selectedVideo.riskScore}0
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-score-badge text-brand-dark">
                    Ages {selectedVideo.riskScore <= 3 ? '7+' : selectedVideo.riskScore <= 6 ? '10+' : '13+'}
                  </span>
                  <span className="text-[11px] text-brand-muted">Content Score</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right bubble column */}
        <div className="w-[260px] shrink-0 flex flex-col gap-bubble-gap justify-center">
          {rightPatterns.map((vp) => (
            <PatternCallout key={vp.id} videoPattern={vp} />
          ))}
        </div>
      </div>

      {/* Pattern summary below */}
      <div className="text-center mt-6 mb-4">
        <p className="text-bubble-desc text-brand-body">
          {selectedVideo.patterns.length} manipulation pattern
          {selectedVideo.patterns.length !== 1 ? 's' : ''} detected in this
          video
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <a
          href="/patterns"
          className="px-6 py-2.5 border-2 border-brand-dark text-brand-dark rounded-pill text-sm font-semibold hover:bg-brand-dark hover:text-white transition-colors"
        >
          Explore Pattern Library
        </a>
        <a
          href="/library"
          className="text-sm text-brand-muted hover:text-brand-dark transition-colors flex items-center"
        >
          ← Back to approved videos
        </a>
      </div>

      {/* Detailed pattern list */}
      <div className="warm-card p-6">
        <h3 className="font-semibold text-brand-dark mb-4">
          Patterns Found in This Video
        </h3>
        <div className="flex flex-col gap-bubble-gap">
          {selectedVideo.patterns.map((vp) => (
            <PatternCallout key={vp.id} videoPattern={vp} expanded />
          ))}
        </div>
      </div>
    </div>
  );
}

function getCategoryColorForPattern(category: string): string {
  const map: Record<string, string> = {
    attention: '#E8A830',
    emotional: '#E86B4A',
    urgency: '#3B8FE8',
    retention: '#6B5AC7',
    visual: '#2EAAA0',
    audio: '#C75AAF',
  };
  return map[category?.toLowerCase()] || '#E8A830';
}

function getScoreColor(riskScore: number): string {
  if (riskScore <= 3) return '#2e7d32';  // green
  if (riskScore <= 6) return '#E8A830';  // amber
  return '#E86B4A';                       // coral
}
