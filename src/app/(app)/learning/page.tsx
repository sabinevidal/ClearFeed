import { prisma } from '@/lib/db';
import { LearningModePage } from '@/components/learning/LearningModePage';

export const dynamic = 'force-dynamic';

interface LearningPageProps {
  searchParams: { video?: string };
}

export default async function LearningPage({ searchParams }: LearningPageProps) {
  const videoId = searchParams.video;

  // If a specific video is requested, load it with patterns
  let video = null;
  if (videoId) {
    video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        patterns: {
          include: { pattern: true },
        },
      },
    });
  }

  // Also load recent analyzed videos for the picker
  const recentVideos = await prisma.video.findMany({
    where: {
      analyzedAt: { not: null },
      riskScore: { gte: 3 },
    },
    include: {
      patterns: {
        include: { pattern: true },
      },
    },
    orderBy: { analyzedAt: 'desc' },
    take: 10,
  });

  return <LearningModePage video={video} recentVideos={recentVideos} />;
}
