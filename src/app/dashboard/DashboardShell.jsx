'use client';

import { usePathname } from 'next/navigation';
import { JarvisProvider } from './components/jarvis/JarvisProvider';
import JarvisOrb from './components/jarvis/JarvisOrb';
import JarvisCommandPalette from './components/jarvis/JarvisCommandPalette';
import JarvisToastStack, { useJarvisToasts } from './components/jarvis/JarvisToast';

function JarvisShell({ children }) {
  const pathname = usePathname();
  const isFullJarvis = pathname?.startsWith('/dashboard/jarvis');
  const toastApi = useJarvisToasts();

  return (
    <JarvisProvider toastApi={toastApi} minimal={!isFullJarvis}>
      {children}
      {!isFullJarvis && <JarvisOrb />}
      {!isFullJarvis && <JarvisCommandPalette />}
      <JarvisToastStack
        toasts={toastApi.toasts}
        onDismiss={toastApi.dismissToast}
        className={isFullJarvis ? '!bottom-auto top-20 right-6 md:right-8' : ''}
      />
    </JarvisProvider>
  );
}

export default function DashboardShell({ children }) {
  return (
    <JarvisShell>{children}</JarvisShell>
  );
}
