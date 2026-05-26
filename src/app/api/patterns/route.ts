import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const patterns = await prisma.pattern.findMany({
    orderBy: [{ category: 'asc' }, { riskScore: 'asc' }],
  });

  return NextResponse.json(patterns);
}
