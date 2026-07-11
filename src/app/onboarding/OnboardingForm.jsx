'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'business', title: 'Business Details' },
  { id: 'goals', title: 'Goals & Timeline' },
  { id: 'complete', title: 'Complete' },
];

export default function OnboardingForm({ userId = null, endpoint = '/api/onboarding', initialData = null, successHref = '/dashboard', successLabel = 'Access Dashboard' } = {}) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    contactName: initialData?.contactName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    companyName: initialData?.companyName || '',
    website: initialData?.website || '',
    businessType: initialData?.businessType || '',
    industry: initialData?.industry || '',
    currentChallenges: initialData?.currentChallenges || '',
    goals: initialData?.goals || '',
    timeline: initialData?.timeline || '',
    budget: initialData?.budget || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save');
      }
    } catch (e) {
      alert('Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isLastStep = step === STEPS.length - 1;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] px-4 py-12">
      <Section className="py-ds-6">
        <Container size="narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb700]/20 to-[#ff8c00]/20 backdrop-blur-sm border border-[#ffb700]/30 text-[#ffb700] text-sm font-bold px-6 py-3 rounded-full mb-6 tracking-wider uppercase">
                <span>🤖</span>
                AI-Powered Onboarding
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00] mb-4">
                Business Analysis
              </h1>
              <p className="text-[#ADB7BE] text-lg max-w-lg mx-auto">
                Let's gather some details to create your personalized AI strategy
              </p>
            </div>

            <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#ffb700]/20 rounded-2xl p-8 shadow-2xl">
              
              {/* Notice */}
              <div className="mb-8 p-4 rounded-xl bg-[#ffb700]/10 border border-[#ffb700]/30 text-[#ffb700] text-sm">
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span>Share this page with clients to collect their info. Data is saved to your dashboard.</span>
                </div>
          </div>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Analysis Complete!</h2>
                  <p className="text-[#ADB7BE] mb-8 text-lg">
                    Thanks for completing the onboarding. We'll be in touch within 24 hours with your personalized strategy.
              </p>
              <a
                href={successHref}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-bold rounded-xl hover:scale-105 transform transition-all duration-300"
              >
                    <span>🚀</span>
                    {successLabel}
              </a>
            </motion.div>
          ) : (
            <>
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#ffb700] font-semibold text-sm">
                        Step {step + 1} of {STEPS.length}
                      </span>
                      <span className="text-[#ADB7BE] text-sm">
                        {Math.round(((step + 1) / STEPS.length) * 100)}% Complete
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                {STEPS.map((s, i) => (
                  <div
                    key={s.id}
                          className={`h-2 flex-1 rounded-full ${
                            i <= step ? 'bg-gradient-to-r from-[#ffb700] to-[#ff8c00]' : 'bg-[#333]'
                    }`}
                  />
                ))}
                    </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-white mb-4">Let's Get Started</h2>
                          <p className="text-[#ADB7BE] text-lg leading-relaxed">
                            Our AI system will analyze your business and create a personalized growth strategy. 
                            This takes about 2 minutes.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                          {[
                            { icon: '🧠', title: 'Smart Analysis', desc: 'AI-powered assessment' },
                            { icon: '⚡', title: 'Quick Process', desc: '2-minute setup' },
                            { icon: '🎯', title: 'Custom Strategy', desc: 'Tailored recommendations' }
                          ].map((feature, i) => (
                            <div
                              key={i}
                              className="text-center p-4 bg-[#0a0a0a]/50 rounded-xl border border-[#ffb700]/10"
                            >
                              <div className="text-2xl mb-2">{feature.icon}</div>
                              <h3 className="text-[#ffb700] font-semibold text-sm mb-1">{feature.title}</h3>
                              <p className="text-[#ADB7BE] text-xs">{feature.desc}</p>
                            </div>
                          ))}
                        </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="business"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                  >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] rounded-lg flex items-center justify-center">
                            🏢
                          </div>
                          <div>
                    <h2 className="text-xl font-bold text-white">Business Details</h2>
                            <p className="text-[#ADB7BE] text-sm">Tell us about your business</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Contact Name" value={formData.contactName} onChange={(v) => updateField('contactName', v)} required />
                    <Input label="Email" type="email" value={formData.email} onChange={(v) => updateField('email', v)} required />
                    <Input label="Phone" type="tel" value={formData.phone} onChange={(v) => updateField('phone', v)} />
                    <Input label="Company Name" value={formData.companyName} onChange={(v) => updateField('companyName', v)} />
                          <Input label="Website Address" type="url" value={formData.website} onChange={(v) => updateField('website', v)} placeholder="https://yourwebsite.com" />
                    <Input label="Business Type" value={formData.businessType} onChange={(v) => updateField('businessType', v)} placeholder="e.g. SaaS, Agency, E-commerce" />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                    <Input label="Industry" value={formData.industry} onChange={(v) => updateField('industry', v)} />
                        </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="goals"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                  >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] rounded-lg flex items-center justify-center">
                            🎯
                          </div>
                          <div>
                    <h2 className="text-xl font-bold text-white">Goals & Timeline</h2>
                            <p className="text-[#ADB7BE] text-sm">What are you looking to achieve?</p>
                          </div>
                        </div>
                        
                        <Textarea label="Current Challenges" value={formData.currentChallenges} onChange={(v) => updateField('currentChallenges', v)} placeholder="What obstacles are limiting your growth?" />
                        <Textarea label="Goals" value={formData.goals} onChange={(v) => updateField('goals', v)} placeholder="What do you want to achieve in the next 12 months?" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input label="Timeline" value={formData.timeline} onChange={(v) => updateField('timeline', v)} placeholder="e.g. 3-6 months" />
                          <Input label="Budget" value={formData.budget} onChange={(v) => updateField('budget', v)} placeholder="e.g. £2,000 - £10,000" />
                        </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] rounded-lg flex items-center justify-center">
                            🚀
                          </div>
                          <div>
                    <h2 className="text-xl font-bold text-white">Review & Submit</h2>
                            <p className="text-[#ADB7BE] text-sm">Confirm your details</p>
                          </div>
                        </div>
                        
                        <div className="bg-[#0a0a0a]/50 rounded-xl p-6 border border-[#ffb700]/20 max-h-64 overflow-y-auto">
                          <h3 className="text-[#ffb700] font-semibold mb-4">Summary</h3>
                          <div className="space-y-2 text-sm">
                            {Object.entries(formData).map(([k, v]) => v && (
                              <div key={k} className="flex justify-between">
                                <span className="text-[#ffb700] capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="text-[#ADB7BE] text-right max-w-xs truncate">{v}</span>
                        </div>
                      ))}
                          </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#ffb700]/20">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                      className="flex items-center gap-2 px-6 py-3 text-[#ADB7BE] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-lg hover:bg-[#ffb700]/10"
                >
                      ← Back
                </button>
                    
                {isLastStep ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-bold rounded-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <span className="animate-spin">🤖</span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <span>🚀</span>
                            Submit Analysis
                          </>
                        )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-bold rounded-xl hover:scale-105 transform transition-all duration-300"
                  >
                        Continue →
                  </button>
                )}
              </div>
            </>
          )}
            </div>

          <p className="mt-6 text-center">
              <a href="/" className="text-sm text-[#ADB7BE] hover:text-[#ffb700] transition-colors duration-300">
                ← Back to site
              </a>
          </p>
      </motion.div>
        </Container>
      </Section>
    </main>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#ffb700]">
        {label} {required && <span className="text-[#ff8c00]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-[#0a0a0a]/80 border border-[#ffb700]/20 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-[#ffb700] transition-all duration-300"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#ffb700]">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 bg-[#0a0a0a]/80 border border-[#ffb700]/20 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-[#ffb700] transition-all duration-300 resize-none"
      />
    </div>
  );
}
