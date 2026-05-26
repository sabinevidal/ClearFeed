'use client';

import { useState } from 'react';

interface SubmitVideoFormProps {
  onVideoAdded: (video: any) => void;
}

export function SubmitVideoForm({ onVideoAdded }: SubmitVideoFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit video');
        return;
      }

      setSuccess(`"${data.title}" submitted for analysis!`);
      setUrl('');
      onVideoAdded({ ...data, patterns: [] });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="warm-card p-5 mb-6">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <i className="fas fa-link text-brand-muted" />
        <input
          type="text"
          placeholder="Paste a video link here to request analysis…"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
            setSuccess('');
          }}
          className="flex-1 px-4 py-3 rounded-bubble bg-cream-100/60 border border-white/50 text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-category-attention/30"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="px-6 py-3 bg-brand-dark text-white rounded-pill text-sm font-semibold hover:bg-brand-body transition-colors disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Video'}
        </button>
      </form>

      {error && (
        <p className="text-video-meta text-category-emotional mt-2 ml-8">{error}</p>
      )}
      {success && (
        <p className="text-video-meta text-status-safe mt-2 ml-8">{success}</p>
      )}

      <p className="text-bubble-detail text-brand-muted mt-3 ml-8">
        Our system checks videos for manipulation patterns before adding them to
        your library. If the video needs a parent&apos;s OK, we&apos;ll send a
        request for you!
      </p>
    </div>
  );
}
