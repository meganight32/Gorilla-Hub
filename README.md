# Gorilla Hub

This is a Next.js + Tailwind + Supabase project. Follow the "Deploy & setup" steps below.

## Quick local dev
1. Copy `.env.example` to `.env.local` and fill values.
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000

## Supabase setup (detailed steps later)
- Create Supabase project named `gorilla-hub`.
- Add the SQL migrations (in README or SQL file included).
- Create Storage bucket named `cosmetics`.
- Optionally make the bucket public (simpler for first deploy).

## Vercel
- Create a Vercel project and link to your GitHub repo.
- Add env vars in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (set as Environment Variable - Protected), `OPENAI_API_KEY` (protected), `FORMSPREE_URL`.
- Deploy and test.

## Admin
- Sign up a user, then add that user's id to the `admins` table in Supabase (manual step).

## Security / Notes
- **Rotate** any OpenAI key you posted publicly and use new key only in environment variables.
- Do NOT push secrets to GitHub.
- This starter keeps the UI simple — you can harden DB policies and storage rules later.

If you want automated scripts to run SQL or seed data, let me know and I’ll provide those too.
