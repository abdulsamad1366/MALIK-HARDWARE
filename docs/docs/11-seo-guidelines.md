# SEO Guidelines

Applies to every public page (home, products, categories, use-cases, blog, static pages).
Admin, cart, checkout, account, and orders are **not** SEO targets — they should be excluded,
not optimized.

## 1. Rendering

Next.js App Router already does the hard part — use Server Components for every public page
so content is in the initial HTML, not client-rendered after the fact. Don't convert a
public page to a client component just for convenience; that hides content from crawlers
and hurts load performance both.

## 2. Per-page metadata

Every public page exports `generateMetadata` (or static `metadata`) with a real, specific
title and description — not one shared string reused across all products. For dynamic pages:
- `/products/[slug]` → title = product name + brand, description from the product's own
  description field, truncated
- `/category/[category-slug]`, `/use/[slug]` → title/description built from that
  category/use-case's name and description
- `/blog/[slug]` → title = post title, description = post excerpt
- Canonical URL set on every page to its own clean path (no query-string duplicates
  indexed — e.g. `/products?search=x` should not be indexed as a separate canonical page)

## 3. Structured data (JSON-LD) — mind the price gate

- `Organization`/`LocalBusiness` schema on the homepage (name, address, GST details already
  shown in the footer per earlier build notes).
- `BreadcrumbList` on category, use-case, and product pages.
- `Product` schema on product detail pages — **but do not include a `price`/`offers` block
  for a page rendered to an unauthenticated or unverified request.** This site's whole
  premise is that price is gated (`ARCHITECTURE.md` Section 3) — leaking it into JSON-LD
  markup for guests defeats that even if the visible HTML hides it. Either omit the `offers`
  block entirely for ungated requests, or use `availability`/`itemCondition` only, with no
  `price` field, until the viewer is verified.
- `Article` schema on blog posts (headline, author, datePublished).

## 4. Sitemap & robots

- `app/sitemap.ts` generates entries for: home, all products, all categories, all use cases,
  all published blog posts, and the static pages (Our Story, About Us, Contact Us).
  Excludes cart, checkout, account, orders, login, register, and everything under `/admin`.
- `app/robots.ts` disallows `/admin`, `/api`, `/cart`, `/checkout`, `/account`, `/orders`.

## 5. Semantic HTML & accessibility (overlaps with SEO ranking signals)

- One `<h1>` per page. Product name is the `<h1>` on product pages, category/use-case name
  on listing pages.
- Real `<nav>`, `<main>`, `<footer>` landmarks — not generic `<div>`s for structural regions.
- Every product/category/use-case/blog image gets real `alt` text (product name, category
  name, etc.) — not empty or filename-based alt text, even for placeholder images.

## 6. Performance (Core Web Vitals feed directly into ranking)

- Use `next/image` for every image (product, category, hero slides, blog covers) — handles
  responsive sizing and lazy-loading automatically.
- This ties directly into `09-design-motion-guidelines.md`'s anti-breakage rules: animating
  only `transform`/`opacity` and avoiding layout-shifting properties isn't just an animation
  guideline, it's also a Cumulative Layout Shift (a Core Web Vital) requirement.
- Don't block the initial page render on GSAP/Framer Motion — those load after critical
  content per `09-design-motion-guidelines.md`'s lazy-load rule for GSAP.

## 7. URLs

Every product, category, use case, and blog post already has a `slug` field
(`03-data-models.md`) — use it as the URL, not a database ID. Slugs are lowercase,
hyphenated, and stable once published (changing a slug after indexing loses SEO value, so
avoid slug edits on already-live content without a redirect).
