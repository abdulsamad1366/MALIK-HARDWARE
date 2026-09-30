# Navigation Bar — 3-Part Structure

The header is built in three stacked bands. Each is its own component so they can be
edited independently.

## Part 1 — Top marquee bar

- Full-width scrolling marquee strip above everything else.
- Text content comes from `SiteSettings.marqueeMessage` (see `03-data-models.md`) — **not
  hardcoded** — so the admin can change it without a code deploy.
- Editable only from `/admin/settings` (new admin page). Guarded the same way as every
  other admin route: role-checked server-side in the `PUT /api/admin/settings` handler.
- Empty message → the band collapses to 0 height rather than showing a blank scrolling bar.
- Component: `src/components/MarqueeBar.tsx`.

## Part 2 — Middle band (3 columns)

| Column | Content |
|---|---|
| Left | Logo + "Malik Hardware Mart" wordmark, links to `/` |
| Middle | Search input — submits to `/products?search=<query>` |
| Right | Cart icon (with item-count badge, links to `/cart`) + Profile icon (links to `/account` if logged in, `/login` if guest) |

Notes:
- Cart badge count comes from `CartContext` (already exists) — no new state needed.
- Profile icon shows an initials avatar when logged in, a plain outline icon for guests.
- On mobile, the search input collapses to an icon-triggered overlay to keep the row from
  wrapping (matches the responsive breakpoints defined in `tailwind.config.ts`).
- Component: `src/components/HeaderMiddle.tsx`.

## Part 3 — Bottom nav row

Left-to-right, single row, horizontally scrollable on mobile (same pattern as the existing
`.category-nav-strip`):

```
Home | Categories ▾ | Our Story | About Us | Contact Us | Blog
```

- **Home** → `/`
- **Categories** → hover/tap dropdown listing all 7 divisions (pulled from the existing
  `Category` collection, same data the homepage cards use) + a "View all products" link
  at the bottom of the dropdown → `/products`. Does not need a new page.
- **Our Story** → `/our-story` (new static page — see `05-routes.md`)
- **About Us** → `/about-us` (new static page)
- **Contact Us** → `/contact-us` (new static page with a contact form → see below)
- **Blog** → `/blog` (new — see `03-data-models.md` for the `BlogPost` schema)

Component: `src/components/NavBottom.tsx`.

## Contact Us form behavior

`/contact-us` needs a simple form (name, email, message) posting to `POST /api/contact`.
No new database collection required for v1 — the handler can just send an email/notification
to the store owner rather than persisting submissions, unless you want a record kept; flag
this if you want submissions stored and I'll add a `ContactMessage` model.

## File/component summary for this update

```
src/components/
  MarqueeBar.tsx       # Part 1
  HeaderMiddle.tsx      # Part 2
  NavBottom.tsx         # Part 3
  Header.tsx            # composes the three parts above (replaces old single-band header)
src/app/
  our-story/page.tsx
  about-us/page.tsx
  contact-us/page.tsx
  blog/page.tsx          # post list
  blog/[slug]/page.tsx    # single post
  admin/settings/page.tsx # marquee editor
  api/contact/route.ts
  api/blog/route.ts
  api/blog/[slug]/route.ts
  api/admin/settings/route.ts
  api/admin/blog/route.ts
  api/admin/blog/[id]/route.ts
```
