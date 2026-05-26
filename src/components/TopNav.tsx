'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function TopNav() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between py-header-y px-header-x border-b border-subtle bg-cream-50/80 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2">
        {/* Shield icon — amber fill at 15% opacity with amber stroke */}
        <div className="w-[26px] h-[26px] flex items-center justify-center">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
              fill="rgba(232,168,48,0.15)"
              stroke="#E8A830"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-product-name text-brand-dark">ClearView</span>
      </Link>

      <div className="flex items-center gap-4">
        {session?.user && (
          <div className="flex items-center gap-2 ml-2">
            <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center text-cream-100 text-sm font-bold">
              {session.user.name?.charAt(0) ?? '?'}
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-brand-dark hover:text-brand-body transition-colors"
            >
              {session.user.name}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
