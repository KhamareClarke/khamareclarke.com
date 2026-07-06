'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          window.location.href = callbackUrl;
          return;
        }
      }
      setError('Invalid password');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Control Centre</h1>
            <p className="text-[#ADB7BE] text-sm">Enter password to access dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#ffb700]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#ffb700] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#e6a600] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            <a href="/" className="text-[#ffb700] hover:underline">← Back to site</a>
          </p>
        </div>
      </motion.div>
        </Container>
      </Section>
    </main>
  );
}
