import type { Pattern } from '@prisma/client';

interface PatternDeepDiveProps {
  pattern: Pattern;
}

function getRiskColor(score: number) {
  if (score <= 4) return 'text-status-safe';
  if (score <= 7) return 'text-amber-500';
  return 'text-red-500';
}

function getRiskBg(score: number) {
  if (score <= 4) return 'bg-status-safe-light';
  if (score <= 7) return 'bg-amber-50';
  return 'bg-red-50';
}

function getRiskBorder(score: number) {
  if (score <= 4) return 'border-status-safe/20';
  if (score <= 7) return 'border-amber-200';
  return 'border-red-200';
}

export function PatternDeepDive({ pattern }: PatternDeepDiveProps) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl p-6 sticky top-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-accent-gold-light flex items-center justify-center">
          <i className={`fas ${pattern.icon} text-accent-gold text-sm`} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-dark">{pattern.name}</h2>
          <p className="text-xs text-brand-muted">{pattern.category}</p>
        </div>
      </div>

      {/* Risk Score */}
      <div className={`rounded-xl p-3 mb-4 border ${getRiskBg(pattern.riskScore)} ${getRiskBorder(pattern.riskScore)}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-brand-body">Risk Level</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-4 rounded-sm ${
                    i < pattern.riskScore ? getRiskColor(pattern.riskScore).replace('text-', 'bg-') : 'bg-cream-200'
                  }`}
                />
              ))}
            </div>
            <span className={`text-sm font-bold ${getRiskColor(pattern.riskScore)}`}>
              {pattern.riskScore}/10
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-brand-body leading-relaxed mb-5">
        {pattern.description}
      </p>

      {/* Why it works - psychology */}
      <div className="bg-cream-50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <i className="fas fa-brain text-accent-gold text-sm" />
          <h3 className="text-sm font-bold text-brand-dark">
            Why This Works on Your Brain
          </h3>
        </div>
        <p className="text-sm text-brand-body leading-relaxed">
          {pattern.whyItWorks}
        </p>
      </div>

      {/* Age-appropriate explanations */}
      {(pattern.ageExplanation10 || pattern.ageExplanation14) && (
        <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-child text-blue-500 text-sm" />
            <h3 className="text-sm font-bold text-brand-dark">
              In Kid-Friendly Terms
            </h3>
          </div>
          {pattern.ageExplanation10 && (
            <div className="mb-2">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">Ages 10–12</span>
              <p className="text-sm text-brand-body leading-relaxed mt-1">
                {pattern.ageExplanation10}
              </p>
            </div>
          )}
          {pattern.ageExplanation14 && (
            <div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">Ages 14–16</span>
              <p className="text-sm text-brand-body leading-relaxed mt-1">
                {pattern.ageExplanation14}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detection Signals */}
      {pattern.detectionSignals.length > 0 && (
        <div className="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-search text-purple-500 text-xs" />
            <h3 className="text-sm font-bold text-brand-dark">
              Detection Signals
            </h3>
          </div>
          <ul className="flex flex-col gap-1.5">
            {pattern.detectionSignals.map((signal, i) => (
              <li key={i} className="flex items-start gap-2">
                <i className="fas fa-crosshairs text-purple-400 text-[10px] mt-1.5" />
                <span className="text-xs text-brand-body">{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Examples */}
      {pattern.examples.length > 0 && (
        <div className="bg-status-safe-light rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-location-arrow text-status-safe text-xs" />
            <h3 className="text-sm font-bold text-brand-dark">
              Where You Might See This
            </h3>
          </div>
          <ul className="flex flex-col gap-1.5">
            {pattern.examples.map((example, i) => (
              <li key={i} className="flex items-start gap-2">
                <i className="fas fa-check text-status-safe text-xs mt-1" />
                <span className="text-xs text-brand-body">{example}</span>
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
