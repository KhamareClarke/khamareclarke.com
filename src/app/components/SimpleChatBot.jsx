'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const SimpleChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm Khamare's AI assistant. I can help you with questions about AI automation, web development, digital marketing, and business growth. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);
  const messagesEndRef = useRef(null);

  // Simple Q&A database
  const qaDatabase = {
    "what services do you offer": "We offer AI automation, web development, digital marketing, and business growth consulting. We help businesses streamline their operations and increase efficiency.",
    "how much does it cost": "Our pricing varies based on your specific needs. We offer free consultations to discuss your requirements and provide a customized quote. Contact us at +44 7545 207 215 for more details.",
    "how long does a project take": "Project timelines depend on complexity. Simple websites take 2-4 weeks, while AI automation projects can take 4-8 weeks. We'll provide a detailed timeline during our free consultation.",
    "do you work with small businesses": "Yes! We work with businesses of all sizes, from startups to established companies. We have special packages designed specifically for small and medium businesses.",
    "what makes you different": "We combine technical expertise with business strategy. Our AI solutions are custom-built for your specific needs, and we provide ongoing support to ensure your success."
  };

  // Available questions to show
  const availableQuestions = [
    "What services do you offer?",
    "How much does it cost?",
    "How long does a project take?",
    "Do you work with small businesses?",
    "What makes you different?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Typewriter effect function
  const typewriterEffect = (text, messageId, onComplete) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setTypingMessage({
          id: messageId,
          content: text.substring(0, index),
          isTyping: true
        });
        index++;
      } else {
        clearInterval(interval);
        // Remove the blinking cursor and mark as complete
        setTypingMessage({
          id: messageId,
          content: text,
          isTyping: false
        });
        
        // Add the final message to chat history
        const finalMessage = {
          id: messageId,
          type: 'bot',
          content: text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalMessage]);
        
        // Clear typing message after a brief moment
        setTimeout(() => {
          setTypingMessage(null);
          onComplete();
        }, 200);
      }
    }, 30); // Adjust speed here (lower = faster)
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show questions immediately when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowQuestions(true);
    } else {
      setShowQuestions(false);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowQuestions(false); // Hide questions when user sends a message

    // Find matching answer
    const userQuestion = inputValue.toLowerCase().trim();
    let botResponse = "I'm not sure about that. Could you ask me about our services, pricing, project timelines, or what makes us different?";

    // Check for exact matches or partial matches
    for (const [key, value] of Object.entries(qaDatabase)) {
      if (userQuestion.includes(key) || key.includes(userQuestion)) {
        botResponse = value;
        break;
      }
    }

    // Add bot response with typewriter effect
    setTimeout(() => {
      const messageId = Date.now() + 1;
      
      // Start typewriter effect
      typewriterEffect(botResponse, messageId, () => {
        // Show questions after 2 seconds of typewriter completing
        setTimeout(() => {
          setShowQuestions(true);
        }, 2000);
      });
    }, 500);

    setInputValue('');
  };

  const handleQuestionClick = (question) => {
    setInputValue(question);
    setShowQuestions(false); // Hide questions when user clicks one
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-6 z-50 p-2 transition-all duration-300 group ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#ffb700] p-2 shadow-[0_0_20px_rgba(255,183,0,0.6)] animate-pulse">
          <Image
            src="/images/logo.png"
            alt="AI Assistant"
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </div>
      </motion.button>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-50 bg-black rounded-2xl shadow-2xl border border-[#ffb700]/20 overflow-hidden w-80 h-[500px] max-h-[calc(100vh-6rem)] flex flex-col"
            initial={{ scale: 0, opacity: 0, y: 20, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20, rotateX: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black p-4 flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center space-x-3 relative z-10">
                <div>
                  <h3 className="font-bold text-sm">Khamare AI Assistant</h3>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs opacity-80">AI Business Growth Specialist</p>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 relative z-10">
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-black/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-black" style={{ height: 'calc(100vh - 8rem)', paddingTop: '12px' }}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <motion.div 
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black' 
                          : 'bg-[#ffb700]/20 text-[#ffb700] border border-[#ffb700]/30'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {message.type === 'user' ? (
                        <UserIcon className="w-4 h-4" />
                      ) : (
                        <Image
                          src="/images/logo.png"
                          alt="Logo"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                      )}
                    </motion.div>
                    <motion.div 
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black'
                          : 'bg-[#1a1a1a] text-white border border-[#ffb700]/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-black/60' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typewriter Effect Message */}
              {typingMessage && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <motion.div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#ffb700]/20 text-[#ffb700] border border-[#ffb700]/30"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </motion.div>
                    <motion.div 
                      className="rounded-2xl px-4 py-3 bg-[#1a1a1a] text-white border border-[#ffb700]/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {typingMessage.content}
                        {typingMessage.isTyping && <span className="animate-pulse text-[#ffb700]">|</span>}
                      </p>
                      <p className="text-xs mt-1 text-gray-400">
                        {new Date().toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {/* Available Questions - Only show after 3 seconds */}
              {showQuestions && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-[#ffb700] text-center font-medium flex items-center justify-center">
                    <span className="mr-1">💡</span>
                    Quick Questions:
                  </p>
                  <div className="space-y-2">
                    {availableQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className="w-full text-left p-3 bg-[#1a1a1a] hover:bg-[#ffb700]/10 rounded-lg border border-[#ffb700]/20 hover:border-[#ffb700]/40 transition-all duration-300 text-sm group"
                        whileHover={{ scale: 1.01, x: 2 }}
                        whileTap={{ scale: 0.99 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <span className="text-white group-hover:text-[#ffb700] transition-colors">
                          {question}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#ffb700]/20 p-3 sm:p-4 bg-black">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent transition-all duration-300"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black p-2 sm:p-3 rounded-lg hover:from-[#ff8c00] hover:to-[#ffb700] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#ffb700]/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">
                  AI Assistant • Live
                </p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#ffb700] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#ffb700] font-medium">Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SimpleChatBot;
