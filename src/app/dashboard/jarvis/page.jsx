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
      <div className="flex h-full items-center justify-center text-sky-300/80 text-sm tracking-widest uppercase">
        Initialising JARVIS…
      </div>
    );
  }

  return <JarvisFullPageHud />;
}
