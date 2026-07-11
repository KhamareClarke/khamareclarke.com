# Empire Worker with Ollama (no OpenRouter)

Use a local model so the Worker doesn’t use OpenRouter credits.

## 1. Install and run Ollama

- **Windows**: [ollama.com](https://ollama.com) → download and install.
- **Mac/Linux**: `curl -fsSL https://ollama.com/install.sh | sh`

Then start a model that supports tool/function calling (e.g. Llama 3.2 or newer):

```bash
ollama run llama3.2
```

Leave this terminal open, or run in the background. Ollama serves at `http://localhost:11434`.

## 2. Point Empire Worker at Ollama

In the **Empire** app (khamareclarke.com-main), edit `.env.local`:

```env
# Use Ollama instead of OpenRouter for the Worker
EMPIRE_LLM_API_URL=http://localhost:11434/v1
EMPIRE_LLM_MODEL=llama3.2
```

No API key needed for local Ollama.

Optional: comment out or remove `OPENROUTER_API_KEY` if you don’t want the Worker to fall back to OpenRouter.

## 3. Restart Empire and run the Worker

Restart the Next.js dev server, then in the Empire dashboard use **Worker → Run worker (edit code)**. The worker will call Ollama instead of OpenRouter.

## Notes

- **Tool calling**: Older Ollama models may not support `read_file` / `write_file` tool calls. Use a recent model (e.g. `llama3.2`, `llama3.1`, `qwen2.5`).
- **ZeroClaw**: To use ZeroClaw as the Worker’s LLM, ZeroClaw would need an HTTP endpoint compatible with OpenAI chat completions (e.g. `/v1/chat/completions`). Today ZeroClaw only exposes WebSocket chat; the Worker still uses OpenRouter or Ollama via `EMPIRE_LLM_API_URL`.
