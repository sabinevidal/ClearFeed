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
      <div>
        <h1 className="text-2xl font-bold text-brand-dark mb-2">
          Learning Mode
        </h1>
        <p className="text-sm text-brand-body mb-6">
          Watch videos with educational annotations that highlight manipulation
          patterns in real time.
        </p>

        {recentVideos.length === 0 ? (
          <div className="bg-white rounded-card p-8 text-center">
            <i className="fas fa-play-circle text-4xl text-cream-300 mb-3" />
            <p className="text-brand-body text-sm">
              No analyzed videos available yet. Submit a video for analysis
              first!
            </p>
            <a
              href="/analyze"
              className="inline-block mt-4 px-5 py-2 bg-brand-dark text-cream-100 rounded-lg text-sm font-bold hover:bg-[#2a2a2a] transition-colors"
            >
              Analyze a Video
            </a>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-brand-dark mb-4">
              Choose a video to study
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentVideos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVideo(v)}
                  className="bg-white rounded-card p-4 flex items-center gap-4 border border-brand-border hover:border-accent-gold hover:shadow-sm transition-all text-left"
                >
                  <div className="w-24 h-16 rounded bg-cream-100 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-dark truncate">
                      {v.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-status-warning">
                        Risk: {v.riskScore}/10
                      </span>
                      <span className="text-xs text-brand-muted">
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setSelectedVideo(null)}
          className="text-brand-muted hover:text-brand-dark transition-colors"
        >
          <i className="fas fa-chevron-left text-sm" />
        </button>
        <h1 className="text-2xl font-bold text-brand-dark">Learning Mode</h1>
        <div className="ml-auto">
          <i className="fas fa-search text-brand-muted" />
        </div>
      </div>

      {/* Video player with overlays */}
      <div className="relative mb-6">
        <VideoPlayer
          youtubeId={selectedVideo.youtubeId}
          patterns={selectedVideo.patterns}
        />

        {/* Risk score badge */}
        {selectedVideo.riskScore !== null && (
          <div className="absolute top-4 right-4 bg-white/85 backdrop-blur-sm border border-black/10 rounded-xl px-3 py-1.5">
            <span className="text-xs text-brand-dark">
              Risk Score:{' '}
              <span className="font-bold">
                {selectedVideo.riskScore}/10
              </span>
            </span>
          </div>
        )}

        {/* Pattern callouts around the video */}
        <PatternCallouts patterns={selectedVideo.patterns} />
      </div>

      {/* Pattern summary below video */}
      <div className="text-center mb-4">
        <p className="text-sm text-brand-body">
          {selectedVideo.patterns.length} manipulation pattern
          {selectedVideo.patterns.length !== 1 ? 's' : ''} detected in this
          video
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <a
          href="/patterns"
          className="px-6 py-2.5 border-2 border-brand-dark text-brand-dark rounded-full text-sm font-bold hover:bg-brand-dark hover:text-cream-100 transition-colors"
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
      <div className="bg-white rounded-card p-6 border border-brand-border">
        <h3 className="font-bold text-brand-dark mb-4">
          Patterns Found in This Video
        </h3>
        <div className="flex flex-col gap-4">
          {selectedVideo.patterns.map((vp) => (
            <PatternCallout key={vp.id} videoPattern={vp} expanded />
          ))}
        </div>
      </div>
    </div>
  );
}

function PatternCallouts({
  patterns,
}: {
  patterns: (VideoPattern & { pattern: Pattern })[];
}) {
  if (patterns.length === 0) return null;

  // Position callouts around the video edges
  const positions = [
    'top-4 left-4',
    'top-4 right-48',
    'bottom-20 left-4',
    'bottom-20 right-4',
    'top-1/3 left-4',
    'top-1/3 right-4',
  ];

  return (
    <>
      {patterns.slice(0, 4).map((vp, i) => (
        <div
          key={vp.id}
          className={`absolute ${positions[i]} bg-white/85 backdrop-blur-sm border border-black/10 rounded-xl p-3 max-w-[200px] shadow-sm`}
        >
          <p className="text-xs font-bold text-brand-dark">
            {vp.pattern.name}
          </p>
          <p className="text-[11px] text-brand-body mt-0.5 line-clamp-2">
            {vp.description || vp.pattern.description}
          </p>
        </div>
      ))}
    </>
  );
}
