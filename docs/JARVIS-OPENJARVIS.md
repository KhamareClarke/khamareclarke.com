# OpenJarvis in Admin Dashboard

Full [OpenJarvis](https://github.com/open-jarvis/OpenJarvis) runs as a **separate service** (Python + Ollama). The admin UI embeds it at `/dashboard/jarvis`.

## Why not inside Vercel?

OpenJarvis needs Python, Ollama, and local/cloud LLM runtime. Vercel cannot host it. The **whole repository** is cloned via `npm run openjarvis:setup` and run with Docker.

## Local setup

```bash
npm run openjarvis:setup
cp vendor/OpenJarvis/deploy/docker/.env.example vendor/OpenJarvis/deploy/docker/.env
# Edit .env — set OPENJARVIS_API_KEY (see OpenJarvis docs: jarvis auth generate-key)

npm run openjarvis:start
```

Add to `.env.local`:

```
NEXT_PUBLIC_OPENJARVIS_URL=http://127.0.0.1:8000
OPENJARVIS_URL=http://127.0.0.1:8000
OPENJARVIS_API_KEY=your-key-here
```

Open **http://localhost:3000/dashboard/jarvis** (admin login required).

## Production

1. Deploy OpenJarvis on a VPS (use `docker-compose.openjarvis.yml` or OpenJarvis deploy docs).
2. Expose HTTPS (e.g. `https://jarvis.yourdomain.com`).
3. Set Vercel env vars:
   - `NEXT_PUBLIC_OPENJARVIS_URL`
   - `OPENJARVIS_URL`
   - `OPENJARVIS_API_KEY`

## Shortcuts

- **Cmd+J** / blue orb → `/dashboard/jarvis`
- **Cmd+K** → command palette → opens JARVIS

Legacy custom chat drawer removed; ops APIs (`/api/jarvis/*`) remain for future OpenJarvis MCP bridges.
