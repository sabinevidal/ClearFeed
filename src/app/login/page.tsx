'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/library');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100">
      <div className="w-full max-w-md p-8 bg-white rounded-card shadow-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <i className="fas fa-play-circle text-brand-dark text-2xl" />
          <h1 className="text-2xl font-bold text-brand-dark">ClearFeed</h1>
        </div>

        <p className="text-center text-brand-body mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-brand-body mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-brand-dark focus:outline-none focus:ring-2 focus:ring-accent-gold"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-brand-body mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-cream-300 bg-cream-50 text-brand-dark focus:outline-none focus:ring-2 focus:ring-accent-gold"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-status-warning text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-dark text-cream-100 rounded-lg font-bold hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-cream-50 rounded-lg">
          <p className="text-xs text-brand-muted text-center mb-2">
            Demo accounts:
          </p>
          <p className="text-xs text-brand-body text-center">
            Parent: parent@clearfeed.dev / parent123
          </p>
          <p className="text-xs text-brand-body text-center">
            Child: maya@clearfeed.dev / child123
          </p>
        </div>
      </div>
    </div>
  );
}
