import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');

  const where: Record<string, unknown> = {};

  // Children only see approved videos
  if (session.user.role === 'CHILD') {
    where.status = 'APPROVED';
  } else if (status) {
    where.status = status;
  }

  if (category && category !== 'all') {
    where.category = category;
  }

  const videos = await prisma.video.findMany({
    where,
    include: {
      patterns: {
        include: { pattern: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(videos);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Extract YouTube video ID
  const youtubeId = extractYouTubeId(url);
  if (!youtubeId) {
    return NextResponse.json(
      { error: 'Invalid YouTube URL' },
      { status: 400 }
    );
  }

  // Check if video already exists
  const existing = await prisma.video.findFirst({
    where: { youtubeId },
  });

  if (existing) {
    return NextResponse.json(
      { error: 'This video has already been submitted', video: existing },
      { status: 409 }
    );
  }

  // Fetch video metadata from YouTube oEmbed
  const metadata = await fetchYouTubeMetadata(youtubeId);

  const video = await prisma.video.create({
    data: {
      title: metadata.title,
      youtubeUrl: url,
      youtubeId,
      thumbnailUrl: metadata.thumbnailUrl,
      duration: null,
      category: null,
      riskScore: null,
      status: 'PENDING',
      submittedById: session.user.id,
    },
  });

  return NextResponse.json(video, { status: 201 });
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

async function fetchYouTubeMetadata(
  youtubeId: string
): Promise<{ title: string; thumbnailUrl: string }> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
    const response = await fetch(oembedUrl);

    if (response.ok) {
      const data = await response.json();
      return {
        title: data.title || 'Untitled Video',
        thumbnailUrl:
          data.thumbnail_url ||
          `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      };
    }
  } catch {
    // Fall back to default thumbnail
  }

  return {
    title: 'Untitled Video',
    thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
  };
}
