import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ParentDashboard } from '@/components/dashboard/ParentDashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'PARENT') {
    redirect('/library');
  }

  // Get children profiles
  const children = await prisma.user.findMany({
    where: { parentId: session.user.id },
    include: { childProfile: true },
  });

  // Get pending/flagged videos for review
  const reviewQueue = await prisma.video.findMany({
    where: {
      status: 'PENDING',
      riskScore: { not: null },
    },
    include: {
      patterns: { include: { pattern: true } },
      submittedBy: { select: { name: true } },
    },
    orderBy: { analyzedAt: 'desc' },
    take: 20,
  });

  // Get recent activity stats
  const totalVideos = await prisma.video.count();
  const approvedVideos = await prisma.video.count({
    where: { status: 'APPROVED' },
  });
  const blockedVideos = await prisma.video.count({
    where: { status: 'BLOCKED' },
  });
  const totalPatterns = await prisma.videoPattern.count();

  // Get recent review actions
  const recentActions = await prisma.reviewAction.findMany({
    where: { parentId: session.user.id },
    include: { video: true },
    orderBy: { decidedAt: 'desc' },
    take: 5,
  });

  return (
    <ParentDashboard
      children={children}
      reviewQueue={reviewQueue}
      stats={{
        totalVideos,
        approvedVideos,
        blockedVideos,
        patternsIdentified: totalPatterns,
      }}
      recentActions={recentActions}
    />
  );
}
