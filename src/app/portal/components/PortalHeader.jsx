'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Container } from '../../components/ui/Container';

const NAV = [
  { href: '/portal', label: 'Dashboard', match: (p) => p === '/portal' },
  { href: '/portal/documents', label: 'Documents', match: (p) => p.startsWith('/portal/documents') },
  { href: '/portal/onboarding', label: 'Intake', match: (p) => p.startsWith('/portal/onboarding') },
];

export default function PortalHeader({ email, fullName }) {
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check', { credentials: 'include', cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setRole(d.role || null))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const linkClass = (active) =>
    active
      ? 'text-[#ffb700] font-medium'
      : 'text-[#ADB7BE] hover:text-[#ffb700] transition';

  return (
    <header className="border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-20">
      <Container size="wide" className="py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/portal" className="text-xl font-bold text-white shrink-0">
            Client Portal
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {NAV.map(({ href, label, match }) => (
              <Link
                key={href}
                href={href}
                className={linkClass(match(pathname))}
                aria-current={match(pathname) ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
            {role === 'admin' && (
              <Link href="/dashboard" className="text-[#ffb700] hover:underline font-medium">
                Control Centre →
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-sm shrink-0">
          <span className="text-[#ADB7BE] hidden sm:inline truncate max-w-[180px]">
            {fullName || email}
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden px-3 py-1.5 text-[#ADB7BE] hover:text-white hover:bg-[#222] rounded-lg transition"
            aria-expanded={menuOpen}
            aria-label="Open menu"
          >
            Menu
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 text-[#ADB7BE] hover:text-white hover:bg-[#222] rounded-lg transition"
          >
            Sign out
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav className="md:hidden border-t border-[#222] bg-[#0a0a0a] px-4 py-3 flex flex-col gap-3 text-sm">
          {NAV.map(({ href, label, match }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={linkClass(match(pathname))}
              aria-current={match(pathname) ? 'page' : undefined}
            >
              {label}
              {match(pathname) && <span className="text-xs text-[#666] ml-2">(current)</span>}
            </Link>
          ))}
          {role === 'admin' && (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-[#ffb700] font-medium"
            >
              Control Centre (admin) →
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
