/** Full-screen JARVIS — no dashboard chrome; mobile-safe viewport. */
export default function JarvisLayout({ children }) {
  return (
    <div className="fixed inset-0 z-[200] bg-[#030712] overflow-hidden h-[100dvh] max-h-[100dvh]">
      {children}
    </div>
  );
}
