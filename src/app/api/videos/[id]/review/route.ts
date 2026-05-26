import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'PARENT') {
    return NextResponse.json(
      { error: 'Only parents can review videos' },
      { status: 403 }
    );
  }

  const { id } = params;
  const body = await request.json();
  const { action, rationale } = body;

  if (!action || !['APPROVE', 'BLOCK'].includes(action)) {
    return NextResponse.json(
      { error: 'Action must be APPROVE or BLOCK' },
      { status: 400 }
    );
  }

  // Create review action record
  await prisma.reviewAction.create({
    data: {
      videoId: id,
      parentId: session.user.id,
      action,
      rationale: rationale || null,
    },
  });

  // Update video status
  const video = await prisma.video.update({
    where: { id },
    data: {
      status: action === 'APPROVE' ? 'APPROVED' : 'BLOCKED',
    },
  });

  return NextResponse.json(video);
}
