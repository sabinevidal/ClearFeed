'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const childNavItems = [
  { href: '/learning', icon: 'fa-play-circle', label: 'Learning Mode' },
  { href: '/library', icon: 'fa-film', label: 'Video Library' },
  { href: '/patterns', icon: 'fa-book', label: 'Pattern Library' },
  { href: '/analyze', icon: 'fa-search-plus', label: 'Analyze Video' },
];

const parentNavItems = [
  { href: '/library', icon: 'fa-film', label: 'Video Library' },
  { href: '/patterns', icon: 'fa-book', label: 'Pattern Library' },
  { href: '/dashboard', icon: 'fa-tachometer-alt', label: 'Parent Dashboard' },
  { href: '/analyze', icon: 'fa-search-plus', label: 'Analyze Video' },
];

export function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems =
    session?.user?.role === 'PARENT' ? parentNavItems : childNavItems;

  return (
    <nav className="w-[200px] min-h-[calc(100vh-60px)] bg-brand-dark flex flex-col justify-between py-6">
      <ul className="flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#2a2a2a] text-cream-100'
                    : 'text-cream-300 hover:text-cream-100 hover:bg-[#2a2a2a]'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-3">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 text-sm text-cream-300 hover:text-cream-100 transition-colors"
        >
          <i className="fas fa-sign-out-alt w-5 text-center" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
