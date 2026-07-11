'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import JarvisFullPageHud from '../components/jarvis/JarvisFullPageHud';

export default function JarvisFullPage() {
  const router = useRouter();
  const [authOk, setAuthOk] = useState(null);

  useEffect(() => {
    fetch('/api/auth/check', { credentials: 'include', cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) {
          router.replace('/login?callbackUrl=/dashboard/jarvis');
          return;
        }
        const data = await res.json();
        if (data?.role !== 'admin') {
          router.replace('/dashboard/leads');
          return;
        }
        setAuthOk(true);
      })
      .catch(() => router.replace('/login?callbackUrl=/dashboard/jarvis'));
  }, [router]);

  if (authOk === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070600]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/lion-logo.svg"
          alt=""
          aria-hidden="true"
          width={88}
          height={88}
          style={{
            filter:
              'drop-shadow(0 0 18px rgba(255,183,0,0.65)) drop-shadow(0 0 44px rgba(255,140,0,0.32))',
            animation: 'kc-logo-pulse 2s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes kc-logo-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.7; transform: scale(0.96); }
          }
        `}</style>
      </div>
    );
  }

  return <JarvisFullPageHud />;
}
