import { NextResponse } from 'next/server';

// Enhanced knowledge base with more comprehensive responses
const knowledgeBase = {
  // Services
  'services': {
    keywords: ['services', 'what do you do', 'offer', 'provide', 'capabilities', 'what services', 'your services'],
    response: `I help businesses grow through AI automation, web development, and digital marketing.

I specialize in:
- AI chatbots and business process automation
- Custom websites and e-commerce platforms  
- Mobile and desktop applications
- Digital marketing and lead generation
- Business analytics and optimization

All of these are designed to save you time and increase your revenue. What area interests you most?`
  },

  'ai automation': {
    keywords: ['ai automation', 'automation', 'ai agents', 'chatbots', 'workflow', 'process automation'],
    response: `AI automation is what I do best. I help businesses automate their repetitive tasks so they can focus on what matters most.

I typically automate things like:
- Customer service and support
- Lead qualification and follow-up
- Data entry and processing
- Social media and email marketing

Most of my clients save 20-40 hours per week and see a 99% reduction in errors. It's pretty amazing what's possible when you let AI handle the routine stuff.

Would you like to know more about how this could work for your business?`
  },

  'web development': {
    keywords: ['web development', 'website', 'web app', 'frontend', 'backend', 'responsive'],
    response: `I create modern, high-performance websites and web applications that drive business growth:

**What I Build:**
• **Responsive Websites**: Perfect on all devices (desktop, tablet, mobile)
• **E-commerce Platforms**: Online stores with payment integration
• **Web Applications**: Custom business tools and dashboards
• **Progressive Web Apps**: App-like experiences in browsers
• **API Development**: Backend services and integrations

**Technologies I Use:**
• React, Next.js, Node.js
• Modern CSS frameworks (Tailwind, styled-components)
• Database design and optimization
• Cloud deployment and scaling
• Performance optimization

**What You Get:**
• Lightning-fast loading times
• SEO-optimized for better rankings
• Mobile-first responsive design
• Analytics and tracking integration
• Ongoing support and maintenance

**Results:**
• 40% faster page load times
• 25% increase in user engagement
• 60% improvement in conversion rates
• 100% mobile compatibility

All projects include comprehensive testing, optimization, and ongoing support. Ready to discuss your web development needs?`
  },

  'digital marketing': {
    keywords: ['digital marketing', 'marketing', 'seo', 'lead generation', 'social media', 'growth'],
    response: `I drive real business growth through strategic digital marketing that delivers measurable ROI:

**My Marketing Services:**
• **Lead Generation**: Proven strategies to attract qualified prospects
• **SEO Optimization**: Higher Google rankings and organic traffic
• **Social Media Marketing**: Engaging content and community building
• **Email Marketing**: Automated nurturing and conversion campaigns
• **Content Marketing**: Valuable content that builds authority
• **Paid Advertising**: Strategic PPC and social media ads

**The Results I Deliver:**
• 2-3x increase in qualified leads within 90 days
• 40% improvement in conversion rates
• 50% reduction in cost per acquisition
• 200% increase in organic traffic
• 300% improvement in social media engagement

**My Approach:**
1. **Strategy**: Data-driven marketing plans
2. **Implementation**: Expert execution across channels
3. **Optimization**: Continuous testing and improvement
4. **Reporting**: Clear ROI tracking and insights

**Industries I've Helped:**
• E-commerce and retail
• Professional services
• Technology companies
• Healthcare and wellness
• Real estate and property

Ready to see how strategic digital marketing can transform your business growth?`
  },

  // Pricing and Investment
  'pricing': {
    keywords: ['pricing', 'cost', 'price', 'how much', 'budget', 'investment', 'rates'],
    response: `Pricing really depends on what you need and the scope of your project. I try to keep things flexible so it works for different budgets.

Here's a rough idea of what things cost:
- Web development: £2,500 to £15,000+ depending on complexity
- AI automation: £1,500 to £8,000+ based on what you want to automate
- Digital marketing: £1,000 to £5,000 per month for ongoing campaigns
- Full business transformation: £5,000 to £25,000+ for comprehensive solutions

The best way to get accurate pricing is through a free 30-minute discovery call where we can discuss your specific needs. Would you like to book one?`
  },

  'business bundle': {
    keywords: ['business bundle', 'bundle', 'package', 'what\'s included', 'comprehensive', 'full service', 'whats included', 'included in', 'bundle include'],
    response: `The business bundle is my most comprehensive offering - it's designed for businesses that want to transform everything at once.

Here's what's included in the business bundle:
- Complete AI automation setup (chatbots, workflows, data processing)
- Custom website or web application development
- Digital marketing strategy and implementation
- Analytics and reporting dashboard
- 3 months of ongoing support and optimization
- Monthly strategy calls and performance reviews
- Training for your team on new systems

The bundle typically ranges from £5,000 to £25,000+ depending on the complexity and scope. It's designed to give you maximum ROI by integrating everything together.

Would you like to discuss what this could look like for your specific business?`
  },

  'custom quote': {
    keywords: ['custom quote', 'personalized quote', 'specific quote', 'tailored pricing', 'individual quote'],
    response: `Absolutely! I'd be happy to create a custom quote for your specific needs.

To give you an accurate quote, I'll need to understand:
- What specific services you're interested in
- The scope and complexity of your project
- Your timeline and budget range
- Any existing systems or tools you're using
- Your main business goals and challenges

The best way to do this is through a free 30-minute discovery call where we can discuss your needs in detail. After that, I'll send you a personalized proposal with:
- Detailed breakdown of services
- Timeline and milestones
- Investment options
- Expected results and ROI

Would you like to request a custom quote now? I can send you a detailed proposal within 24 hours.`
  },

  'payment plans': {
    keywords: ['payment plans', 'installments', 'monthly payments', 'financing', 'payment options', 'split payments', 'do you offer payment', 'payment schedule', 'pay monthly'],
    response: `Yes, I do offer flexible payment plans to make things easier for my clients.

Here are the payment options I typically offer:
- 50% upfront, 50% on completion (for smaller projects)
- 3-month payment plan (33% upfront, then monthly)
- 6-month payment plan (20% upfront, then monthly)
- Custom payment schedules based on project milestones

For larger projects like the business bundle, I'm happy to work out a payment plan that fits your cash flow. The goal is to make it work for your business without causing financial stress.

I can discuss specific payment options during our consultation call. What kind of payment schedule would work best for your situation?`
  },

  'integration': {
    keywords: ['integrate', 'integration', 'existing systems', 'current systems', 'compatible', 'connect', 'work with'],
    response: `Yes. I specialise in integrating with existing systems so everything works together.

I can integrate with most popular business tools and platforms:
- CRM systems (Salesforce, HubHub, Pipedrive, etc.)
- Email marketing platforms (Mailchimp, Constant Contact, etc.)
- E-commerce platforms (Shopify, WooCommerce, Magento, etc.)
- Accounting software (QuickBooks, Xero, etc.)
- Project management tools (Asana, Trello, Monday.com, etc.)
- Social media platforms and scheduling tools
- Database systems and APIs

The key is understanding your current workflow and making the new automation enhance what you're already doing, not replace it. I'll work with your existing systems to create a smooth transition.

What systems are you currently using? I can tell you exactly how we can integrate with them.`
  },

  'business types': {
    keywords: ['types of businesses', 'businesses benefit', 'what businesses', 'which businesses', 'suitable for', 'what types', 'types of business', 'business types'],
    response: `Great question! AI automation works well for many different types of businesses, but some see particularly strong results:

Businesses that benefit most:
- E-commerce and online retail (inventory, customer service, order processing)
- Professional services (law firms, accounting, consulting - client management)
- Healthcare and wellness (appointment scheduling, patient communication)
- Real estate (lead qualification, property management, client follow-up)
- Marketing agencies (campaign management, client reporting)
- SaaS companies (user onboarding, support, data processing)
- Manufacturing and distribution (inventory, order processing, supplier communication)

The common thread is businesses with repetitive tasks, customer communication needs, or data processing requirements. If you're spending time on tasks that could be automated, you're a good candidate.

What type of business do you run? I can give you specific examples of how automation could help.`
  },

  'automation success': {
    keywords: ['measure automation success', 'automation success', 'how do you measure', 'success metrics', 'automation results', 'measure success', 'how measure', 'success measurement'],
    response: `I measure automation success through several key metrics that directly impact your business:

Primary success metrics:
- Time savings (hours per week/month saved)
- Error reduction (percentage decrease in mistakes)
- Cost savings (reduction in operational costs)
- Revenue increase (direct impact on sales/leads)
- Customer satisfaction (response times, accuracy)

Specific measurements I track:
- Response time improvements (from hours to minutes)
- Task completion rates (99%+ accuracy)
- Customer engagement increases
- Lead conversion improvements
- Employee productivity gains

I provide detailed monthly reports showing exactly how the automation is performing and where we can optimize further. Most clients see measurable improvements within the first 30 days.

What specific metrics matter most to your business? I can focus on tracking those.`
  },

  'integration timeline': {
    keywords: ['how long does integration take', 'integration timeline', 'integration duration', 'how long integration', 'how long take', 'integration time', 'how long', 'timeline integration'],
    response: `Integration timeline depends on the complexity of your existing systems and what we're connecting, but here's what you can expect:

Typical integration timelines:
- Simple integrations (single platform): 1-2 weeks
- Medium complexity (2-3 systems): 2-4 weeks  
- Complex integrations (multiple systems): 4-8 weeks
- Full business transformation: 8-12 weeks

Factors that affect timeline:
- Number of systems to integrate
- Data complexity and volume
- Custom requirements
- Testing and optimization needs
- Team training requirements

I always start with a quick assessment to give you an accurate timeline. The good news is that most integrations can be done without disrupting your current operations.

What systems are you looking to integrate? I can give you a more specific timeline.`
  },

  'workflow disruption': {
    keywords: ['disrupt my current workflow', 'workflow disruption', 'will this disrupt', 'current workflow', 'business disruption'],
    response: `No, I design integrations to fit your current workflow, not disrupt it. Here's how I keep changes smooth:

My approach to minimize disruption:
- Work with your existing processes first
- Implement changes gradually, not all at once
- Provide comprehensive training before going live
- Have backup plans and rollback options
- Test everything thoroughly before full deployment
- Provide ongoing support during the transition

What you can expect:
- Your current systems keep running during integration
- New automation works alongside existing processes
- Gradual rollout with training at each step
- 24/7 support during the transition period
- Quick fixes if anything doesn't work as expected

The goal is to make your life easier, not more complicated. Most clients find their workflow actually improves because they're spending less time on repetitive tasks.

What's your biggest concern about the transition? I can address it specifically.`
  },

  'examples': {
    keywords: ['show me examples', 'examples', 'case studies', 'show examples', 'can you show', 'examples of work'],
    response: `Absolutely! I'd be happy to show you some examples of my work. Here are a few case studies:

E-commerce Success Story:
- Client: Online fashion retailer
- Challenge: Manual order processing and customer service
- Solution: AI chatbot + automated order management
- Results: 200% increase in sales, 50% reduction in customer service time

Professional Services Example:
- Client: Law firm with 15 attorneys
- Challenge: Client intake and document processing
- Solution: Automated client onboarding + document management
- Results: 60% time savings, 99% accuracy in document processing

Healthcare Practice:
- Client: Medical practice with 3 locations
- Challenge: Appointment scheduling and patient communication
- Solution: AI scheduling system + automated patient reminders
- Results: 40% reduction in no-shows, 80% time savings on scheduling

I can provide more detailed case studies during our consultation call, including specific metrics and before/after comparisons.

Would you like to see examples relevant to your industry?`
  },

  'reporting frequency': {
    keywords: ['how often do you report', 'reporting frequency', 'report results', 'how often report', 'reporting schedule'],
    response: `I provide regular reporting to keep you informed about progress and results:

Reporting schedule:
- Weekly progress updates during implementation
- Monthly performance reports once live
- Quarterly strategy reviews
- Annual business impact assessment

What you get in each report:
- Key performance metrics and improvements
- Time and cost savings achieved
- Any issues or challenges and how they're being addressed
- Recommendations for further optimization
- Next steps and upcoming milestones

I also provide real-time dashboards where you can see live metrics and performance data. You'll have 24/7 access to see how your automation is performing.

The frequency can be adjusted based on your preferences - some clients prefer more frequent updates, others prefer monthly summaries.

What reporting frequency would work best for you?`
  },

  // Process and Timeline
  'process': {
    keywords: ['process', 'how it works', 'timeline', 'steps', 'workflow', 'methodology'],
    response: `Here's my proven process for delivering exceptional results:

**Phase 1: Discovery & Strategy (Week 1)**
• Free consultation to understand your goals
• Comprehensive business analysis
• Custom strategy development
• Clear roadmap with milestones

**Phase 2: Planning & Design (Week 2)**
• Detailed project planning
• Design and architecture decisions
• Resource allocation and timeline
• Client approval and sign-off

**Phase 3: Implementation (Weeks 3-8)**
• Expert execution with regular updates
• Weekly progress reports
• Client feedback integration
• Quality assurance and testing

**Phase 4: Launch & Optimization (Weeks 9-12)**
• System deployment and go-live
• Performance monitoring
• Initial optimization
• Training and handover

**Phase 5: Ongoing Support (Ongoing)**
• Continuous monitoring and optimization
• Regular performance reviews
• Strategic adjustments
• Long-term growth planning

**Timeline Expectations:**
• Initial results: 30 days
• Full optimization: 90 days
• Maximum ROI: 6 months

**Communication:**
• Weekly progress updates
• 24-hour response time
• Direct access to me
• Monthly strategy reviews

Ready to start your transformation journey?`
  },

  // Experience and Credentials
  'experience': {
    keywords: ['experience', 'background', 'qualifications', 'portfolio', 'clients', 'credentials', 'show me your experience', 'your experience', 'tell me about your experience'],
    response: `I'm Khamare Clarke, an AI Business Growth Specialist with extensive experience transforming businesses:

My Background:
- 5+ Years in AI automation and digital transformation
- 100+ Projects successfully delivered across various industries
- UK Specialized with deep understanding of UK business landscape
- Full-Stack Expertise in end-to-end solutions from strategy to implementation

Proven Results:
- 2-3x average ROI for clients
- 40% average efficiency improvement
- 99% client satisfaction rate
- 200% average lead generation increase

Industries I've Helped:
- E-commerce and retail
- Professional services (law, accounting, consulting)
- Healthcare and wellness
- Technology and SaaS
- Real estate and property
- Manufacturing and distribution

My Approach:
- Data-driven decision making
- Custom solutions, not one-size-fits-all
- Focus on measurable business outcomes
- Long-term partnership mindset

Certifications & Skills:
- AI and Machine Learning
- Web Development (React, Node.js, Python)
- Digital Marketing (Google Ads, Facebook, SEO)
- Business Process Optimization
- Project Management

Client Testimonials:
"Khamare transformed our business operations. We've saved 30 hours per week and increased revenue by 150%." - Sarah M., E-commerce Owner

Ready to see how I can help your business achieve similar results?`
  },

  // Contact and Getting Started
  'contact': {
    keywords: ['contact', 'get in touch', 'book', 'call', 'meeting', 'consultation', 'start', 'get started', 'how can i get started'],
    response: `Great! I'd love to help you get started. Here's how we can connect:

Phone: +44 7545 207 215
Email: systems@khamare.com
LinkedIn: linkedin.com/in/khamareclarke

The best way to start is with a free 30-minute strategy session where we can discuss your goals and see how I can help.

Here's what typically happens:
1. We have a free consultation to understand your needs
2. I create a custom strategy tailored to your business
3. I send you a detailed proposal with timeline and pricing
4. We implement the solution together
5. You see measurable growth in your business

Sound good? Would you like to book a call?`
  },

  'consultation prep': {
    keywords: ['prepare', 'consultation', 'what should i prepare', 'ready for call', 'before meeting'],
    response: `Good question! The consultation works best when you come prepared, but don't worry - it's not a test.

Before the call, it helps if you think about:
- What challenges your business is facing right now
- What specific goals you want to achieve
- Roughly what budget range you're working with
- When you'd like to get started
- Any systems or tools you're currently using

During our 30-minute call, we'll discuss:
- Your business objectives and current situation
- The main problems you're trying to solve
- Potential solutions that could work for you
- Investment options and what makes sense
- Next steps if we decide to work together

It's a casual conversation - no pressure. We can do it by video call or phone, whatever you prefer.

Ready to schedule?`
  },

  'timeline': {
    keywords: ['how quickly', 'timeline', 'how long', 'when can we start', 'duration', 'speed'],
    response: `Timeline depends on what you need, but here's what I typically see:

Quick wins (1-2 weeks):
- Basic AI automation setup
- Simple chatbot deployment
- Easy workflow automation

Standard projects (2-4 weeks):
- Website development
- Digital marketing setup
- Business process automation

Complex projects (4-8 weeks):
- Full business transformation
- Custom app development
- Advanced AI integration

The good news is we can start immediately with a free consultation. I can usually fit in a strategy session this week, and we can often get some quick wins rolling by next week.

What kind of timeline are you thinking?`
  },

  'availability': {
    keywords: ['availability', 'when available', 'schedule', 'calendar', 'booking'],
    response: `I'm pretty flexible with scheduling. Here's my typical availability:

Monday to Friday: 9 AM - 6 PM GMT
Saturday: 10 AM - 2 PM GMT
Sunday: I usually take the day off

For consultations, I prefer:
- Morning slots: 9 AM - 12 PM
- Afternoon slots: 2 PM - 5 PM
- Evening slots: 6 PM - 7 PM (though these are limited)

You can book through my online calendar, give me a call directly, send an email, or message me on LinkedIn - whatever works best for you.

I can usually fit people in within 24-48 hours, sometimes even same day if it's urgent.

What works best for your schedule?`
  },

  'success rate': {
    keywords: ['success rate', 'results', 'achievements', 'track record', 'performance'],
    response: `I'm proud of the results I've been able to deliver for my clients. Here are some of the numbers:

Success metrics:
- 95% client satisfaction rate
- 40% average efficiency improvement
- 60% reduction in manual tasks
- 3x ROI within 6 months

Key achievements:
- 50+ successful projects completed
- Over £2M in client savings generated
- 99% project completion rate
- 5-star average rating from clients

Some specific client results:
- E-commerce clients: 200% sales increase on average
- Service businesses: 50% time savings
- Marketing campaigns: 300% lead generation improvement
- Operations: 80% process automation

I've had clients tell me things like "Khamare transformed our business in 3 months" and "Best investment we ever made." It's really rewarding to see the impact.

Would you like to see some specific case studies?`
  },

  // Default responses
  'greeting': {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
    response: `Hi there! I'm Khamare's assistant. Nice to meet you!

I help businesses with:
- AI automation and business process optimization
- Web and app development
- Digital marketing and lead generation
- Analytics and business growth

What can I help you with today?`
  },

  'help': {
    keywords: ['help', 'what can you do', 'assistance', 'support', 'options'],
    response: `I'm here to help you learn about Khamare's services and how they can benefit your business!

**I can help you with:**
• **Services**: Detailed information about AI automation, web development, and digital marketing
• **Pricing**: Investment options and what to expect
• **Process**: How we work together and timeline expectations
• **Experience**: Khamare's background, results, and client success stories
• **Getting Started**: How to book a consultation and what happens next

**Popular Questions:**
• "What services do you offer?"
• "How much does it cost?"
• "What's your process?"
• "How can I get started?"
• "What results can I expect?"

**Quick Tips:**
• Be specific about your business needs
• Ask about timelines and expectations
• Request case studies or examples
• Inquire about ongoing support

What would you like to know more about?`
  },

  'default': {
    keywords: [],
    response: `That's a great question! I can help you with information about:

- Services and capabilities
- Pricing and investment options
- Process and timeline
- How to get started

For specific details about your situation, I'd recommend booking a free consultation call where we can discuss your needs in detail.

What interests you most?`
  }
};

