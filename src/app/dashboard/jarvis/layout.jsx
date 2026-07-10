/** Full-screen JARVIS — no dashboard chrome. */
export default function JarvisLayout({ children }) {
  return (
    <div className="fixed inset-0 z-[200] bg-[#030712] overflow-hidden">
      {children}
    </div>
  );
}
