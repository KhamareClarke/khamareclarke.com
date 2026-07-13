import { SERVICES, ALL_LOCATIONS } from '../lib/services-data'
// GLOSSARY_TERMS is imported lazily so build works before glossary-data.js is written
let GLOSSARY_TERMS = []
try { ({ GLOSSARY_TERMS } = require('../lib/glossary-data')) } catch (_) {}

const BASE_URL = 'https://khamareclarke.com'
const NOW = new Date().toISOString()

const BLOG_SLUGS = [
  'seo-didnt-die-it-expanded',
  'wordpress-real-ceiling',
  'shopify-local-seo-limits',
  'wix-2026-honest-review',
  'ai-agent-standard-as-phone-number',
  'test-yourself-chatgpt-seo',
  'ai-chatbots-save-uk-trades',
]

const EXPERTISE_SLUGS = [
  'seo',
  'ai-search-optimisation',
  'programmatic-seo',
  'ai-agents',
  'google-ads-api',
  'ai-consultant',
  'ai-implementation',
  'digital-marketing',
  'web-design-development',
  'marketing-automation',
  'ai-content-systems',
  'google-ranking',
]

export default function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: NOW, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/locations`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/case-studies`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/business-bundle`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.8 },
    ...BLOG_SLUGS.map(slug => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    ...EXPERTISE_SLUGS.map(slug => ({
      url: `${BASE_URL}/expertise/${slug}`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ]

  const serviceHubPages = SERVICES.map(service => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const serviceLocationPages = SERVICES.flatMap(service =>
    ALL_LOCATIONS.map(location => ({
      url: `${BASE_URL}/services/${service.slug}/${location.slug}`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: location.tier === 1 ? 0.75 : location.tier === 2 ? 0.65 : 0.55,
    }))
  )

  const glossaryPages = [
    { url: `${BASE_URL}/glossary`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.75 },
    ...GLOSSARY_TERMS.map(term => ({
      url: `${BASE_URL}/glossary/${term.slug}`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.65,
    })),
  ]

  return [...staticPages, ...serviceHubPages, ...serviceLocationPages, ...glossaryPages]
}
