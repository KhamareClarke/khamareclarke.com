import { requireAuth } from '@/lib/api-guard';
import { generateJarvisCompletion, getJarvisLlmProvider } from '@/lib/jarvis/llm';
import { formatSearchResultsForPrompt, normalizeSearchQuery, searchWeb } from '@/lib/jarvis/web-search';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 45;

const SEARCH_SYSTEM_PROMPT = `You are JARVIS. Summarize the provided web search results for the operator.

Rules:
- Answer ONLY from the search results below. They are your live data.
- Never say you cannot access real-time data, Google, or the web.
- Include specific facts, numbers, and dates from the snippets when present.
- Plain text only — no markdown.
- Be concise (2-4 sentences). One "sir" is enough.`;

function fallbackSearchSummary(query, results) {
  if (!results?.length) {
    return `No web results found for "${query}", sir. Try a shorter query.`;
  }
  const parts = results.slice(0, 3).map((r) => {
    const bit = r.snippet ? `${r.title}: ${r.snippet}` : r.title;
    return bit.slice(0, 160);
  });
  return `Here's what I found for "${query}", sir. ${parts.join(' ')}`.slice(0, 600);
}

function isSearchRefusal(text) {
  return /\b(cannot provide|can't provide|unable to provide|do not have access|cannot access|real-time data|check a financial|commodities trading platform|I cannot directly)\b/i.test(
    String(text || '')
  );
}

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => ({}));
    const query = normalizeSearchQuery(String(body.query || '').trim().slice(0, 500));
    if (!query) {
      return Response.json({ error: 'query is required' }, { status: 400 });
    }

    const { results, source } = await searchWeb(query);
    const block = formatSearchResultsForPrompt(results);

    let summary = '';
    let llmSource = source;

    try {
      if (results.length) {
        summary = await generateJarvisCompletion(SEARCH_SYSTEM_PROMPT, [
          {
            role: 'user',
            content: `Query: ${query}\n\nSearch results:\n${block}\n\nSummarize the answer to the query using these results.`,
          },
        ]);
        if (isSearchRefusal(summary)) {
          summary = fallbackSearchSummary(query, results);
        }
        llmSource = `${source}+${getJarvisLlmProvider()}`;
      } else if (getJarvisLlmProvider()) {
        summary = await generateJarvisCompletion(SEARCH_SYSTEM_PROMPT, [
          {
            role: 'user',
            content: `Query: ${query}\n\nNo search results were parsed. Say you could not find results and suggest trying again, sir.`,
          },
        ]);
        if (isSearchRefusal(summary) || !summary?.trim()) {
          summary = fallbackSearchSummary(query, results);
        }
        llmSource = getJarvisLlmProvider();
      } else {
        summary = `No web results found for "${query}", sir. Set OPENROUTER_API_KEY in Vercel.`;
      }
    } catch (err) {
      summary = fallbackSearchSummary(query, results);
      if (!summary && !results.length) {
        return Response.json(
          { error: err?.message || 'Search and LLM fallback both failed' },
          { status: 500 }
        );
      }
    }

    return Response.json({
      ok: true,
      query,
      source: llmSource,
      results: results.slice(0, 8),
      summary,
    });
  } catch (err) {
    console.error('[jarvis/search]', err);
    return Response.json(
      { error: err?.message || 'Web search failed' },
      { status: 500 }
    );
  }
}
