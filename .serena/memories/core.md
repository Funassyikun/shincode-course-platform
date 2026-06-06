# Core — おかず交換アプリ (okazu)

Project root: `C:\Users\fkazu\portfolio\okazu`

## Status
Early setup — Next.js app not yet scaffolded. Only CLAUDE.md (requirements) and config files exist.

## App overview
Community-scoped bento side-dish (おかず) exchange web app.
- Users register what they're giving/wanting; browse same-day registrations; request exchanges (instant match, no approval).
- Admin manages menus, invite codes, lunch-time windows, users, exchange status.
- 1 community fixed for MVP; all tables carry `community_id` for future multi-tenancy.

## Planned source layout (post-scaffold)
```
okazu/
  src/
    app/          # Next.js App Router pages & layouts
    components/   # Shared UI components
    lib/          # Supabase client, utilities
    types/        # TypeScript types / generated Supabase types
  supabase/
    migrations/   # SQL migration files
```

## Key invariants
- All major tables must have `community_id` (multi-tenancy readiness).
- Supabase RLS must be enabled on every user-facing table.
- Exchange matching is instant (no approval flow); matched registrations are removed from the list in real-time via Supabase Realtime.
- Registration + exchange window = "time admin set the day's menu" → lunch end time.
- After a match is established, the registration cannot be modified or deleted.

## Module memories
- Tech stack details: `mem:tech_stack`
- DB schema & data design: `mem:db_schema`
- Feature rules & business logic: `mem:business_logic`
- Conventions: `mem:conventions`
- Commands: `mem:suggested_commands`, `mem:task_completion`