export async function POST(request) {
  try {
    const { message, context = [], userInfo = {} } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Advanced conversation analysis
    const conversationHistory = context.map(msg => msg.content).join(' ');
    const fullContext = `${conversationHistory} ${message}`.toLowerCase();
    const userMessages = context.filter(msg => msg.role === 'user');
    const conversationLength = userMessages.length;
    
    // Detect user intent and sentiment
    const intent = detectUserIntent(message, fullContext);
    const sentiment = analyzeSentiment(message);
    const urgency = detectUrgency(message, fullContext);
    
    // Advanced response selection with AI-like intelligence
    let bestResponse = knowledgeBase.default.response;
    let bestScore = 0;
    let matchedCategory = 'default';
    let confidence = 0.3;

    // Multi-layered response matching with improved keyword detection
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (category === 'default') continue;
      
      let score = 0;
      
      // Direct message keyword matching (highest priority)
      const messageLower = message.toLowerCase();
      score += data.keywords.reduce((acc, keyword) => {
        if (messageLower.includes(keyword.toLowerCase())) {
          return acc + 3; // Higher weight for direct message matches
        }
        return acc;
      }, 0);
      
      // Full context keyword matching
      score += data.keywords.reduce((acc, keyword) => {
        if (fullContext.includes(keyword.toLowerCase())) {
          return acc + 1;
        }
        return acc;
      }, 0);
      
      // Intent-based scoring
      if (intent.category === category) {
        score += 2;
      }
      
      // Conversation flow analysis
      if (conversationLength > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1]?.content?.toLowerCase() || '';
        if (data.keywords.some(keyword => lastUserMessage.includes(keyword.toLowerCase()))) {
          score += 1;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestResponse = data.response;
        matchedCategory = category;
        confidence = Math.min(score / 5, 1);
      }
    }

    // Advanced response enhancement
    let enhancedResponse = bestResponse;
    
    // Personalization based on conversation
    enhancedResponse = personalizeResponse(enhancedResponse, userInfo, conversationLength);
    
    // Add intelligent contextual enhancements
    enhancedResponse = addContextualEnhancements(enhancedResponse, context, intent, sentiment, urgency);
    
    // Dynamic conversation flow
    enhancedResponse = addDynamicFlow(enhancedResponse, conversationLength, matchedCategory);
    
    // Add smart call-to-actions
    enhancedResponse = addSmartCTAs(enhancedResponse, intent, urgency, conversationLength);

    // Simulate realistic AI thinking time
    const thinkingTime = 200 + Math.random() * 600 + (confidence * 200);
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    // Generate intelligent follow-up suggestions
    const followUpSuggestions = generateIntelligentSuggestions(matchedCategory, message, intent, conversationLength);
    
    // Generate conversation insights
    const insights = generateConversationInsights(intent, sentiment, urgency, conversationLength);

    return NextResponse.json({
      response: enhancedResponse,
      timestamp: new Date().toISOString(),
      category: matchedCategory,
      confidence: confidence,
      suggestions: followUpSuggestions,
      thinkingTime: Math.round(thinkingTime),
      insights: insights,
      intent: intent,
      sentiment: sentiment,
      urgency: urgency,
      conversationStage: getConversationStage(conversationLength),
      nextBestAction: getNextBestAction(intent, conversationLength),
      debug: {
        message: message,
        matchedCategory: matchedCategory,
        bestScore: bestScore,
        intent: intent
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Advanced AI functions
function detectUserIntent(message, context) {
  const messageLower = message.toLowerCase();
  
  // More specific keyword matching first
  if (messageLower.includes('payment plan') || messageLower.includes('installment') || messageLower.includes('monthly payment')) {
    return { category: 'payment plans', confidence: 0.9, type: 'inquiry' };
  }
  if (messageLower.includes('business bundle') || messageLower.includes('what\'s included') || messageLower.includes('bundle')) {
    return { category: 'business bundle', confidence: 0.9, type: 'inquiry' };
  }
  if (messageLower.includes('custom quote') || messageLower.includes('personalized quote') || messageLower.includes('specific quote')) {
    return { category: 'custom quote', confidence: 0.9, type: 'inquiry' };
  }
  if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('budget') || messageLower.includes('how much')) {
    return { category: 'pricing', confidence: 0.9, type: 'inquiry' };
  }
  if (messageLower.includes('start') || messageLower.includes('begin') || messageLower.includes('get started')) {
    return { category: 'contact', confidence: 0.9, type: 'action' };
  }
  if (messageLower.includes('how') && (messageLower.includes('quick') || messageLower.includes('long'))) {
    return { category: 'timeline', confidence: 0.8, type: 'inquiry' };
  }
  if (messageLower.includes('prepare') || messageLower.includes('ready')) {
    return { category: 'consultation prep', confidence: 0.8, type: 'preparation' };
  }
  if (messageLower.includes('available') || messageLower.includes('schedule')) {
    return { category: 'availability', confidence: 0.8, type: 'scheduling' };
  }
  if (messageLower.includes('show me your experience') || messageLower.includes('your experience') || messageLower.includes('tell me about your experience')) {
    return { category: 'experience', confidence: 0.9, type: 'credibility' };
  }
  if (messageLower.includes('success') || messageLower.includes('results') || messageLower.includes('rate')) {
    return { category: 'success rate', confidence: 0.8, type: 'credibility' };
  }
  if (messageLower.includes('service') || messageLower.includes('offer') || messageLower.includes('do')) {
    return { category: 'services', confidence: 0.7, type: 'exploration' };
  }
  if (messageLower.includes('process') || messageLower.includes('work') || messageLower.includes('method')) {
    return { category: 'process', confidence: 0.7, type: 'exploration' };
  }
  if (messageLower.includes('types of businesses') || messageLower.includes('businesses benefit') || messageLower.includes('what businesses')) {
    return { category: 'business types', confidence: 0.9, type: 'inquiry' };
  }
  if (messageLower.includes('measure automation success') || messageLower.includes('automation success') || messageLower.includes('how do you measure')) {
    return { category: 'automation success', confidence: 0.9, type: 'inquiry' };
  }
  if (messageLower.includes('how long does integration take') || messageLower.includes('integration timeline') || messageLower.includes('integration duration')) {
    return { category: 'integration timeline', confidence: 0.9, type: 'inquiry' };
  }
  if (messageLower.includes('disrupt my current workflow') || messageLower.includes('workflow disruption') || messageLower.includes('will this disrupt')) {
    return { category: 'workflow disruption', confidence: 0.9, type: 'concern' };
  }
  if (messageLower.includes('integrate') || messageLower.includes('integration') || messageLower.includes('existing systems') || messageLower.includes('current systems')) {
    return { category: 'integration', confidence: 0.9, type: 'technical' };
  }
  if (messageLower.includes('ai') || messageLower.includes('automation')) {
    return { category: 'ai automation', confidence: 0.8, type: 'specific_interest' };
  }
  
  return { category: 'default', confidence: 0.3, type: 'general' };
}

function analyzeSentiment(message) {
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'fantastic', 'wonderful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointed'];
  const urgentWords = ['urgent', 'asap', 'immediately', 'quickly', 'fast', 'emergency'];
  
  const messageLower = message.toLowerCase();
  
  let sentiment = 'neutral';
  let urgency = 'normal';
  
  if (positiveWords.some(word => messageLower.includes(word))) {
    sentiment = 'positive';
  } else if (negativeWords.some(word => messageLower.includes(word))) {
    sentiment = 'negative';
  }
  
  if (urgentWords.some(word => messageLower.includes(word))) {
    urgency = 'high';
  }
  
  return { sentiment, urgency };
}

function detectUrgency(message, context) {
  const urgentIndicators = ['urgent', 'asap', 'immediately', 'quickly', 'fast', 'emergency', 'today', 'this week'];
  const messageLower = message.toLowerCase();
  
  const urgencyScore = urgentIndicators.reduce((score, indicator) => {
    return score + (messageLower.includes(indicator) ? 1 : 0);
  }, 0);
  
  if (urgencyScore >= 2) return 'high';
  if (urgencyScore >= 1) return 'medium';
  return 'low';
}

function personalizeResponse(response, userInfo, conversationLength) {
  let personalized = response;
  
  // Add personalization based on conversation length
  if (conversationLength > 3) {
    personalized = personalized.replace('Ready to', 'Based on our conversation, ready to');
  }
  
  if (conversationLength > 5) {
    personalized += '\n\n**🤝 I appreciate your continued interest!** Let\'s move forward with a personalized strategy.';
  }
  
  return personalized;
}

function addContextualEnhancements(response, context, intent, sentiment, urgency) {
  let enhanced = response;
  
  // Add urgency-based enhancements
  if (urgency === 'high') {
    enhanced += '\n\nI can prioritize your project and get started within 24-48 hours if it\'s urgent.';
  }
  
  // Add sentiment-based enhancements
  if (sentiment === 'positive') {
    enhanced += '\n\nI\'m excited to work with you! Your enthusiasm is great to see.';
  } else if (sentiment === 'negative') {
    enhanced += '\n\nI understand your concerns. Let me show you how I can address them directly.';
  }
  
  // Add intent-based enhancements
  if (intent.type === 'action') {
    enhanced += '\n\nPerfect! Let\'s get you started immediately.';
  } else if (intent.type === 'credibility') {
    enhanced += '\n\nHere are the specific results I\'ve delivered for clients:';
  }
  
  return enhanced;
}

function addDynamicFlow(response, conversationLength, category) {
  let enhanced = response;
  
  if (conversationLength === 0) {
    enhanced += '\n\nWelcome! What would you like to explore first?';
  } else if (conversationLength === 1) {
    enhanced += '\n\nGreat question! What else would you like to know?';
  } else if (conversationLength >= 2 && conversationLength < 4) {
    enhanced += '\n\nI can see you\'re serious about this. Let\'s dive deeper into your specific needs.';
  } else if (conversationLength >= 4) {
    enhanced += '\n\nBased on our conversation, I\'d love to discuss your specific needs in a free consultation call.';
  }
  
  return enhanced;
}

function addSmartCTAs(response, intent, urgency, conversationLength) {
  let enhanced = response;
  
  if (intent.type === 'action' || urgency === 'high') {
    enhanced += '\n\nReady to book your free call? I can usually fit you in within 24-48 hours.';
  } else if (conversationLength >= 3) {
    enhanced += '\n\nReady to move forward? Book a free consultation to discuss your specific needs.';
  } else {
    enhanced += '\n\nWhat would you like to explore next?';
  }
  
  return enhanced;
}

function generateIntelligentSuggestions(category, message, intent, conversationLength) {
  // Always return the same general suggestions
  return [
    "What's included in the business bundle?",
    "Do you offer payment plans?",
    "Can I get a custom quote?"
  ];
}

function generateConversationInsights(intent, sentiment, urgency, conversationLength) {
  return {
    userEngagement: conversationLength > 2 ? 'high' : 'medium',
    interestLevel: intent.confidence > 0.7 ? 'high' : 'medium',
    readinessToBuy: conversationLength > 3 ? 'high' : 'medium',
    preferredCommunication: urgency === 'high' ? 'immediate' : 'scheduled'
  };
}

function getConversationStage(conversationLength) {
  if (conversationLength === 0) return 'initial';
  if (conversationLength <= 2) return 'exploration';
  if (conversationLength <= 4) return 'consideration';
  return 'decision';
}

function getNextBestAction(intent, conversationLength) {
  if (conversationLength >= 3) return 'schedule_consultation';
  if (intent.type === 'action') return 'provide_contact_info';
  if (intent.type === 'credibility') return 'share_case_studies';
  return 'continue_education';
}

function generateFollowUpSuggestions(category, message) {
  const suggestions = {
    'services': [
      "How much does web development cost?",
      "Can you show me examples of your work?",
      "What's your process for AI automation?"
    ],
    'pricing': [
      "What's included in the business bundle?",
      "Do you offer payment plans?",
      "Can I get a custom quote?"
    ],
    'business bundle': [
      "Can I get a custom quote?",
      "Do you offer payment plans?",
      "How quickly can we get started?"
    ],
    'custom quote': [
      "What's included in the business bundle?",
      "Do you offer payment plans?",
      "How quickly can we get started?"
    ],
    'payment plans': [
      "What's included in the business bundle?",
      "Can I get a custom quote?",
      "How quickly can we get started?"
    ],
    'process': [
      "How long does a typical project take?",
      "What happens after the consultation?",
      "Do you provide ongoing support?"
    ],
    'contact': [
      "What should I prepare for the consultation?",
      "How quickly can we get started?",
      "What's your availability like?"
    ],
    'consultation prep': [
      "How quickly can we get started?",
      "What's your availability like?",
      "What happens after the consultation?"
    ],
    'timeline': [
      "What should I prepare for the consultation?",
      "What's your availability like?",
      "Can we start this week?"
    ],
    'availability': [
      "What should I prepare for the consultation?",
      "How quickly can we get started?",
      "Can we book a call today?"
    ],
    'success rate': [
      "Can you show me case studies?",
      "What makes you different?",
      "Do you work with businesses like mine?"
    ],
    'ai automation': [
      "What types of businesses benefit most?",
      "How do you measure automation success?",
      "Can you integrate with my existing systems?"
    ],
    'integration': [
      "What systems do you work with?",
      "How long does integration take?",
      "Will this disrupt my current workflow?"
    ],
    'business types': [
      "What type of business do you work with?",
      "Do you have examples for my industry?",
      "How quickly can we get started?"
    ],
    'automation success': [
      "What metrics do you track?",
      "How often do you report results?",
      "Can you show me examples?"
    ],
    'integration timeline': [
      "What affects the timeline?",
      "Can you work faster if needed?",
      "What happens during integration?"
    ],
    'workflow disruption': [
      "How do you minimize disruption?",
      "What support do you provide?",
      "Can I test before going live?"
    ],
    'default': [
      "Tell me more about your experience",
      "What makes you different from competitors?",
      "Do you work with businesses like mine?"
    ]
  };

  return suggestions[category] || suggestions['default'];
}
