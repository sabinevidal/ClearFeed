import Image from 'next/image';
import Link from 'next/link';
import type { Video, VideoPattern, Pattern } from '@prisma/client';

type VideoWithPatterns = Video & {
  patterns: (VideoPattern & { pattern: Pattern })[];
};

interface VideoCardProps {
  video: VideoWithPatterns;
  userRole?: string;
}

export function VideoCard({ video, userRole }: VideoCardProps) {
  const statusConfig = getStatusConfig(video);

  return (
    <div className="warm-card overflow-hidden hover:scale-[1.02] transition-all">
      {/* Thumbnail */}
      <div className="relative h-48 bg-cream-100">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-video-meta px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
        {video.status === 'PENDING' && (
          <span className="absolute top-2 left-2 bg-category-attention text-white text-video-meta px-2 py-0.5 rounded-pill font-semibold">
            Analyzing...
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className={`text-video-meta mb-1 ${statusConfig.color}`}>
          {statusConfig.label}
        </p>
        <h3 className="text-video-title text-brand-dark mb-1 line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className={`text-video-meta ${statusConfig.scoreColor}`}>
            {video.riskScore !== null ? `Risk: ${video.riskScore}/10` : 'Pending analysis'}
          </p>
          {video.category && (
            <p className="text-video-meta text-brand-muted">{video.category}</p>
          )}
        </div>

        {/* Action link for higher-risk videos */}
        {video.riskScore !== null && video.riskScore >= 5 && (
          <Link
            href={`/learning?video=${video.id}`}
            className="inline-block mt-2 text-video-meta text-brand-dark hover:text-category-attention transition-colors"
          >
            Watch with annotations →
          </Link>
        )}

        {/* Parent actions for pending videos */}
        {userRole === 'PARENT' && video.status === 'PENDING' && (
          <div className="flex gap-2 mt-3">
            <button className="flex-1 text-video-meta py-1.5 bg-status-safe text-white rounded-pill font-semibold hover:bg-status-safe/90 transition-colors">
              Approve
            </button>
            <button className="flex-1 text-video-meta py-1.5 bg-category-emotional text-white rounded-pill font-semibold hover:bg-category-emotional/90 transition-colors">
              Block
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusConfig(video: VideoWithPatterns) {
  if (video.status === 'PENDING') {
    return {
      label: 'Pending analysis',
      color: 'text-category-attention',
      scoreColor: 'text-category-attention',
    };
  }

  if (video.status === 'BLOCKED') {
    return {
      label: 'Blocked',
      color: 'text-category-emotional',
      scoreColor: 'text-category-emotional',
    };
  }

  if (video.riskScore !== null && video.riskScore >= 5) {
    return {
      label: 'Requires more attention',
      color: 'text-category-emotional',
      scoreColor: 'text-category-emotional',
    };
  }

  return {
    label: 'Good for today',
    color: 'text-status-safe',
    scoreColor: 'text-status-safe',
  };
}
