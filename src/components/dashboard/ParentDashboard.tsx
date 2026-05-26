'use client';

import { ChildProfileCard } from './ChildProfileCard';
import { ReviewQueue } from './ReviewQueue';
import { ActivityStats } from './ActivityStats';
import { RecentActions } from './RecentActions';
import type {
  User,
  ChildProfile,
  Video,
  VideoPattern,
  Pattern,
  ReviewAction,
} from '@prisma/client';

type ChildWithProfile = User & { childProfile: ChildProfile | null };
type VideoWithPatterns = Video & {
  patterns: (VideoPattern & { pattern: Pattern })[];
  submittedBy: { name: string };
};
type ActionWithVideo = ReviewAction & { video: Video };

interface ParentDashboardProps {
  children: ChildWithProfile[];
  reviewQueue: VideoWithPatterns[];
  stats: {
    totalVideos: number;
    approvedVideos: number;
    blockedVideos: number;
    patternsIdentified: number;
  };
  recentActions: ActionWithVideo[];
}

export function ParentDashboard({
  children,
  reviewQueue,
  stats,
  recentActions,
}: ParentDashboardProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-1">
        Parent Dashboard
      </h1>
      <p className="text-sm text-brand-body mb-6">
        Manage your children&apos;s content thresholds and review flagged
        videos.
      </p>

      {/* Activity stats */}
      <ActivityStats stats={stats} />

      {/* Child profiles */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-brand-dark mb-4">
          Child Profiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.length === 0 ? (
            <div className="bg-white rounded-card p-6 border border-brand-border col-span-2 text-center">
              <p className="text-sm text-brand-muted">
                No child profiles yet. Add a child account to get started.
              </p>
            </div>
          ) : (
            children.map((child) => (
              <ChildProfileCard key={child.id} child={child} />
            ))
          )}
        </div>
      </section>

      {/* Review queue */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-dark">
            Review Queue
            {reviewQueue.length > 0 && (
              <span className="ml-2 text-sm font-normal text-brand-muted">
                ({reviewQueue.length} pending)
              </span>
            )}
          </h2>
          <a
            href="/patterns"
            className="text-sm text-brand-body hover:text-brand-dark transition-colors"
          >
            View Full Library →
          </a>
        </div>
        <ReviewQueue videos={reviewQueue} />
      </section>

      {/* Recent actions */}
      <section>
        <h2 className="text-lg font-bold text-brand-dark mb-4">
          Recent Decisions
        </h2>
        <RecentActions actions={recentActions} />
      </section>
    </div>
  );
}
