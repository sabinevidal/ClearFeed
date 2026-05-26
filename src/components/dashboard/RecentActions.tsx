import type { ReviewAction, Video } from '@prisma/client';

type ActionWithVideo = ReviewAction & { video: Video };

interface RecentActionsProps {
  actions: ActionWithVideo[];
}

export function RecentActions({ actions }: RecentActionsProps) {
  if (actions.length === 0) {
    return (
      <div className="bg-white rounded-card p-6 border border-brand-border text-center">
        <p className="text-sm text-brand-muted">
          No review decisions yet. Videos will appear here once you approve or
          block them.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card border border-brand-border overflow-hidden">
      <div className="divide-y divide-brand-border">
        {actions.map((action) => (
          <div key={action.id} className="flex items-center gap-4 p-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                action.action === 'APPROVE'
                  ? 'bg-status-safe-light'
                  : 'bg-status-warning-light'
              }`}
            >
              <i
                className={`fas ${
                  action.action === 'APPROVE' ? 'fa-check' : 'fa-ban'
                } text-xs ${
                  action.action === 'APPROVE'
                    ? 'text-status-safe'
                    : 'text-status-warning'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-brand-dark truncate">
                {action.video.title}
              </p>
              <p className="text-xs text-brand-muted">
                {action.action === 'APPROVE' ? 'Approved' : 'Blocked'} •{' '}
                {new Date(action.decidedAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`text-xs font-bold ${
                action.action === 'APPROVE'
                  ? 'text-status-safe'
                  : 'text-status-warning'
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
