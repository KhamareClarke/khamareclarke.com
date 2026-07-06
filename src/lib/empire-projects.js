/**
 * Empire fleet — all projects/domains. Tasks can be assigned to any project.
 */
export const ALL_EMPIRE_PROJECT_IDS = [
  'myapproved',
  'khamareclarke',
  'zeroclaw',
  'omniwtms',
  'leverageacademy',
  'fliprepublic',
  'leveragejournal',
  'inboker',
  'identitymarketing',
  'adstarter',
  'seoinforce',
  'alkemmy',
  'empire',
  'empire-phase11-test',
];

export const PROJECT_DISPLAY = {
  myapproved: 'MyApproved',
  khamareclarke: 'KhamareClarke.com',
  'khamareclarke-com': 'KhamareClarke.com',
  omniwtms: 'Omni WTMS',
  leverageacademy: 'Leverage Academy',
  fliprepublic: 'Flip Republic',
  leveragejournal: 'Leverage Journal',
  inboker: 'Inboker',
  identitymarketing: 'Identimarketing',
  adstarter: 'Ads Starter',
  seoinforce: 'SEO In Force',
  alkemmy: 'Alkhemmy',
  empire: 'Empire',
  'empire-phase11-test': 'Empire (verification)',
};

/** Root URLs for each project (for SEO audit, health checks, etc.). Override via env EMPIRE_URL_<project_id>. */
export const PROJECT_ROOT_URL = {
  myapproved: 'https://myapproved.co.uk',
  khamareclarke: 'https://khamareclarke.com',
  zeroclaw: 'https://zeroclaw.com',
  omniwtms: 'https://omniwtms.com',
  leverageacademy: 'https://leverageacademy.com',
  fliprepublic: 'https://fliprepublic.com',
  leveragejournal: 'https://leveragejournal.com',
  inboker: 'https://inboker.com',
  identitymarketing: 'https://identitymarketing.com',
  adstarter: 'https://adstarter.com',
  seoinforce: 'https://seoinforce.com',
  alkemmy: 'https://alkemmy.com',
  empire: 'https://khamareclarke.com',
  'empire-phase11-test': 'https://khamareclarke.com',
};

export function getProjectLabel(id) {
  if (id == null || id === '') return '—';
  const key = String(id).trim();
  return PROJECT_DISPLAY[key] ?? PROJECT_DISPLAY[key.toLowerCase()] ?? key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Get root URL for a project (env EMPIRE_URL_<id> overrides). */
export function getProjectRootUrl(projectId) {
  if (typeof projectId !== 'string' || !projectId.trim()) return null;
  const key = projectId.trim().toLowerCase();
  const envKey = `EMPIRE_URL_${key.replace(/-/g, '_')}`;
  if (typeof process !== 'undefined' && process.env?.[envKey]) return process.env[envKey];
  return PROJECT_ROOT_URL[key] ?? PROJECT_ROOT_URL[key.replace(/_/g, '-')] ?? null;
}
