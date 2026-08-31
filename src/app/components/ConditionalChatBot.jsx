'use client';

import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';

const ConditionalChatBot = () => {
  const pathname = usePathname();

  // Don't show the launcher on business-bundle or authenticated app areas
  if (
    pathname === '/business-bundle' ||
    pathname.startsWith('/portal') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login')
  ) {
    return null;
  }

  return (
    <a
      href="https://wa.me/447545207215"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-20 right-6 z-50 hidden md:flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#ffb700] shadow-[0_0_20px_rgba(255,183,0,0.6)] transition-all duration-300 hover:scale-105"
      style={{ background: 'linear-gradient(135deg, #f9e27d 0%, #ffd54f 25%, #ffb700 50%, #fff1a8 78%, #ffb700 100%)' }}
    >
      <FaWhatsapp className="w-8 h-8 text-black" />
    </a>
  );
};

export default ConditionalChatBot;
