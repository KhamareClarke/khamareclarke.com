import { NextResponse } from 'next/server';

// Enhanced knowledge base with more comprehensive responses
const knowledgeBase = {
  // Services
  'services': {
    keywords: ['services', 'what do you do', 'what do you offer', 'provide', 'capabilities', 'what services', 'your services'],
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

Most of that work is repetitive by nature, which is what makes it worth automating.

What changes depends on the business, so I don't quote savings figures here. On a call I'll tell you plainly what is worth automating in yours, and what is not worth the effort.

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
• Fast loading times
• Built to be found in search, including AI assistants
• Mobile-first responsive design
• Analytics and conversion tracking
• Hosting, security and ongoing maintenance within the managed service

I don't publish percentage improvements here. Where I have documented results, they are on the site with the client named.

Ready to discuss your web development needs?`
  },

  'digital marketing': {
    keywords: ['digital marketing', 'marketing', 'seo', 'lead generation', 'social media', 'growth'],
    response: `I work on the parts of marketing that can be measured: search visibility, enquiries, and where they come from:

**My Marketing Services:**
• **Lead Generation**: Proven strategies to attract qualified prospects
• **SEO Optimization**: Higher Google rankings and organic traffic
• **Social Media Marketing**: Engaging content and community building
• **Email Marketing**: Automated nurturing and conversion campaigns
• **Content Marketing**: Valuable content that builds authority
• **Paid Advertising**: Strategic PPC and social media ads

**My Approach:**
1. **Strategy**: Plans built on what your numbers already show
2. **Implementation**: The work done, not a slide deck
3. **Optimisation**: Continuous testing and adjustment
4. **Reporting**: A monthly report covering enquiries, response times and search visibility

I don't publish lead or traffic percentages here. Results depend on the market and the starting point, and I would rather show you documented work than a headline figure.

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
    keywords: ['pricing', 'cost', 'price', 'how much', 'budget', 'investment', 'rates', 'worth', 'value for money'],
    response: `Pricing is straightforward. There are three things, and only one of them varies:

- **Managed Business Systems**: £999 per month. One integrated service covering the build and the ongoing management.
- **Paid Consultancy**: £250 per session, including a concise written action summary.
- **Bespoke Software**: individually quoted, because the scope varies.

Bespoke software is the only separately quoted piece. It is not part of the £999 monthly service.

For an accurate answer on your own situation, the best step is a free 30-minute introductory call. Would you like to book one?`
  },

  'business bundle': {
    keywords: ['business bundle', 'bundle', 'package', 'what\'s included', 'comprehensive', 'full service', 'whats included', 'included in', 'bundle include'],
    response: `The Business Bundle is the £999 per month managed service — the same service described on the homepage.

What it covers:
- A bespoke website, built or rebuilt
- An AI chatbot, plus an AI voice receptionist or WhatsApp agent
- Your Google Business Profile and local SEO
- Enquiry capture through to your CRM, with automated follow-up and booking
- Analytics and a monthly report
- Hosting, security and ongoing management

Bespoke software is not included. Applications and custom builds are scoped and quoted separately.

Would you like to discuss what this would look like for your business?`
  },

  'custom quote': {
    keywords: ['custom quote', 'personalized quote', 'specific quote', 'tailored pricing', 'individual quote', 'bespoke', 'bespoke software', 'custom software', 'custom development', 'software quote', 'quoted', 'custom app', 'custom web app'],
    response: `Bespoke software is quoted individually, because the scope varies from one build to the next.

To give you an accurate figure, I'd need to understand:
- What the software needs to do
- How it fits with the systems you already run
- Who will use it, and how often
- When you need it

To be clear about the distinction: the managed service is £999 per month and priced separately. Anything that needs building beyond that service is quoted on its own.

The best first step is a free 30-minute introductory call. Would you like to book one?`
  },

  'payment plans': {
    keywords: ['payment plans', 'installments', 'monthly payments', 'financing', 'payment options', 'split payments', 'do you offer payment', 'payment schedule', 'pay monthly'],
    response: `The managed service is one monthly fee of £999, billed monthly. There are no separate invoices for the individual pieces of the system.

I don't publish other payment structures here. Anything outside the standard monthly arrangement is agreed in writing before work starts.

Would you like to book a free 30-minute introductory call to go through it?`
  },

  'discounts': {
    keywords: ['discount', 'cheaper', 'reduce the price', 'knock off', 'any deals', 'special price'],
    response: `There are no discounts published. The managed service is £999 per month, and the advisory session is £250.

If the price is the barrier, say so on the call. I would rather tell you honestly whether it is worth doing at all than invent a special price here.

Would you like to book a free 30-minute introductory call?`
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
- Response times on enquiries
- Task completion, and where things stall
- Enquiry-to-conversation rates
- Team time released from repetitive work

I provide a monthly report showing how the system is performing and where it needs adjusting. What that adds up to depends on the business, so I don't put a figure on it here.

What specific metrics matter most to your business? I can tell you what is worth measuring.`
  },

  'integration timeline': {
    keywords: ['how long does integration take', 'integration timeline', 'integration duration', 'how long integration', 'how long take', 'integration time', 'how long', 'timeline integration'],
    response: `It depends entirely on what needs connecting, so I won't put week counts on it here. Anyone quoting a fixed integration timeline before seeing your systems is guessing.

What drives it:
- How many systems are involved
- How clean the data is
- What has to be built rather than connected
- How much testing the business needs
- Team training

I start by assessing what you already run, and only then do I commit to a date. Most integrations happen without interrupting the day-to-day.

What systems are you looking to integrate?`
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
- A gradual rollout, with training at each step
- Support by phone and email during business hours while it goes in
- Problems fixed properly rather than worked around

The goal is to make your life easier, not more complicated. Most clients find their workflow actually improves because they're spending less time on repetitive tasks.

What's your biggest concern about the transition? I can address it specifically.`
  },

  'examples': {
    keywords: ['show me examples', 'examples', 'case studies', 'show examples', 'can you show', 'examples of work'],
    response: `I have documented results for work across roofing, legal, logistics, dental, automotive and real estate. Each one names the client, and I can take you through any of them.

I don't publish percentage figures in chat. A number without the context behind it is not evidence, and I would rather show you the systems themselves.

The best way to see whether this applies to your business is a free 30-minute introductory call, where we can look at the examples closest to your situation.

Would you like to book one?`
  },

  'reporting frequency': {
    keywords: ['how often do you report', 'reporting frequency', 'report results', 'how often report', 'reporting schedule'],
    response: `I provide regular reporting to keep you informed about progress and results:

Reporting schedule:
- Updates as the build progresses
- A monthly report once live
- Anything urgent raised as soon as I see it, rather than saved for the report

What the monthly report covers:
- Enquiries received, and how quickly they were answered
- Search visibility
- What has been changed or fixed that month
- What I recommend doing next

You also have a live dashboard, available whenever you want to look at it. Human support runs in business hours.

The schedule can flex to suit you, though most clients settle on monthly.

What reporting would be most useful to you?`
  },

  // Process and Timeline
  'process': {
    keywords: ['process', 'how it works', 'timeline', 'steps', 'workflow', 'methodology'],
    response: `Here's how the work runs:

**1. Assessment**
• I look at what you already run: website, CRM, inbox, phone, and the spreadsheets holding it together
• We agree what is worth fixing first, and what is not worth touching

**2. Build**
• The build goes in stage by stage
• You see it as it comes together, rather than all at the end

**3. Handover**
• Documentation in plain English
• Your team trained on how it works
• A 45-minute handover call

**4. Ongoing management**
• Hosting, security and monitoring
• Google Business Profile and local SEO upkeep
• CRM and follow-up tuning
• A monthly report on enquiries, response times and search visibility

I don't promise result dates. I commit to delivery dates once I've seen your systems. Anything before that is a guess.

Ready to get started?`
  },

  // Experience and Credentials
  'experience': {
    keywords: ['experience', 'background', 'qualifications', 'portfolio', 'clients', 'credentials', 'show me your experience', 'your experience', 'tell me about your experience'],
    response: `I'm Khamare Clarke, an AI Implementation Specialist.

My Background:
- Twelve years in software engineering, artificial intelligence and machine learning
- Worked as an AI Solution Architect and a Google Cloud Engineer
- MSc in Computer Science and AI at Keele University, finishing in 2027
- Based in Stoke-on-Trent, working with businesses across the UK

What I do: I build and connect the systems a business runs on. Website, search visibility, enquiry handling, CRM, automation and reporting. Then I document it and hand it over, so the team can run it without me.

On results: I don't publish headline percentages here. Where I have documented results, they are on the site with the client named, and I can walk you through any of them on a call.

Industries I've Helped:
- E-commerce and retail
- Professional services (law, accounting, consulting)
- Healthcare and wellness
- Technology and SaaS
- Real estate and property
- Manufacturing and distribution

My Approach:
- Decisions based on what your numbers show
- Built for your business, not a template
- Measurable outcomes, or I'll say so
- A working relationship, not a one-off handover

Certifications & Skills:
- AI and Machine Learning
- Web Development (React, Node.js, Python)
- Digital Marketing (Google Ads, Facebook, SEO)
- Business Process Optimization
- Project Management

Would you like to book a free 30-minute introductory call?`
  },

  // Contact and Getting Started
  'contact': {
    keywords: ['contact', 'get in touch', 'book', 'call', 'meeting', 'consultation', 'start', 'get started', 'how can i get started'],
    response: `Good. Here's how we connect:

Phone: +44 7473 255 886
Email: info@khamareclarke.com
LinkedIn: linkedin.com/in/khamareclarke

The best way to start is a free 30-minute introductory call. It's a conversation about your business, not a pitch.

Here's what typically happens:
1. We have the introductory call and I learn how the business runs
2. I tell you whether the managed service fits, and what it would involve
3. If it does, I send a proposal covering the scope and the price
4. We agree a start date and the build begins
5. After handover, management continues month to month

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
    response: `It depends on what needs doing, and I would rather give you a real answer than a generic one.

What I can tell you: the assessment comes first. I look at your systems, then commit to dates based on what I find. I don't publish a standard timeline, because a business with five systems and a business with one need different things.

Nothing starts until you have seen the plan and agreed it.

The first step is a free 30-minute introductory call. Would you like to book one?`
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

You can book through my online calendar, call directly, send an email, or message me on LinkedIn. The calendar shows what is actually free, so that is the quickest route.

What works best for your schedule?`
  },

  'success rate': {
    keywords: ['success rate', 'results', 'achievements', 'track record', 'performance'],
    response: `I keep published claims to what I can evidence.

Rather than quote percentages here, the honest answer is that results depend on the business, the market and the starting point. I would rather show you documented work than a headline figure.

What I can do instead:
- Walk you through systems I have built, with the client named
- Tell you plainly whether the managed service fits your situation
- Say so if it doesn't

Would you like to book a free 30-minute introductory call?`
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
  if (messageLower.includes('discount') || messageLower.includes('cheaper') || messageLower.includes('reduce the price') || messageLower.includes('any deals')) {
    return { category: 'discounts', confidence: 0.9, type: 'objection' };
  }
  if (messageLower.includes('business bundle') || messageLower.includes('what\'s included') || messageLower.includes('bundle')) {
    return { category: 'business bundle', confidence: 0.9, type: 'inquiry' };
  }
  if (messageLower.includes('custom quote') || messageLower.includes('personalized quote') || messageLower.includes('specific quote') || messageLower.includes('bespoke') || messageLower.includes('custom software') || messageLower.includes('custom development') || messageLower.includes('custom app') || messageLower.includes('custom web app')) {
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
    enhanced += '\n\nIf it is urgent, say so on the call and I will tell you honestly what can be moved forward and what cannot.';
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
    enhanced += '\n\nHere is what I can tell you about how I work:';
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
    enhanced += '\n\nReady to book your free 30-minute introductory call? The calendar shows what is available.';
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
    "How does the monthly service work?",
    "Can I get bespoke software quoted?"
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
      "How much does the service cost?",
      "Can you show me examples of your work?",
      "What's your process for AI automation?"
    ],
    'pricing': [
      "What's included in the business bundle?",
      "How does the monthly service work?",
      "Can I get a custom quote?"
    ],
    'business bundle': [
      "Can I get a custom quote?",
      "How does the monthly service work?",
      "How quickly can we get started?"
    ],
    'custom quote': [
      "What's included in the business bundle?",
      "How does the monthly service work?",
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
      "What happens after the introductory call?"
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
