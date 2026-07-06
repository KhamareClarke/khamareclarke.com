'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CpuChipIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  LightBulbIcon,
  BoltIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm Khamare's AI assistant. I can help you with questions about AI automation, web development, digital marketing, and business growth. What would you like to know?",
      timestamp: new Date(),
      isTyping: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [conversationContext, setConversationContext] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const quickActions = [
    { label: "Services", icon: "🤖", category: "services", color: "from-blue-500 to-purple-600" },
    { label: "Pricing", icon: "💰", category: "pricing", color: "from-green-500 to-emerald-600" },
    { label: "Process", icon: "📋", category: "process", color: "from-orange-500 to-red-600" },
    { label: "Get Started", icon: "🚀", category: "contact", color: "from-pink-500 to-rose-600" }
  ];

  const smartSuggestions = [
    "How can AI help my business?",
    "What's your success rate?",
    "Do you work with startups?",
    "How long does a project take?",
    "What makes you different?",
    "Can you show me examples?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      isTyping: false
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationContext(prev => [...prev, { role: 'user', content: inputValue }]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    setMessageCount(prev => prev + 1);
    setSuggestions([]);

    // Add typing indicator
    const typingMessage = {
      id: Date.now() + 0.5,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          context: conversationContext.slice(-5) // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        isTyping: false,
        confidence: data.confidence,
        category: data.category
      };

      setMessages(prev => [...prev, botResponse]);
      setConversationContext(prev => [...prev, { role: 'assistant', content: data.response }]);
      
      // Use API-generated smart suggestions
      setTimeout(() => {
        setSuggestions(data.suggestions || smartSuggestions.slice(0, 3));
      }, 1000);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'd love to help you with that! For the most accurate information, I recommend booking a free consultation with Khamare. You can reach out at +44 7545 207 215 or systems@khamare.com. Would you like to know more about our services?",
        timestamp: new Date(),
        isTyping: false
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    const questionMap = {
      "Services": "What services do you offer?",
      "Pricing": "How much does it cost?",
      "Process": "What's your process?",
      "Get Started": "How can I get started?",
      "Experience": "Show me your experience",
      "AI Automation": "Tell me about AI automation"
    };
    
    const fullQuestion = questionMap[action.label] || action.label;
    setInputValue(fullQuestion);
    handleSendMessage();
  };

  const handleSuggestion = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const expandChat = () => {
    setIsMinimized(false);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse font-bold">
          AI
        </div>
        {/* Pulsing ring effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ffb700] to-[#ff8c00] animate-ping opacity-20"></div>
        {/* Mobile tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-[#111015] text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap md:hidden border border-[#ffb700]/30">
          Ask me anything!
        </div>
      </motion.button>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleChat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-6 right-6 z-50 bg-[#111015] rounded-2xl shadow-2xl border border-[#ffb700]/20 overflow-hidden ${
              isMinimized 
                ? 'w-48 h-8' 
                : 'w-[240px] max-w-[calc(100vw-2rem)] h-[350px] max-h-[calc(100vh-8rem)] md:w-[280px] md:h-[400px]'
            }`}
            initial={{ scale: 0, opacity: 0, y: 20, rotateX: -15 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              rotateX: 0,
              width: isMinimized ? 192 : 'auto',
              height: isMinimized ? 32 : 'auto'
            }}
            exit={{ scale: 0, opacity: 0, y: 20, rotateX: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black p-4 flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center space-x-3 relative z-10">
                <div className="bg-black/20 p-2 rounded-lg">
                  <CpuChipIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Khamare AI Assistant</h3>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs opacity-80">AI Business Growth Specialist</p>
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 relative z-10">
                {!isMinimized && (
                  <motion.button
                    onClick={minimizeChat}
                    className="p-1 hover:bg-black/20 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </motion.button>
                )}
                {isMinimized && (
                  <motion.button
                    onClick={expandChat}
                    className="p-1 hover:bg-black/20 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  onClick={toggleChat}
                  className="p-1 hover:bg-black/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[380px] md:h-[420px] bg-[#111015] text-base md:text-[15px]">
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
                            <SparklesIcon className="w-4 h-4" />
                          )}
                        </motion.div>
                        <motion.div 
                          className={`rounded-2xl px-4 py-3 text-base leading-relaxed ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black'
                              : 'bg-[#1a1a1a] text-white/90 border border-[#ffb700]/20'
                          }`}
                          style={{ fontSize: '1rem', lineHeight: '1.6' }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {message.isTyping ? (
                            <div className="flex space-x-1">
                              <motion.div 
                                className="w-2 h-2 bg-[#ffb700] rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-[#ffb700] rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-[#ffb700] rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className={`text-xs ${
                                  message.type === 'user' ? 'text-black/60' : 'text-gray-400'
                                }`}>
                                  {message.timestamp.toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                                {message.type === 'bot' && (
                                  <motion.button
                                    onClick={() => speakText(message.content)}
                                    className="text-gray-400 hover:text-[#ffb700] transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <SpeakerWaveIcon className="w-4 h-4" />
                                  </motion.button>
                                )}
                              </div>
                            </>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Smart Suggestions */}
                  {suggestions.length > 0 && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-sm text-[#ffb700] text-center font-medium flex items-center justify-center">
                        <LightBulbIcon className="w-4 h-4 mr-1" />
                        Suggested:
                      </p>
                      <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSuggestion(suggestion)}
                            className="w-full text-left p-3 bg-[#1a1a1a] hover:bg-[#ffb700]/10 rounded-lg border border-[#ffb700]/20 hover:border-[#ffb700]/40 transition-all duration-300 text-sm group"
                            whileHover={{ scale: 1.01, x: 2 }}
                            whileTap={{ scale: 0.99 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <span className="text-white group-hover:text-[#ffb700] transition-colors">
                              {suggestion}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Quick Actions */}
                  {showQuickActions && (
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-sm text-[#ffb700] text-center font-medium flex items-center justify-center">
                        <BoltIcon className="w-4 h-4 mr-1" />
                        Quick Questions:
                      </p>
                      <div className="space-y-2">
                        {quickActions.map((action, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleQuickAction(action)}
                            className="w-full text-left p-3 bg-[#1a1a1a] hover:bg-[#ffb700]/10 rounded-lg border border-[#ffb700]/20 hover:border-[#ffb700]/40 transition-all duration-300 text-sm group"
                            whileHover={{ scale: 1.01, x: 2 }}
                            whileTap={{ scale: 0.99 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{action.icon}</span>
                              <span className="text-white group-hover:text-[#ffb700] transition-colors">
                                {action.label}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-[#ffb700]/20 p-4 bg-[#111015] relative">
                  {/* Smart input suggestions */}
                  {inputValue.length > 0 && (
                    <motion.div
                      className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg p-2 space-y-1 shadow-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {smartSuggestions
                        .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
                        .slice(0, 2)
                        .map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setInputValue(suggestion)}
                            className="w-full text-left p-2 text-sm text-gray-300 hover:text-[#ffb700] hover:bg-[#ffb700]/10 rounded transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                    </motion.div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent transition-all duration-300"
                      disabled={isTyping}
                    />
                    
                    {/* Voice input button */}
                    <motion.button
                      onClick={isListening ? stopListening : startListening}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        isListening 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-[#ffb700]/20 text-[#ffb700] hover:bg-[#ffb700]/30'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MicrophoneIcon className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black p-3 rounded-lg hover:from-[#ff8c00] hover:to-[#ffb700] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#ffb700]/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      AI Assistant • {messageCount} messages
                    </p>
                    <div className="flex items-center space-x-1">
                      <FireIcon className="w-3 h-3 text-[#ffb700]" />
                      <span className="text-xs text-[#ffb700] font-medium">Live</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;