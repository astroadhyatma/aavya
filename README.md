# AAVYA

**Private student wellbeing for schools and colleges.**

AAVYA V1 is focused only on two markets: **schools** and **colleges**. The product combines a private student space with stage-specific programs and an institution layer for aggregate engagement and wellbeing insights.

## Student experience
- School stages: Classes 1–5, 6–8, 9–10, 11–12
- College stages: Year 1–4 and PG
- Daily check-ins
- Private journal
- Guided exercises
- Goals
- Progress/patterns
- Stage-specific programs
- AAVYA companion concept

## Institution experience
- Institution onboarding
- Student/member management
- Program assignment
- Aggregate engagement
- Aggregate wellbeing trends
- Demo/enquiry funnel
- Privacy boundary: no raw student journals or private conversations in institution reporting

## Production backend
`supabase/schema.sql` contains the initial Postgres model and Row Level Security policies. `PRODUCTION.md` contains the production launch checklist and safety/privacy gates.

A Supabase project still needs to be created and connected before real accounts or real student data can be used. Never place a Supabase `service_role` key in frontend code.

## Current frontend
The root `index.html`, `style.css`, and `app.js` provide the business site and interactive student experience without a Next.js build dependency. This keeps the frontend easy to deploy while the backend remains independently hosted.

## Important
The current UI is a product build foundation, not evidence of clinical efficacy. Before onboarding real students, complete consent/age handling, privacy/legal review, security testing, data retention/deletion, crisis/support escalation, monitoring and an audited AI gateway.
