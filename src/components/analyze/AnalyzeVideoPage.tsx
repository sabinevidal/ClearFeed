'use client';

import { useState } from 'react';
import { AnalysisResult } from './AnalysisResult';
import type { Video } from '@prisma/client';

interface AnalyzeVideoPageProps {
  pendingVideos: Video[];
  userRole?: string;
}

interface AnalysisData {
  riskScore: number;
  patterns: {
    patternName: string;
    timestamp?: string;
    description: string;
  }[];
  summary: string;
}

export function AnalyzeVideoPage({
  pendingVideos,
  userRole,
}: AnalyzeVideoPageProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(
    null
  );
  const [analyzedVideo, setAnalyzedVideo] = useState<Video | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  async function handleSubmitAndAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    try {
      // First submit the video
      const submitRes = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const submitData = await submitRes.json();

      if (!submitRes.ok && submitRes.status !== 409) {
        setError(submitData.error || 'Failed to submit video');
        return;
      }

      const videoId = submitData.id || submitData.video?.id;
      if (!videoId) {
        setError('Could not get video ID');
        return;
      }

      setAnalyzedVideo(submitData.video || submitData);

      // Then trigger analysis
      const analyzeRes = await fetch(`/api/videos/${videoId}/analyze`, {
        method: 'POST',
      });

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        setError(analyzeData.error || 'Analysis failed');
        return;
      }

      setAnalysisResult(analyzeData);
      setUrl('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyzePending(video: Video) {
    setAnalyzingId(video.id);
    setError('');
    setAnalysisResult(null);
    setAnalyzedVideo(video);

    try {
      const res = await fetch(`/api/videos/${video.id}/analyze`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Analysis failed');
        return;
      }

      setAnalysisResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setAnalyzingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-1">
        Analyze Video
      </h1>
      <p className="text-sm text-brand-body mb-6">
        Submit a video URL for AI-powered manipulation pattern analysis.
      </p>

      {/* URL submission form */}
      <div className="bg-white rounded-card p-5 mb-6">
        <form
          onSubmit={handleSubmitAndAnalyze}
          className="flex items-center gap-3"
        >
          <i className="fas fa-search-plus text-brand-muted" />
          <input
            type="text"
            placeholder="Paste a YouTube URL to analyze…"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            className="flex-1 px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="px-6 py-3 bg-brand-dark text-cream-100 rounded-lg text-sm font-bold hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
        {error && (
          <p className="text-xs text-status-warning mt-2 ml-8">{error}</p>
        )}
      </div>

      {/* Analysis result */}
      {analysisResult && analyzedVideo && (
        <AnalysisResult
          video={analyzedVideo}
          result={analysisResult}
          userRole={userRole}
        />
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-card p-8 text-center mb-6">
          <i className="fas fa-spinner fa-spin text-accent-gold text-2xl mb-3" />
          <p className="text-sm text-brand-body">
            Analyzing video for manipulation patterns...
          </p>
          <p className="text-xs text-brand-muted mt-1">
            This may take a few seconds.
          </p>
        </div>
      )}

      {/* Pending videos queue */}
      {pendingVideos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-brand-dark mb-4">
            Pending Analysis
          </h2>
          <div className="flex flex-col gap-3">
            {pendingVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-card p-4 flex items-center gap-4 border border-brand-border"
              >
                <div className="w-20 h-14 rounded bg-cream-100 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-dark truncate">
                    {video.title}
                  </p>
                  <p className="text-xs text-brand-muted">
                    Submitted{' '}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleAnalyzePending(video)}
                  disabled={analyzingId === video.id}
                  className="px-4 py-2 bg-accent-gold text-white rounded-lg text-xs font-bold hover:bg-accent-gold/90 transition-colors disabled:opacity-50"
                >
                  {analyzingId === video.id ? 'Analyzing...' : 'Analyze Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
