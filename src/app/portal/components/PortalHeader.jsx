'use client';

import { Container } from '../../components/ui/Container';

export default function PortalHeader({ email, fullName }) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <header className="border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
      <Container size="wide" className="py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/portal" className="text-xl font-bold text-white">
            Client Portal
          </a>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <a href="/portal" className="text-[#ADB7BE] hover:text-[#ffb700] transition">Dashboard</a>
            <a href="/portal/documents" className="text-[#ADB7BE] hover:text-[#ffb700] transition">Documents</a>
            <a href="/portal/onboarding" className="text-[#ADB7BE] hover:text-[#ffb700] transition">Intake</a>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#ADB7BE] hidden sm:inline">{fullName || email}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-[#ADB7BE] hover:text-white hover:bg-[#222] rounded-lg transition"
          >
            Sign out
          </button>
        </div>
      </Container>
    </header>
  );
}
