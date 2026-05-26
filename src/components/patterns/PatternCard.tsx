import type { Pattern } from '@prisma/client';

interface PatternCardProps {
  pattern: Pattern;
  isSelected: boolean;
  onSelect: () => void;
}

function getRiskColor(score: number) {
  if (score <= 4) return 'bg-status-safe text-white';
  if (score <= 7) return 'bg-amber-500 text-white';
  return 'bg-red-500 text-white';
}

function getRiskLabel(score: number) {
  if (score <= 4) return 'Low';
  if (score <= 7) return 'Medium';
  return 'High';
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
        <div className="w-14 h-14 rounded-xl bg-cream-100 flex items-center justify-center shrink-0">
          <i className={`fas ${pattern.icon} text-xl text-accent-gold`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-brand-dark">{pattern.name}</h3>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${getRiskColor(pattern.riskScore)}`}>
              {getRiskLabel(pattern.riskScore)} ({pattern.riskScore})
            </span>
          </div>
          <p className="text-xs text-brand-muted mb-1.5">{pattern.category}</p>
          <p className="text-sm text-brand-body leading-relaxed line-clamp-2">
            {pattern.description}
          </p>
          <div className="flex items-center gap-1.5 mt-2.5">
            <i className="fas fa-lightbulb text-accent-gold text-[10px]" />
            <p className="text-xs text-brand-muted line-clamp-1">
              <span className="font-medium">Spot it:</span>{' '}
              {pattern.howToSpot}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
