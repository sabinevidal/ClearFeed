import type { ReviewAction, Video } from '@prisma/client';

type ActionWithVideo = ReviewAction & { video: Video };

interface RecentActionsProps {
  actions: ActionWithVideo[];
}

export function RecentActions({ actions }: RecentActionsProps) {
  if (actions.length === 0) {
    return (
      <div className="warm-card p-6 text-center">
        <p className="text-bubble-desc text-brand-muted">
          No review decisions yet. Videos will appear here once you approve or
          block them.
        </p>
      </div>
    );
  }

  return (
    <div className="warm-card overflow-hidden">
      <div className="divide-y divide-white/30">
        {actions.map((action) => (
          <div key={action.id} className="flex items-center gap-4 p-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                action.action === 'APPROVE'
                  ? 'bg-status-safe/10'
                  : 'bg-category-emotional/10'
              }`}
            >
              <i
                className={`fas ${
                  action.action === 'APPROVE' ? 'fa-check' : 'fa-ban'
                } text-xs ${
                  action.action === 'APPROVE'
                    ? 'text-status-safe'
                    : 'text-category-emotional'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-brand-dark truncate">
                {action.video.title}
              </p>
              <p className="text-video-meta text-brand-muted">
                {action.action === 'APPROVE' ? 'Approved' : 'Blocked'} •{' '}
                {new Date(action.decidedAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`text-video-meta font-semibold ${
                action.action === 'APPROVE'
                  ? 'text-status-safe'
                  : 'text-category-emotional'
              }`}
            >
              {action.action === 'APPROVE' ? 'Approved' : 'Blocked'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
