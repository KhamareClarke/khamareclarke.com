'use client';

import { JarvisProvider } from './components/jarvis/JarvisProvider';
import JarvisDrawer from './components/jarvis/JarvisDrawer';
import JarvisOrb from './components/jarvis/JarvisOrb';
import JarvisCommandPalette from './components/jarvis/JarvisCommandPalette';

export default function DashboardLayout({ children }) {
  return (
    <JarvisProvider>
      {children}
      <JarvisOrb />
      <JarvisDrawer />
      <JarvisCommandPalette />
    </JarvisProvider>
  );
}
