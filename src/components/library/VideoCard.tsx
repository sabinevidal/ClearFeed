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
    <div className="bg-white rounded-card overflow-hidden border border-brand-border hover:shadow-md transition-shadow">
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
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
        {video.status === 'PENDING' && (
          <span className="absolute top-2 left-2 bg-accent-gold text-white text-xs px-2 py-0.5 rounded-full font-bold">
            Analyzing...
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className={`text-xs mb-1 ${statusConfig.color}`}>
          {statusConfig.label}
        </p>
        <h3 className="font-bold text-sm text-brand-dark mb-1 line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className={`text-xs ${statusConfig.scoreColor}`}>
            {video.riskScore !== null ? `Risk: ${video.riskScore}/10` : 'Pending analysis'}
          </p>
          {video.category && (
            <p className="text-xs text-brand-muted">{video.category}</p>
          )}
        </div>

        {/* Action link for higher-risk videos */}
        {video.riskScore !== null && video.riskScore >= 5 && (
          <Link
            href={`/learning?video=${video.id}`}
            className="inline-block mt-2 text-xs text-brand-dark hover:underline"
          >
            Watch with annotations →
          </Link>
        )}

        {/* Parent actions for pending videos */}
        {userRole === 'PARENT' && video.status === 'PENDING' && (
          <div className="flex gap-2 mt-3">
            <button className="flex-1 text-xs py-1.5 bg-status-safe text-white rounded font-bold hover:bg-status-safe/90 transition-colors">
              Approve
            </button>
            <button className="flex-1 text-xs py-1.5 bg-status-warning text-white rounded font-bold hover:bg-status-warning/90 transition-colors">
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
      color: 'text-accent-gold',
      scoreColor: 'text-accent-gold',
    };
  }

  if (video.status === 'BLOCKED') {
    return {
      label: 'Blocked',
      color: 'text-status-warning',
      scoreColor: 'text-status-warning',
    };
  }

  if (video.riskScore !== null && video.riskScore >= 5) {
    return {
      label: 'Requires more attention',
      color: 'text-status-warning',
      scoreColor: 'text-status-warning',
    };
  }

  return {
    label: 'Good for today',
    color: 'text-status-safe',
    scoreColor: 'text-status-safe',
  };
}
