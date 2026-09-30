# Architecture

> **Superseded by `/ARCHITECTURE.md` at the project root**, which reflects the finalized
> Prisma/Postgres/Supabase/Tailwind stack. This file is kept for history only — its
> MongoDB/Mongoose details below are stale.

**Stack:** ~~Next.js 16 (App Router, Turbopack, React 19) + TypeScript, MongoDB via Mongoose, JWT in httpOnly cookie.~~ See `/ARCHITECTURE.md`.

```
Browser
  │  HTTP/HTTPS + JWT httpOnly cookie
  ▼
Next.js App Server
  ├─ Frontend pages (src/app/**/page.tsx)      — React Server + Client Components
  └─ API route handlers (src/app/api/**/route.ts) — server-side only, price gating lives here
        │
        ▼
   Mongoose ODM ─▶ MongoDB (users, products, categories, carts, orders, siteSettings, blogPosts)
```

**Non-negotiable rule (unchanged from the original spec):** any field or action gated by
role or verification status must be enforced in the API route handler, server-side, not just
hidden in the UI. This applies to price, cart, checkout — and now also to marquee-message
editing and blog publishing, which are admin-only.
