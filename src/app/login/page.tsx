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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient blobs */}
      <div
        className="gradient-blob top-20 left-20 opacity-30"
        style={{
          background: 'radial-gradient(circle, #E8A83088 0%, #E8A83044 40%, transparent 70%)',
          width: '200px',
          height: '200px',
        }}
      />
      <div
        className="gradient-blob bottom-20 right-20 opacity-30"
        style={{
          background: 'radial-gradient(circle, #6B5AC788 0%, #6B5AC744 40%, transparent 70%)',
          width: '200px',
          height: '200px',
        }}
      />

      <div className="w-full max-w-md p-8 warm-card relative z-10">
        <div className="flex items-center gap-2 mb-8 justify-center">
          {/* Shield icon */}
          <svg
            width="32"
            height="32"
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
          <h1 className="text-product-name text-brand-dark">ClearView</h1>
        </div>

        <p className="text-center text-bubble-desc text-brand-body mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-video-meta text-brand-body mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-bubble bg-cream-100/60 border border-white/50 text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-category-attention/30"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-video-meta text-brand-body mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-bubble bg-cream-100/60 border border-white/50 text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-category-attention/30"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-category-emotional text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-dark text-white rounded-pill font-semibold hover:bg-brand-body transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-cream-100/60 rounded-bubble">
          <p className="text-video-meta text-brand-muted text-center mb-2">
            Demo accounts:
          </p>
          <p className="text-video-meta text-brand-body text-center">
            Parent: parent@clearfeed.dev / parent123
          </p>
          <p className="text-video-meta text-brand-body text-center">
            Child: maya@clearfeed.dev / child123
          </p>
        </div>
      </div>
    </div>
  );
}
