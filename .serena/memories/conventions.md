# Conventions — okazu

## TypeScript
- Strict mode
- No `any`; use generated Supabase types (`src/types/supabase.ts`) for DB row types
- Prefer `type` over `interface` for data shapes; `interface` for component props if needed

## Next.js App Router
- Server Components by default; add `"use client"` only when necessary (event handlers, hooks, Realtime subscriptions)
- Route groups for auth vs app vs admin: `(auth)/`, `(app)/`, `(admin)/`
- Supabase SSR client in server components/middleware; browser client in Client Components

## Supabase
- Always call `supabase.auth.getUser()` on the server (not `getSession()`) to verify auth
- RLS policies are the security boundary — never rely solely on client-side guards
- Realtime: subscribe to `okazu_registrations` channel to remove matched records from UI

## Naming
- Files: kebab-case (`okazu-list.tsx`, `invite-code-form.tsx`)
- Components: PascalCase
- DB columns: snake_case (Supabase convention)
- TypeScript types mirroring DB: PascalCase (`OkazuRegistration`, `Profile`)

## UI
- Mobile-first; Tailwind CSS
- Japanese UI text (app is Japanese)
- Allergen info displayed alongside menu names in registration list

## Comments
- No comments except for non-obvious constraints or workarounds
