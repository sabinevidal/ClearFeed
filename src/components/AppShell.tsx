'use client';

import { TopNav } from './TopNav';
import { SideNav } from './SideNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
