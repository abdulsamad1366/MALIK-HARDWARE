# Homepage Layout — inspired by atomlocks.com reference

Section order, top to bottom, after the 3-part nav bar (`02-navigation.md`):

## 1. Full-width hero carousel
- Edge-to-edge image slider directly under the nav.
- Slides come from `HeroSlide` (see `03-data-models.md`), ordered by `displayOrder`,
  `isActive: true` only.
- Auto-advance + manual prev/next controls. Optional headline text overlay per slide.
- Component: `src/components/HeroCarousel.tsx`.

## 2. "Shop by Category" grid
- Section heading "SHOP BY CATEGORY".
- Circular icon grid, one circle per `Category` document (reuses the existing model —
  no new schema needed here), label centered below each circle.
- Clicking a circle → `/category/[slug]`.
- Same data source that already feeds the "Categories" dropdown in the bottom nav row —
  keep it as one API call (`GET /api/categories`) reused by both.
- Component: `src/components/CategoryGrid.tsx`.

## 3. Promo banner strip
- 2-3 large rectangular tiles (image + title + "Shop Now") in a row, e.g. "Pulls",
  "Aldrop", "Mortise Locks" in the reference.
- Data source: `PromoBanner` (new model, see `03-data-models.md`), `isActive: true`,
  ordered by `displayOrder`.
- Component: `src/components/PromoBannerStrip.tsx`. Can repeat this section more than
  once on the page (the reference shows it twice, before and after "Shop by Use") —
  fine to reuse the same component with a different slice of banners, or just render
  all active banners split across two rows by `displayOrder`.

## 4. "Shop by Use" grid
- Section heading "SHOP BY USE".
- Same circular-grid visual pattern as "Shop by Category" but sourced from the new
  `UseCase` model instead (Bathroom, Bedroom, Kitchen, Main Entrance, Wardrobes, Office
  in the reference).
- Clicking a circle → `/use/[slug]` (new route — filtered product listing where
  `product.useCases` contains this use case; same page template as `/category/[slug]`,
  just filtering on the other field).
- Component: reuse `CategoryGrid.tsx` with a `source="useCase"` prop rather than
  building a second near-identical component.

## 5. Featured product grid
- Standard `ProductCard` grid (already exists), pulling `featured: true` products from
  `GET /api/products`.
- Respects the existing 3-tier price gate exactly as everywhere else — no special
  casing for the homepage.

## New routes this adds
```
GET  /api/hero-slides                  public, active slides only
GET  /api/use-cases                    public
GET  /api/promo-banners                public, active only
GET  /products?useCase=<slug>  or  /use/[slug]     filtered listing
✨ /api/admin/hero-slides, /api/admin/use-cases, /api/admin/promo-banners   admin CRUD (mirrors /admin/products pattern)
```

## Open question
The reference site's category circles include a padlock icon overlay in the bottom-left
corner of the whole grid (visible in the screenshots) — unclear if that's a "secure
checkout" trust badge or a login-status indicator. Clarify what it should do before
Antigravity builds it; easy to skip for v1 if you don't need it.
