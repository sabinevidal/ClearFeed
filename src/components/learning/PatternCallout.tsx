import type { VideoPattern, Pattern } from '@prisma/client';

interface PatternCalloutProps {
  videoPattern: VideoPattern & { pattern: Pattern };
  expanded?: boolean;
}

export function PatternCallout({
  videoPattern,
  expanded = false,
}: PatternCalloutProps) {
  const { pattern } = videoPattern;

  if (!expanded) {
    return (
      <div className="bg-white/85 backdrop-blur-sm border border-black/10 rounded-xl p-3">
        <p className="text-xs font-bold text-brand-dark">{pattern.name}</p>
        <p className="text-[11px] text-brand-body mt-0.5 line-clamp-2">
          {videoPattern.description || pattern.description}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-brand-border rounded-xl p-4 hover:border-accent-gold/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent-gold-light flex items-center justify-center shrink-0">
          <i className={`fas ${pattern.icon} text-accent-gold text-sm`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-brand-dark">
              {pattern.name}
            </h4>
            {videoPattern.timestamp && (
              <span className="text-xs text-brand-muted bg-cream-100 px-2 py-0.5 rounded">
                @ {videoPattern.timestamp}
              </span>
            )}
          </div>
          <p className="text-xs text-brand-body mt-1 leading-relaxed">
            {videoPattern.description || pattern.description}
          </p>

          {/* How to spot it tip */}
          <div className="flex items-center gap-1.5 mt-3 bg-cream-50 rounded-lg px-3 py-2">
            <i className="fas fa-lightbulb text-accent-gold text-[10px]" />
            <p className="text-[11px] text-brand-muted">
              <span className="font-medium">How to Spot It:</span>{' '}
              {pattern.howToSpot}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
