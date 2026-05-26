import type { Pattern } from '@prisma/client';

interface PatternCardProps {
  pattern: Pattern;
  isSelected: boolean;
  onSelect: () => void;
}

export function PatternCard({ pattern, isSelected, onSelect }: PatternCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left bg-white border rounded-2xl p-5 transition-all hover:shadow-sm ${
        isSelected
          ? 'border-accent-gold ring-2 ring-accent-gold/20'
          : 'border-brand-border hover:border-cream-300'
      }`}
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-cream-100 flex items-center justify-center shrink-0">
          <i className={`fas ${pattern.icon} text-2xl text-accent-gold`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-brand-dark mb-1">{pattern.name}</h3>
          <p className="text-sm text-brand-body leading-relaxed line-clamp-2">
            {pattern.description}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <i className="fas fa-lightbulb text-accent-gold text-[10px]" />
            <p className="text-xs text-brand-muted">
              <span className="font-medium">How to Spot It:</span>{' '}
              {pattern.howToSpot}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
