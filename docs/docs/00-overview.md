# Malik Hardware Mart — Documentation Index

This folder is the single source of truth for the site. **Three files — `AGENTS.md`,
`ARCHITECTURE.md`, and `CLAUDE.md` — belong at the project root** (same level as
`package.json`), not inside `/docs`. Everything else in this folder (00 through 11) goes
into `/docs` as-is.
Antigravity (or any dev) should read the two root files before src/scripts/config; Claude
reviews actual committed code against these files, not against build-report claims.

**Read order:**
0. `/AGENTS.md` (project root) — agent config: fixed stack, do's/don'ts, restart checklist
0.5 `/ARCHITECTURE.md` (project root) — consolidated architecture rules, the single file
    every agent must follow before writing code
1. `01-architecture.md` — system overview, tech stack, data flow
2. `02-navigation.md` — the 3-part nav bar spec (NEW, finalizes the nav)
3. `03-data-models.md` — every Prisma model (Postgres), including new ones this update adds
4. `04-access-control.md` — the 4-tier permission matrix (Guest / Pending / Verified / Admin)
5. `05-routes.md` — every page route and every API route
6. `06-design-system.md` — the minimal/light CSS token palette
7. `07-test-accounts.md` — seeded login credentials for each tier
8. `08-homepage-layout.md` — homepage section order, inspired by atomlocks.com reference
9. `09-design-motion-guidelines.md` — Apple/Google-level visual polish, Framer Motion/GSAP rules, anti-breakage guardrails
10. `10-design-qa-audit-process.md` — post-build Apple HIG audit workflow, run per-surface once built
11. `11-seo-guidelines.md` — metadata, structured data (mind the price gate), sitemap/robots, Core Web Vitals

**Status as of this revision:**
- Price-gating, verification flow, and the light theme were implemented in a prior build pass —
  status: reported done by Antigravity, not yet independently re-verified against a fresh source export.
- This revision's new scope: the 3-part navigation bar, admin-editable marquee, and 4 new pages
  (Our Story, About Us, Contact Us, Blog). None of this exists in the codebase yet.
