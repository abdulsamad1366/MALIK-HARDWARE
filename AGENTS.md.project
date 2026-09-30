# AGENTS.md — Malik Hardware Mart Build Rules

Read this before writing any code. It exists because rule violations already happened once
in the previous build attempt (see "Known past mistakes" below) — this file is how we stop
them from recurring after the restart.

---

## Project one-liner
B2B wholesale hardware catalog. Guests browse with **no prices**. Only customers an admin
has explicitly verified can see prices, use the cart, and check out. Everyone else is
either fully locked out of pricing or waiting on approval.

## Stack (fixed — do not substitute without asking)
- Next.js 16, App Router, TypeScript, React 19
- Supabase (Postgres) via Prisma ORM
- Auth: JWT signed server-side, delivered in an **httpOnly** cookie
- No separate backend service — API route handlers live inside the same Next.js app
- Tailwind CSS for styling; Framer Motion + GSAP for motion (see `06-design-system.md`,
  `09-design-motion-guidelines.md`)

## Read order before coding
1. `01-architecture.md`
1.5 `/CLAUDE.md` (project root) — general coding discipline, merge with everything below
2. `04-access-control.md` ← the rule everything else depends on
3. `03-data-models.md`
4. `05-routes.md`
5. `02-navigation.md`, `08-homepage-layout.md`, `06-design-system.md`,
   `09-design-motion-guidelines.md`, `11-seo-guidelines.md`
6. `07-test-accounts.md`

---

## DO

- **Enforce every access rule inside the API route handler**, by checking a freshly-looked-up
  user record (or at minimum a claim you trust), not by hiding UI elements. Price, cart,
  checkout, and every `/api/admin/*` route are gated this way — no exceptions.
- Comment every function, every logically distinct block, and every route's required
  role/tier at the top of the file. This was set from day one and stays.
- Keep all styling on the Tailwind theme tokens in `tailwind.config.ts` (see
  `06-design-system.md`). No new hardcoded hex colors in components.
- Animate only `transform`/`opacity`; wrap every animation in a `prefers-reduced-motion`
  check; make sure content is present and usable with JS disabled or slow.
- Ask before deviating from anything in the docs folder — a one-line question here saves a
  rebuild later.
- **When you make a major change — a new model/field, a changed route, a different library,
  a scope addition** — update the matching file in `/docs` (or `/ARCHITECTURE.md` if it's
  stack-level) in the same change. Docs describe what's true, not what was once planned;
  if they drift from the real code, the next task gets built on stale information.
- Keep `.env.local` real secrets out of anything that gets shared back — redact before
  showing config files.

## DON'T

- **Don't gate anything (price, cart, checkout, admin routes) with only a client-side
  `if (loggedIn)` check.** The price must never even be present in the JSON response to
  someone who shouldn't see it. This was the single most important rule in every prior
  version of this spec.
- Don't ship a hardcoded fallback value for `JWT_SECRET` (or any secret) that's used if the
  env var is missing — fail loudly instead, don't silently run insecurely.
- Don't leave one-click demo-login buttons (pre-filled admin/customer credentials) on a
  login page meant to go anywhere near production — dev-only, must be removed or gated
  behind a non-production env check before deploy.
- Don't report a feature as "done" without it actually being visible in the diff/files
  changed. Build reports get independently checked against source, every time.
- Don't add a second animation library or a second font family "just because" — GSAP and
  Framer Motion each have a defined lane (`09-design-motion-guidelines.md`), stay in it.
- Don't invent new pages, models, or nav items beyond what's in the docs folder without
  flagging it first — scope creep is how "Blog" and "Shop by Use" quietly became bigger
  asks last time; better to surface a new need explicitly than build it silently.

## Known past mistakes (why these rules exist)
- A prior build's own report claimed price-gating was complete; the actual source had no
  verification field at all. → Reports are now independently checked against real files.
- The color theme shipped dark when light/minimal was the ask from the start of that pass.
  → Theme tokens are centralized specifically so this class of miss is a one-line fix, not
  a hunt through every component.

---

## General coding discipline (adapted from andrej-karpathy-skills)

Source: https://github.com/multica-ai/andrej-karpathy-skills — merge with the
project-specific rules above, don't treat as separate. Bias is toward caution over speed;
use judgment on genuinely trivial changes.

1. **Think before coding.** State assumptions explicitly rather than silently running with
   one. If a request has more than one reasonable reading, present the options instead of
   picking for the user. If a simpler approach exists than what was asked for, say so. If
   something is genuinely unclear, stop and ask rather than guessing.
2. **Simplicity first.** Build the minimum that solves the stated problem — no speculative
   config options, no abstractions for something used once, no handling for inputs that
   can't occur. If a chunk of code could be a quarter of its size, rewrite it smaller.
3. **Surgical changes.** Touch only what the task requires. Don't reformat or "clean up"
   adjacent code while you're in a file for an unrelated reason. Match existing style even
   if you'd have done it differently. Remove only the dead code/imports your own change
   creates — flag pre-existing dead code instead of deleting it unasked.
4. **Goal-driven execution.** Turn vague asks into checkable ones — "fix the bug" becomes
   "write a test that reproduces it, then make it pass." For multi-step work, state a short
   plan with a verification step attached to each item before starting.

These directly target the two failure modes already seen on this project once: reporting
something as finished without it being true, and quietly expanding scope (a new page, a new
model) instead of surfacing it as a decision first.

---

## Restart checklist
1. Confirm empty repo / scaffold fresh Next.js 16 + TS app.
2. Re-create `.env.local` (never commit it) with `MONGODB_URI` and a real random
   `JWT_SECRET` — no fallback default in code.
3. Build models in the order listed in `03-data-models.md`.
4. Build the price-gated product API before any UI — verify with a raw `curl`/Postman call
   as a guest that `price` is genuinely absent from the JSON, before writing a single
   product-card component.
5. Layer in nav, homepage, cart/checkout, admin — in that order, checking each against its
   doc section before moving to the next.
