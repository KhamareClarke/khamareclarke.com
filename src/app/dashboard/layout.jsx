'use client';

import { JarvisProvider } from './components/jarvis/JarvisProvider';
import JarvisDrawer from './components/jarvis/JarvisDrawer';
import JarvisOrb from './components/jarvis/JarvisOrb';
import JarvisCommandPalette from './components/jarvis/JarvisCommandPalette';
import JarvisToastStack, { useJarvisToasts } from './components/jarvis/JarvisToast';

function JarvisShell({ children }) {
  const toastApi = useJarvisToasts();
  return (
    <JarvisProvider toastApi={toastApi}>
      {children}
      <JarvisOrb />
      <JarvisDrawer />
      <JarvisCommandPalette />
      <JarvisToastStack toasts={toastApi.toasts} onDismiss={toastApi.dismissToast} />
    </JarvisProvider>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <JarvisShell>{children}</JarvisShell>
  );
}
