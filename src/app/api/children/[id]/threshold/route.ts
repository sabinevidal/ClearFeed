import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'PARENT') {
    return NextResponse.json(
      { error: 'Only parents can update thresholds' },
      { status: 403 }
    );
  }

  const { id } = params;
  const body = await request.json();
  const { threshold } = body;

  if (typeof threshold !== 'number' || threshold < 1 || threshold > 10) {
    return NextResponse.json(
      { error: 'Threshold must be a number between 1 and 10' },
      { status: 400 }
    );
  }

  // Verify this child belongs to the parent
  const child = await prisma.user.findFirst({
    where: { id, parentId: session.user.id },
  });

  if (!child) {
    return NextResponse.json(
      { error: 'Child not found' },
      { status: 404 }
    );
  }

  const profile = await prisma.childProfile.upsert({
    where: { userId: id },
    update: { contentThreshold: threshold },
    create: {
      userId: id,
      age: 10, // Default age, should be set during onboarding
      contentThreshold: threshold,
    },
  });

  return NextResponse.json(profile);
}
