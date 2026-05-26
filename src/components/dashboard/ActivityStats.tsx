interface ActivityStatsProps {
  stats: {
    totalVideos: number;
    approvedVideos: number;
    blockedVideos: number;
    patternsIdentified: number;
  };
}

export function ActivityStats({ stats }: ActivityStatsProps) {
  const items = [
    {
      label: 'Total Videos',
      value: stats.totalVideos,
      icon: 'fa-film',
      color: '#1a1a1a',
    },
    {
      label: 'Approved',
      value: stats.approvedVideos,
      icon: 'fa-check-circle',
      color: '#2e7d32',
    },
    {
      label: 'Blocked',
      value: stats.blockedVideos,
      icon: 'fa-ban',
      color: '#E86B4A',
    },
    {
      label: 'Patterns Found',
      value: stats.patternsIdentified,
      icon: 'fa-exclamation-triangle',
      color: '#E8A830',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-col-gap mb-8">
      {items.map((item) => (
        <div
          key={item.label}
          className="warm-card p-4 relative overflow-hidden"
        >
          {/* Subtle gradient blob */}
          <div
            className="gradient-blob -z-10 -top-8 -right-8 opacity-15"
            style={{
              background: `radial-gradient(circle, ${item.color}88 0%, ${item.color}44 40%, transparent 70%)`,
              width: '100px',
              height: '100px',
            }}
          />
          <div className="flex items-center gap-2 mb-2">
            <i className={`fas ${item.icon} text-sm`} style={{ color: item.color }} />
            <span className="text-video-meta text-brand-muted">{item.label}</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: item.color }}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
