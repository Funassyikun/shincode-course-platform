# Tech Stack — okazu

## Languages & Runtime
- TypeScript (strict mode expected)
- Node.js (via Next.js)

## Frontend
- **Next.js** with App Router (`src/app/`)
- Optimized for smartphone browser; responsive for desktop
- React Server Components where possible; Client Components only when interactivity needed

## Backend / DB
- **Supabase**: PostgreSQL + Realtime subscriptions + Auth
- Supabase client: `@supabase/supabase-js` (browser) + `@supabase/ssr` (server/middleware)
- Auth: email + password, email verification required
- RLS (Row Level Security) on all user-facing tables

## Hosting
- **Vercel** (recommended) — Next.js native integration

## MCP servers configured (`.mcp.json`)
- `supabase` — Supabase MCP server
- `playwright` — browser automation
- `serena` — code intelligence (NOTE: currently pointed at shincode-course-platform; update `--project` arg to okazu path if needed)
- `context7` — library docs
- `sequential-thinking`

## Package manager
- Not yet determined (project not scaffolded). Likely `npm` or `pnpm`.
