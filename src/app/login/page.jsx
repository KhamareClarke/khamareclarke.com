'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';

const CLIENT_EMAIL = 'clarkekhamare@gmail.com';
const ADMIN_EMAIL = 'khamareclarke@gmail.com';

function initialMode(searchParams) {
  const mode = searchParams.get('mode');
  if (mode === 'admin' || mode === 'client') return mode;
  const callback = searchParams.get('callbackUrl') || '';
  if (callback.startsWith('/dashboard')) return 'admin';
  if (callback.startsWith('/portal')) return 'client';
  return 'client';
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const requestedCallback = searchParams.get('callbackUrl') || '';
  const [mode, setMode] = useState(() => initialMode(searchParams));
  const [email, setEmail] = useState(() =>
    initialMode(searchParams) === 'admin' ? ADMIN_EMAIL : CLIENT_EMAIL
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setEmail(next === 'admin' ? ADMIN_EMAIL : CLIENT_EMAIL);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, intendedRole: mode }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        const role = data.role || 'client';
        const defaultUrl = role === 'admin' ? '/dashboard/jarvis' : '/portal';
        let target = requestedCallback || defaultUrl;
        if (role !== 'admin' && target.startsWith('/dashboard')) target = '/portal';
        if (role === 'admin' && target.startsWith('/portal') && mode === 'admin') target = '/dashboard';
        if (role === 'admin' && target === '/') target = '/dashboard/jarvis';
        window.location.href = target;
        return;
      }
      setError(data.error || 'Invalid credentials');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = mode === 'admin';

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] px-4">
      <Section className="py-ds-6">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#ffb700]/20 rounded-ds-lg p-8 shadow-ds-xl">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Sign in</h1>
                <p className="text-[#ADB7BE] text-sm">
                  {isAdmin ? 'Admin control centre' : 'Client portal'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[#0a0a0a] rounded-lg border border-[#333]">
                <button
                  type="button"
                  onClick={() => switchMode('client')}
                  className={`py-2.5 px-3 text-sm font-semibold rounded-md transition ${
                    !isAdmin
                      ? 'bg-[#ffb700] text-[#0a0a0a]'
                      : 'text-[#ADB7BE] hover:text-white'
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('admin')}
                  className={`py-2.5 px-3 text-sm font-semibold rounded-md transition ${
                    isAdmin
                      ? 'bg-[#ffb700] text-[#0a0a0a]'
                      : 'text-[#ADB7BE] hover:text-white'
                  }`}
                >
                  Admin
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#ffb700]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent"
                    placeholder={isAdmin ? ADMIN_EMAIL : CLIENT_EMAIL}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#ffb700]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#ffb700] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#e6a600] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? 'Signing in...'
                    : isAdmin
                      ? 'Sign in as Admin'
                      : 'Sign in as Client'}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-gray-500">
                {isAdmin
                  ? 'Admin access only. Clients should use the Client tab.'
                  : 'Need an account? Ask your account manager for an invite.'}
              </p>
              <p className="mt-4 text-center text-xs text-gray-500">
                <a href="/" className="text-[#ffb700] hover:underline">← Back to site</a>
              </p>
            </div>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}
