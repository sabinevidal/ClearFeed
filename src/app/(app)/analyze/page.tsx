import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AnalyzeVideoPage } from '@/components/analyze/AnalyzeVideoPage';

export const dynamic = 'force-dynamic';

export default async function AnalyzePage() {
  const session = await getServerSession(authOptions);

  // Get pending videos for the current user (or all for parents)
  const where =
    session?.user?.role === 'PARENT'
      ? { status: 'PENDING' as const }
      : { submittedById: session?.user?.id, status: 'PENDING' as const };

  const pendingVideos = await prisma.video.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <AnalyzeVideoPage
      pendingVideos={pendingVideos}
      userRole={session?.user?.role}
    />
  );
}
