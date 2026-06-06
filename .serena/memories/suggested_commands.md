# Suggested Commands — okazu

## Project not yet scaffolded
Run these to initialize (from `C:\Users\fkazu\portfolio\okazu`):

```powershell
# Scaffold Next.js app (TypeScript, App Router, Tailwind, src/ dir)
npx create-next-app@latest . --typescript --app --tailwind --src-dir --import-alias "@/*"

# Install Supabase client libs
npm install @supabase/supabase-js @supabase/ssr
```

## After scaffold — daily dev commands (PowerShell)

```powershell
# Start dev server
npm run dev

# Build
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Supabase CLI (if installed)

```powershell
# Start local Supabase stack
supabase start

# Apply migrations
supabase db push

# Generate TypeScript types from DB schema
supabase gen types typescript --local > src/types/supabase.ts
```

## Windows-specific notes
- Use PowerShell; `&&` chaining not supported in PS 5.1 — use `;` or `if ($?) { ... }`
- Path separator is `\` but Node/npm also accept `/`
