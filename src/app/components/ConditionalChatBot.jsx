'use client';

import { usePathname } from 'next/navigation';
import SimpleChatBot from './SimpleChatBot';

const ConditionalChatBot = () => {
  const pathname = usePathname();
  
  // Don't show chatbot on business-bundle page
  if (pathname === '/business-bundle') {
    return null;
  }
  
  return <SimpleChatBot />;
};

export default ConditionalChatBot;
