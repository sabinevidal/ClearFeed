'use client';

import { useState, useMemo } from 'react';
import { PatternCard } from './PatternCard';
import { PatternDeepDive } from './PatternDeepDive';
import type { Pattern } from '@prisma/client';

interface PatternLibraryProps {
  patterns: Pattern[];
}

const CATEGORIES = [
  'All',
  'Attention Capture',
  'Emotional Manipulation',
  'Social Pressure',
  'Temporal Manipulation',
  'Reward Loops',
  'Cognitive Overload',
  'Authority / Trust Exploitation',
  'FOMO',
];

export function PatternLibrary({ patterns }: PatternLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  const filteredPatterns = useMemo(() => {
    return patterns
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.riskScore - b.riskScore);
  }, [patterns, searchQuery, selectedCategory]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">
            Pattern Library
          </h1>
          <p className="text-brand-body mt-1">
            49 manipulation patterns across 8 categories — learn to spot them all 🧠✨
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-cream-200 text-brand-dark rounded-lg text-sm font-bold hover:bg-cream-300 transition-colors"
            onClick={() => setSelectedPattern(null)}
          >
            Open Annotated Video
          </button>
          <button className="px-4 py-2 bg-brand-dark text-cream-100 rounded-lg text-sm font-bold hover:bg-[#2a2a2a] transition-colors">
            Back to Videos
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3 mt-6 mb-4">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-sm" />
          <input
            type="text"
            placeholder="Search manipulation patterns by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
        </div>
        <button className="px-5 py-3 bg-cream-200 text-brand-body rounded-xl text-sm font-bold hover:bg-cream-300 transition-colors">
          Request Analysis
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-brand-dark text-cream-100'
                : 'bg-cream-100 text-brand-body hover:bg-cream-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Pattern list */}
        <div className="flex-1 flex flex-col gap-3">
          <p className="text-xs text-brand-muted mb-1">
            {filteredPatterns.length} pattern{filteredPatterns.length !== 1 ? 's' : ''} · sorted by risk (low → high)
          </p>
          {filteredPatterns.length === 0 && (
            <p className="text-brand-muted text-sm py-8 text-center">
              No patterns match your search.
            </p>
          )}
          {filteredPatterns.map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              isSelected={selectedPattern?.id === pattern.id}
              onSelect={() => setSelectedPattern(pattern)}
            />
          ))}
        </div>

        {/* Deep dive panel */}
        <div className="w-[440px] shrink-0">
          {selectedPattern ? (
            <PatternDeepDive pattern={selectedPattern} />
          ) : (
            <div className="bg-white border border-brand-border rounded-2xl p-6 text-center">
              <i className="fas fa-hand-pointer text-3xl text-brand-muted mb-3" />
              <p className="text-brand-body text-sm">
                Select a pattern to see a detailed deep dive with psychology
                explanations, age-appropriate descriptions, and detection signals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
