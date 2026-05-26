import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { VideoLibrary } from '@/components/library/VideoLibrary';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);

  const where =
    session?.user?.role === 'CHILD' ? { status: 'APPROVED' as const } : {};

  const videos = await prisma.video.findMany({
    where,
    include: {
      patterns: {
        include: { pattern: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <VideoLibrary videos={videos} userRole={session?.user?.role} />;
}
