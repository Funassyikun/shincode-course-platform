# Task Completion — okazu

Run these after any coding task before considering it done:

```powershell
# 1. Type check
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Build check (catches missing env vars, import errors)
npm run build
```

If Supabase schema changed:
```powershell
# Regenerate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts
```

For UI changes: start `npm run dev` and manually verify in a smartphone-width browser viewport before marking done.
