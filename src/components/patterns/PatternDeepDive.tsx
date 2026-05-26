import type { Pattern } from '@prisma/client';

interface PatternDeepDiveProps {
  pattern: Pattern;
}

export function PatternDeepDive({ pattern }: PatternDeepDiveProps) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl p-6 sticky top-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-accent-gold-light flex items-center justify-center">
          <i className={`fas ${pattern.icon} text-accent-gold text-sm`} />
        </div>
        <h2 className="text-lg font-bold text-brand-dark">{pattern.name}</h2>
      </div>

      {/* Description */}
      <p className="text-sm text-brand-body leading-relaxed mb-5">
        {pattern.description}
      </p>

      {/* Illustration placeholder */}
      <div className="w-full h-40 rounded-xl bg-cream-100 flex items-center justify-center mb-5">
        <i className={`fas ${pattern.icon} text-5xl text-cream-300`} />
      </div>

      {/* Psychology explanation */}
      {pattern.psychologyExplanation && (
        <div className="bg-cream-50 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-brain text-accent-gold text-sm" />
            <h3 className="text-sm font-bold text-brand-dark">
              Why This Works on Your Brain
            </h3>
          </div>
          <p className="text-sm text-brand-body leading-relaxed">
            {pattern.psychologyExplanation}
          </p>
        </div>
      )}

      {/* Examples */}
      {pattern.examples.length > 0 && (
        <div className="bg-status-safe-light rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-location-arrow text-status-safe text-xs" />
            <h3 className="text-sm font-bold text-brand-dark">
              Where You Might See This
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {pattern.examples.map((example, i) => (
              <li key={i} className="flex items-start gap-2">
                <i className="fas fa-check text-status-safe text-xs mt-1" />
                <span className="text-sm text-brand-body">{example}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Power move tip */}
      <div className="bg-cream-100 rounded-xl p-4 mb-5">
        <div className="flex items-start gap-2">
          <i className="fas fa-graduation-cap text-accent-gold mt-0.5" />
          <p className="text-xs text-brand-body leading-relaxed">
            <span className="font-bold">Power move:</span> {pattern.howToSpot}{' '}
            😄
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2.5 bg-brand-dark text-cream-100 rounded-lg text-sm font-bold hover:bg-[#2a2a2a] transition-colors">
          See This in a Video
        </button>
        <button className="flex-1 px-4 py-2.5 bg-cream-200 text-brand-dark rounded-lg text-sm font-bold hover:bg-cream-300 transition-colors">
          Analyze a Video
        </button>
      </div>
    </div>
  );
}
