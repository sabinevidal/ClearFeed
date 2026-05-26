'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function TopNav() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between h-[60px] px-6 border-b border-brand-border bg-cream-100">
      <Link href="/" className="flex items-center gap-2">
        <i className="fas fa-play-circle text-brand-dark text-xl" />
        <span className="text-xl font-bold text-brand-dark">ClearFeed</span>
      </Link>

      <div className="flex items-center gap-4">
        <button className="text-brand-dark hover:text-brand-body" aria-label="Search">
          <i className="fas fa-search text-lg" />
        </button>
        <button className="text-brand-dark hover:text-brand-body" aria-label="Notifications">
          <i className="fas fa-bell text-lg" />
        </button>
        <button className="text-brand-dark hover:text-brand-body" aria-label="Safety">
          <i className="fas fa-shield-alt text-lg" />
        </button>
        <button className="text-brand-dark hover:text-brand-body" aria-label="Add content">
          <i className="fas fa-plus-circle text-lg" />
        </button>

        {session?.user && (
          <div className="flex items-center gap-2 ml-2">
            <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center text-cream-100 text-sm font-bold">
              {session.user.name?.charAt(0) ?? '?'}
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-brand-dark hover:text-brand-body"
            >
              {session.user.name}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
