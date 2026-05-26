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
      color: 'text-brand-dark',
    },
    {
      label: 'Approved',
      value: stats.approvedVideos,
      icon: 'fa-check-circle',
      color: 'text-status-safe',
    },
    {
      label: 'Blocked',
      value: stats.blockedVideos,
      icon: 'fa-ban',
      color: 'text-status-warning',
    },
    {
      label: 'Patterns Found',
      value: stats.patternsIdentified,
      icon: 'fa-exclamation-triangle',
      color: 'text-accent-gold',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-card p-4 border border-brand-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <i className={`fas ${item.icon} ${item.color} text-sm`} />
            <span className="text-xs text-brand-muted">{item.label}</span>
          </div>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
