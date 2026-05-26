import { prisma } from '@/lib/db';
import { PatternLibrary } from '@/components/patterns/PatternLibrary';

export const dynamic = 'force-dynamic';

export default async function PatternsPage() {
  const patterns = await prisma.pattern.findMany({
    orderBy: { name: 'asc' },
  });

  return <PatternLibrary patterns={patterns} />;
}
