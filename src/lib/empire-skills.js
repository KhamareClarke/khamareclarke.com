/**
 * Empire autonomous agent set — 29-agent structure (directive: MASTER_GENERAL_01).
 * Covers GROWTH_TEAM, SALES_TEAM, OPS_TEAM, INTEL_TEAM from config/teams.json.
 */
const REPO_BASE = 'https://github.com/coreyhaines31/marketingskills/tree/main/skills';

export const EMPIRE_SKILLS = [
  { id: 'ai-seo', label: 'AI SEO', repoUrl: `${REPO_BASE}/ai-seo` },
  { id: 'seo-audit', label: 'SEO Audit', repoUrl: `${REPO_BASE}/seo-audit` },
  { id: 'keyword-research', label: 'Keyword Research', repoUrl: `${REPO_BASE}/keyword-research` },
  { id: 'backlink-builder', label: 'Backlink Builder', repoUrl: `${REPO_BASE}/backlink-builder` },
  { id: 'site-speed-optimizer', label: 'Site Speed Optimizer', repoUrl: `${REPO_BASE}/site-speed-optimizer` },
  { id: 'content-refresh', label: 'Content Refresh', repoUrl: `${REPO_BASE}/content-refresh` },
  { id: 'meta-tag-master', label: 'Meta Tag Master', repoUrl: `${REPO_BASE}/meta-tag-master` },
  { id: 'technical-seo', label: 'Technical SEO', repoUrl: `${REPO_BASE}/technical-seo` },
  { id: 'lead-gen', label: 'Lead Gen', repoUrl: `${REPO_BASE}/lead-gen` },
  { id: 'cold-email', label: 'Cold Email', repoUrl: `${REPO_BASE}/cold-email` },
  { id: 'email-sequence', label: 'Email Sequence', repoUrl: `${REPO_BASE}/email-sequence` },
  { id: 'sales-copy', label: 'Sales Copy', repoUrl: `${REPO_BASE}/sales-copy` },
  { id: 'crm-sync', label: 'CRM Sync', repoUrl: `${REPO_BASE}/crm-sync` },
  { id: 'linkedin-outreach', label: 'LinkedIn Outreach', repoUrl: `${REPO_BASE}/linkedin-outreach` },
  { id: 'ad-copy-generator', label: 'Ad Copy Generator', repoUrl: `${REPO_BASE}/ad-copy-generator` },
  { id: 'onboarding-cro', label: 'Onboarding CRO', repoUrl: `${REPO_BASE}/onboarding-cro` },
  { id: 'signup-flow-cro', label: 'Signup Flow CRO', repoUrl: `${REPO_BASE}/signup-flow-cro` },
  { id: 'ux-audit', label: 'UX Audit', repoUrl: `${REPO_BASE}/ux-audit` },
  { id: 'page-cro', label: 'Page CRO', repoUrl: `${REPO_BASE}/page-cro` },
  { id: 'customer-support-bot', label: 'Customer Support Bot', repoUrl: `${REPO_BASE}/customer-support-bot` },
  { id: 'bug-hunter', label: 'Bug Hunter', repoUrl: `${REPO_BASE}/bug-hunter` },
  { id: 'form-optimizer', label: 'Form Optimizer', repoUrl: `${REPO_BASE}/form-optimizer` },
  { id: 'copy-editing', label: 'Copy Editing', repoUrl: `${REPO_BASE}/copy-editing` },
  { id: 'competitor-intel', label: 'Competitor Intel', repoUrl: `${REPO_BASE}/competitor-intel` },
  { id: 'market-analysis', label: 'Market Analysis', repoUrl: `${REPO_BASE}/market-analysis` },
  { id: 'brand-voice-check', label: 'Brand Voice Check', repoUrl: `${REPO_BASE}/brand-voice-check` },
  { id: 'social-media-post', label: 'Social Media Post', repoUrl: `${REPO_BASE}/social-media-post` },
  { id: 'review-manager', label: 'Review Manager', repoUrl: `${REPO_BASE}/review-manager` },
  { id: 'legal-compliance', label: 'Legal Compliance', repoUrl: `${REPO_BASE}/legal-compliance` },
  { id: 'copywriting', label: 'Copywriting', repoUrl: `${REPO_BASE}/copywriting` },
  { id: 'marketing-ideas', label: 'Marketing Ideas', repoUrl: `${REPO_BASE}/marketing-ideas` },
  { id: 'ad-creative', label: 'Ad Creative', repoUrl: `${REPO_BASE}/ad-creative` },
  { id: 'competitor-alternatives', label: 'Competitor & Alternatives', repoUrl: `${REPO_BASE}/competitor-alternatives` },
  { id: 'social-content', label: 'Social Content', repoUrl: `${REPO_BASE}/social-content` },
  { id: 'product-marketing-context', label: 'Product Marketing Context', repoUrl: `${REPO_BASE}/product-marketing-context` },
  { id: 'pricing-strategy', label: 'Pricing Strategy', repoUrl: `${REPO_BASE}/pricing-strategy` },
  { id: 'programmatic-seo', label: 'Programmatic SEO', repoUrl: `${REPO_BASE}/programmatic-seo` },
  { id: 'content-strategy', label: 'Content Strategy', repoUrl: `${REPO_BASE}/content-strategy` },
  { id: 'schema-markup', label: 'Schema Markup', repoUrl: `${REPO_BASE}/schema-markup` },
  { id: 'analytics-tracking', label: 'Analytics & Tracking', repoUrl: `${REPO_BASE}/analytics-tracking` },
  { id: 'form-cro', label: 'Form CRO', repoUrl: `${REPO_BASE}/form-cro` },
  { id: 'paywall-upgrade-cro', label: 'Paywall & Upgrade CRO', repoUrl: `${REPO_BASE}/paywall-upgrade-cro` },
  { id: 'popup-cro', label: 'Popup CRO', repoUrl: `${REPO_BASE}/popup-cro` },
  // Jarvis client-portal: monthly client report generator (see src/lib/empire-client-report.js)
  { id: 'client-report', label: 'Client Report', repoUrl: '' },
];

export const EMPIRE_SKILL_IDS = EMPIRE_SKILLS.map((s) => s.id);

export const EMPIRE_SKILL_LABELS = EMPIRE_SKILLS.reduce((acc, s) => {
  acc[s.id] = s.label;
  return acc;
}, {});

/** Resolve agent/skill id to display label (supports legacy agent ids). */
export function getSkillLabel(id) {
  if (id == null || id === '') return '—';
  const key = String(id).trim();
  return EMPIRE_SKILL_LABELS[key] ?? EMPIRE_SKILL_LABELS[key.toLowerCase()] ?? key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
