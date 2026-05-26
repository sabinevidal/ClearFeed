'use client';

import { useState } from 'react';
import type { User, ChildProfile } from '@prisma/client';

type ChildWithProfile = User & { childProfile: ChildProfile | null };

interface ChildProfileCardProps {
  child: ChildWithProfile;
}

export function ChildProfileCard({ child }: ChildProfileCardProps) {
  const profile = child.childProfile;
  const [threshold, setThreshold] = useState(profile?.contentThreshold ?? 5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleThresholdChange(newValue: number) {
    setThreshold(newValue);
    setSaving(true);
    setSaved(false);

    try {
      await fetch(`/api/children/${child.id}/threshold`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: newValue }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Silently fail
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="warm-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-white font-bold">
          {child.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-brand-dark">{child.name}</h3>
          <p className="text-video-meta text-brand-muted">
            Age: {profile?.age ?? '—'}
          </p>
        </div>
      </div>

      {/* Threshold slider */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-video-meta font-medium text-brand-body">
            Content Threshold
          </label>
          <span className="text-video-meta text-brand-muted">
            {threshold}/10
            {saving && ' • Saving...'}
            {saved && ' • Saved ✓'}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={threshold}
          onChange={(e) => handleThresholdChange(Number(e.target.value))}
          className="w-full h-2 bg-cream-200 rounded-full appearance-none cursor-pointer accent-category-attention"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-status-safe">Strict</span>
          <span className="text-[10px] text-category-emotional">Permissive</span>
        </div>
      </div>

      <p className="text-bubble-detail text-brand-muted leading-relaxed">
        Videos with a risk score above {threshold} will require your approval
        before appearing in {child.name}&apos;s library.
      </p>
    </div>
  );
}
