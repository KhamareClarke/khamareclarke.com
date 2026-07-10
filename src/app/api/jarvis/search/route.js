import { requireAuth } from '@/lib/api-guard';
import { generateGeminiCompletion } from '@/lib/jarvis/gemini';
import { formatSearchResultsForPrompt, searchWeb } from '@/lib/jarvis/web-search';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 45;

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query || '').trim().slice(0, 500);
    if (!query) {
      return Response.json({ error: 'query is required' }, { status: 400 });
    }

    const { results, source } = await searchWeb(query);
    const block = formatSearchResultsForPrompt(results);

    let summary = '';
    try {
      summary = await generateGeminiCompletion(
        `You are JARVIS. Summarize web search results for the operator in plain text (no markdown). Be concise and cite key facts. If results are thin, say so.`,
        [
          {
            role: 'user',
            content: `Query: ${query}\n\nSearch results:\n${block}\n\nAnswer the query using these results.`,
          },
        ],
        { useGoogleSearch: false }
      );
    } catch {
      if (results.length) {
        summary = `Found ${results.length} result(s) for "${query}", sir. Top hit: ${results[0].title}.`;
      } else {
        summary = `No web results found for "${query}", sir.`;
      }
    }

    return Response.json({
      ok: true,
      query,
      source,
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
