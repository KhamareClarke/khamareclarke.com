import { requireAuth } from '@/lib/api-guard';
import { generateJarvisCompletion, getJarvisLlmProvider } from '@/lib/jarvis/llm';
import { formatSearchResultsForPrompt, normalizeSearchQuery, searchWeb } from '@/lib/jarvis/web-search';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 45;

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
        summary = await generateJarvisCompletion(
          `You are JARVIS. Summarize web search results for the operator in plain text (no markdown). Be concise and cite key facts.`,
          [
            {
              role: 'user',
              content: `Query: ${query}\n\nSearch results:\n${block}\n\nAnswer the query using these results.`,
            },
          ]
        );
        llmSource = `${source}+${getJarvisLlmProvider()}`;
      } else if (getJarvisLlmProvider()) {
        summary = await generateJarvisCompletion(
          `You are JARVIS. The operator needs a factual answer. Plain text only, no markdown. Be concise, sir.`,
          [{ role: 'user', content: query }]
        );
        llmSource = getJarvisLlmProvider();
      } else {
        summary = `No web results found for "${query}", sir. Set OPENROUTER_API_KEY in Vercel.`;
      }
    } catch (err) {
      if (results.length) {
        summary = `Found ${results.length} result(s) for "${query}", sir. Top hit: ${results[0].title}.`;
      } else {
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
