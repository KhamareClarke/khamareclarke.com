import { requireAuth } from '@/lib/api-guard';
import { buildJarvisContext } from '@/lib/jarvis/context';
import { JARVIS_OFFLINE_MESSAGE, JARVIS_SYSTEM_PROMPT } from '@/lib/jarvis/prompt';
import { streamJarvisCompletion, transformJarvisStream } from '@/lib/jarvis/llm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function offlineStream(message) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: message })}\n\n`));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => ({}));
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const messages = rawMessages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      return Response.json({ error: 'messages must end with a user message' }, { status: 400 });
    }

    const { text: contextBlock } = await buildJarvisContext();
    const systemPrompt = `${JARVIS_SYSTEM_PROMPT}\n\n${contextBlock}`;

    let upstream;
    let provider;
    try {
      ({ provider, body: upstream } = await streamJarvisCompletion(systemPrompt, messages));
    } catch (err) {
      if (err.message === 'LLM_NOT_CONFIGURED' || err.message === 'OPENROUTER_NOT_CONFIGURED' || err.message === 'GEMINI_NOT_CONFIGURED') {
        return Response.json(
          { error: 'No LLM configured — set GEMINI_API_KEY or OPENROUTER_API_KEY on server' },
          { status: 503 }
        );
      }
      const stream = offlineStream(JARVIS_OFFLINE_MESSAGE);
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    const stream = transformJarvisStream(upstream, provider);
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[jarvis/chat]', err);
    const stream = offlineStream(JARVIS_OFFLINE_MESSAGE);
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  }
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  return Response.json({ error: 'Use POST with messages array' }, { status: 405 });
}
