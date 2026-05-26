export default function LibraryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-2">
        Your Video Library
      </h1>
      <p className="text-brand-body mb-6">
        Browse your curated, ad-free library of approved videos. No tricks, no
        traps — just great content.
      </p>

      <div className="bg-white rounded-card p-6 mb-6">
        <div className="flex items-center gap-3">
          <i className="fas fa-link text-brand-muted" />
          <input
            type="text"
            placeholder="Paste a video link here to request analysis…"
            className="flex-1 px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
          />
          <button className="px-6 py-3 bg-brand-dark text-cream-100 rounded-lg text-sm font-bold hover:bg-[#2a2a2a] transition-colors">
            Check Video
          </button>
        </div>
        <p className="text-xs text-brand-muted mt-3">
          Our system checks videos for manipulation patterns before adding them
          to your library. If the video needs a parent&apos;s OK, we&apos;ll
          send a request for you!
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button className="px-5 py-2 bg-brand-dark text-cream-100 rounded-full text-sm font-bold">
          Recently Added
        </button>
        <button className="px-5 py-2 bg-cream-200 text-brand-body rounded-full text-sm font-bold hover:bg-cream-300 transition-colors">
          Educational
        </button>
        <button className="px-5 py-2 bg-cream-200 text-brand-body rounded-full text-sm font-bold hover:bg-cream-300 transition-colors">
          All Videos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-card overflow-hidden">
          <div className="h-48 bg-cream-200 flex items-center justify-center">
            <i className="fas fa-film text-4xl text-brand-muted" />
          </div>
          <div className="p-4">
            <p className="text-xs text-status-safe mb-1">Good for today</p>
            <p className="font-bold text-sm mb-1">
              Videos will appear here once analyzed
            </p>
            <p className="text-xs text-status-safe">Risk: —/10</p>
          </div>
        </div>
      </div>
    </div>
  );
}
