'use client';

import { usePathname } from 'next/navigation';
import SimpleChatBot from './SimpleChatBot';

const ConditionalChatBot = () => {
  const pathname = usePathname();
  
  // Don't show chatbot on business-bundle or authenticated app areas
  if (
    pathname === '/business-bundle' ||
    pathname.startsWith('/portal') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login')
  ) {
    return null;
  }
  
  return <SimpleChatBot />;
};

export default ConditionalChatBot;
