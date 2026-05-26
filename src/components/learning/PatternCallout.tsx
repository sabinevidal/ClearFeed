'use client';

import { useState } from 'react';
import type { VideoPattern, Pattern } from '@prisma/client';

interface PatternCalloutProps {
  videoPattern: VideoPattern & { pattern: Pattern };
  expanded?: boolean;
}

// Map pattern categories to design system colors
function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    attention: '#E8A830',
    emotional: '#E86B4A',
    urgency: '#3B8FE8',
    retention: '#6B5AC7',
    visual: '#2EAAA0',
    audio: '#C75AAF',
  };
  return map[category.toLowerCase()] || '#E8A830';
}

function getCategoryTailwind(category: string): string {
  const map: Record<string, string> = {
    attention: 'bg-category-attention',
    emotional: 'bg-category-emotional',
    urgency: 'bg-category-urgency',
    retention: 'bg-category-retention',
    visual: 'bg-category-visual',
    audio: 'bg-category-audio',
  };
  return map[category.toLowerCase()] || 'bg-category-attention';
}

export function PatternCallout({
  videoPattern,
  expanded: initialExpanded = false,
}: PatternCalloutProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const { pattern } = videoPattern;
  const categoryColor = getCategoryColor(pattern.category);
  const categoryBg = getCategoryTailwind(pattern.category);

  if (!initialExpanded) {
    // Compact bubble card style
    return (
      <button
        onClick={() => setExpanded(!expanded)}
        className="bubble-card w-full text-left relative group"
      >
        {/* Gradient blob behind */}
        <div
          className="gradient-blob -z-10 -top-4 -left-4 opacity-40"
          style={{
            background: `radial-gradient(circle, ${categoryColor}88 0%, ${categoryColor}44 40%, transparent 70%)`,
          }}
        />

        {/* Category pill */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2 h-2 rounded-full ${categoryBg}`} />
          <span className="text-category-pill text-brand-muted">
            {pattern.category}
          </span>
          {videoPattern.timestamp && (
            <span className="text-timeline-label text-brand-muted ml-auto">
              {videoPattern.timestamp}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-bubble-desc text-brand-body leading-relaxed">
          {videoPattern.description || pattern.description}
        </p>

        {/* Expand chevron */}
        <div className="flex justify-center mt-2">
          <i
            className={`fas fa-chevron-down text-[10px] text-brand-muted transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Expanded detail */}
        <div
          className={`overflow-hidden transition-all duration-[350ms] ease-out ${
            expanded ? 'max-h-40 mt-3 pt-3 border-t border-white/30' : 'max-h-0'
          }`}
        >
          <span className="text-spot-label text-brand-muted block mb-1">
            HOW TO SPOT IT
          </span>
          <p className="text-bubble-detail text-brand-detail leading-relaxed">
            {pattern.howToSpot}
          </p>
        </div>
      </button>
    );
  }

  // Full expanded card (used in pattern list below video)
  return (
    <div className="warm-card p-4 relative overflow-hidden">
      {/* Subtle gradient blob */}
      <div
        className="gradient-blob -z-10 -top-6 -right-6 opacity-30"
        style={{
          background: `radial-gradient(circle, ${categoryColor}88 0%, ${categoryColor}44 40%, transparent 70%)`,
        }}
      />

      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-bubble flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${categoryColor}15` }}
        >
          <i
            className={`fas ${pattern.icon} text-sm`}
            style={{ color: categoryColor }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="category-pill" style={{ backgroundColor: `${categoryColor}12`, color: categoryColor }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColor }} />
              {pattern.category}
            </span>
            {videoPattern.timestamp && (
              <span className="text-timeline-label text-brand-muted ml-auto">
                @ {videoPattern.timestamp}
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-brand-dark mt-2">
            {pattern.name}
          </h4>
          <p className="text-bubble-desc text-brand-body mt-1 leading-relaxed">
            {videoPattern.description || pattern.description}
          </p>

          {/* How to spot it tip */}
          <div className="flex items-start gap-2 mt-3 bg-cream-100/60 rounded-bubble px-3 py-2.5">
            <i className="fas fa-lightbulb mt-0.5 text-[10px]" style={{ color: categoryColor }} />
            <div>
              <span className="text-spot-label text-brand-muted block mb-0.5">
                HOW TO SPOT IT
              </span>
              <p className="text-bubble-detail text-brand-detail leading-relaxed">
                {pattern.howToSpot}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
