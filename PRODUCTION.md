# AAVYA Production V1

## Scope
AAVYA V1 is for **schools and colleges only**. Corporate/workplace is intentionally out of scope.

## Product surfaces
- Public business site and institution demo funnel
- Student account and onboarding
- School stages: Classes 1–5, 6–8, 9–10, 11–12
- College stages: Year 1–4 and PG
- Private MySpace: check-ins, journal, exercises, goals, progress and companion
- Stage-specific programs
- Institution admin: members, programs, aggregate engagement and wellbeing trends
- Privacy boundary: institutions never receive raw private journals or private companion conversations

## Backend
Supabase is the intended backend for V1:
- Auth for student/admin accounts
- Postgres for application data
- Row Level Security (RLS) for user/institution isolation
- Aggregate RPCs/views for institution reporting
- Storage only when a documented use case requires it

Run `supabase/schema.sql` in a fresh Supabase project. Then create `config.js` from `config.example.js` with the public Supabase URL and anon key. Never expose a service_role key in frontend code.

## Safety gates before real student launch
1. Verify RLS with tests for student, educator, counsellor and institution-admin roles.
2. Add age/consent and guardian flows where legally required for minors.
3. Add clear crisis/support escalation and emergency messaging appropriate to the launch geography.
4. Do not describe AAVYA as diagnosis or treatment.
5. Add privacy notice, terms, data retention/deletion/export process and institution data-processing terms.
6. Add rate limiting, abuse protection, error monitoring, backups and recovery procedures.
7. If AI is enabled, route it through a server-side safety gateway; never expose provider API keys in the browser.
8. Conduct security/privacy review before onboarding real students.

## Business model hooks
The codebase is structured for institution subscriptions, program bundles and optional workshops. Pricing should be configured after pilot conversations rather than hard-coded into student UX.

## Deployment
The current public frontend is intentionally framework-light so it can be hosted as a static site. The production backend is independent of the hosting provider. Connect a production Supabase project, then deploy the static frontend through a static host such as Cloudflare Pages or Vercel static output.
