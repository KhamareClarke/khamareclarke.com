/**
 * Runs a real SEO audit for a project: fetches the homepage, checks title, meta description, h1.
 * Used when agent_id is "seo-audit" and EMPIRE_WORKER_URL is not set.
 */
import { getProjectRootUrl } from './empire-projects';

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const META_DESC_MIN = 120;
const META_DESC_MAX = 160;

function extract(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : null;

  const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null;

  return { title, metaDescription, h1 };
}

/**
 * Run SEO audit for the given project. Returns a report string.
 * @param {string} projectId - e.g. 'myapproved'
 * @returns {Promise<string>} Report text
 */
export async function runSeoAudit(projectId) {
  const url = getProjectRootUrl(projectId);
  if (!url) {
    return `SEO Audit: No URL configured for project "${projectId}". Set EMPIRE_URL_<project_id> or add to PROJECT_ROOT_URL.`;
  }

  let res;
  try {
    res = await fetch(url, {
      headers: { 'User-Agent': 'Empire-SEO-Audit/1.0' },
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {
    return `SEO Audit failed for ${url}: ${e.message || 'fetch error'}.`;
  }

  if (!res.ok) {
    return `SEO Audit: ${url} returned HTTP ${res.status} ${res.statusText}.`;
  }

  const html = await res.text();
  const { title, metaDescription, h1 } = extract(html);

  const lines = [
    `SEO Audit Report — ${url}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    '--- Title ---',
    title ? `Present (${title.length} chars). ${title.length < TITLE_MIN ? `Short — aim for ${TITLE_MIN}-${TITLE_MAX} chars.` : title.length > TITLE_MAX ? `Long — aim for ${TITLE_MIN}-${TITLE_MAX} chars.` : 'Length OK.'}` : 'Missing.',
    title ? `"${title.slice(0, 80)}${title.length > 80 ? '…' : ''}"` : '',
    '',
    '--- Meta description ---',
    metaDescription ? `Present (${metaDescription.length} chars). ${metaDescription.length < META_DESC_MIN ? `Short — aim for ${META_DESC_MIN}-${META_DESC_MAX} chars.` : metaDescription.length > META_DESC_MAX ? `Long — aim for ${META_DESC_MIN}-${META_DESC_MAX} chars.` : 'Length OK.'}` : 'Missing.',
    metaDescription ? `"${metaDescription.slice(0, 120)}${metaDescription.length > 120 ? '…' : ''}"` : '',
    '',
    '--- H1 ---',
    h1 ? `Present: "${h1.slice(0, 80)}${h1.length > 80 ? '…' : ''}"` : 'Missing or not found in first chunk.',
  ];

  return lines.join('\n');
}
