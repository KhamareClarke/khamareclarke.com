'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CurrencyDollarIcon, ClockIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const ContactForm = ({ isOpen, onClose, type = 'contact' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    timeline: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: type
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          budget: '',
          timeline: '',
          message: ''
        });
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#111015] rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4 sm:mx-0 border border-[#ffb700]/20 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {type === 'quote' ? 'Get Custom Quote' : 'Contact Khamare'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent text-sm sm:text-base"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent text-sm sm:text-base"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent text-sm sm:text-base"
                  placeholder="+44 1234 567890"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company
              </label>
              <div className="relative">
                <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent text-sm sm:text-base"
                  placeholder="Your company name"
                />
              </div>
            </div>

            {/* Budget (for quotes) */}
            {type === 'quote' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Budget Range
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select budget range</option>
                    <option value="Under £2,500">Under £2,500</option>
                    <option value="£2,500 - £5,000">£2,500 - £5,000</option>
                    <option value="£5,000 - £10,000">£5,000 - £10,000</option>
                    <option value="£10,000 - £25,000">£10,000 - £25,000</option>
                    <option value="Over £25,000">Over £25,000</option>
                  </select>
                </div>
              </div>
            )}

            {/* Timeline (for quotes) */}
            {type === 'quote' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Timeline
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select timeline</option>
                    <option value="ASAP">ASAP</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Message *
              </label>
              <div className="relative">
                <ChatBubbleLeftRightIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-[#1a1a1a] border border-[#ffb700]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent resize-none text-sm sm:text-base"
                  placeholder={type === 'quote' ? 'Tell us about your project requirements...' : 'How can we help you?'}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black py-3 rounded-lg font-semibold hover:from-[#ff8c00] hover:to-[#ffb700] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : (type === 'quote' ? 'Request Quote' : 'Send Message')}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                className="text-green-400 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ✅ Message sent successfully! Khamare will get back to you soon.
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                className="text-red-400 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ❌ Failed to send message. Please try again.
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactForm;
