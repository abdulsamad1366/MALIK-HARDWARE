# Design & Motion Guidelines

Target bar: **Apple/Google-level polish** — restrained, purposeful, fast. Motion should make
the interface feel alive, never make it feel fragile. Every rule below exists to stop
animation from becoming a source of bugs, layout shift, or slowdown.

---

## 1. Design philosophy

- **Clarity over decoration.** Every visual flourish must clarify state or guide attention
  (price just unlocked, item added to cart, form field has an error) — not exist for its
  own sake.
- **Generous whitespace.** Don't crowd product cards, the category grids, or checkout
  fields. This is a trade catalog, not a flyer — let content breathe.
- **Consistency over novelty.** One button style, one card style, one modal style, reused
  everywhere. Apple/Google-level design comes from restraint and repetition, not from
  giving every section its own look.
- **Depth via shadow, not borders.** Use Tailwind's `shadow-sm`/`shadow-md`/`shadow-lg`
  utilities
  (`06-design-system.md`) for elevation (cards, dropdowns, modals) instead of heavy
  outlines.

## 2. Typography

- One type family for UI, system font stack for performance
  (`-apple-system, "Segoe UI", Roboto, sans-serif` or similar) unless you already picked a
  webfont — don't add a second display font just for headings, it adds a render-blocking
  request for marginal gain.
- Type scale: pick one ratio and stick to it across the whole site — e.g.
  `12 / 14 / 16 / 20 / 24 / 32 / 40px`. Every heading/label/price/body size on every page
  must come from this scale, no one-off font sizes.
- Line-height: 1.4–1.6 for body text, 1.1–1.25 for large headings.

## 3. Spacing & grid

- 8px base unit. All padding/margin/gap values are multiples of 8 (or 4 for tight spots).
- Page content in a max-width container (e.g. 1280px) with consistent side padding at
  every breakpoint, using Tailwind's responsive utilities consistently across pages.

## 4. Motion principles (apply everywhere, not just "animated" components)

- **Duration:** 150–250ms for micro-interactions (hover, button press, price reveal),
  300–450ms for larger transitions (page/section entrances, modal open). Nothing longer
  than ~500ms — this is a shopping site, not a trailer.
- **Easing:** ease-out for things entering/appearing, ease-in for things leaving, never
  linear (reads as robotic/cheap).
- **Motion communicates state**, it doesn't replace it — an element that's loading, added,
  or errored must also be clear from a static screenshot, not motion alone.
- **`prefers-reduced-motion` is mandatory, not optional.** Every animation must have a
  reduced/instant fallback behind this media query — this is an accessibility requirement,
  not a nice-to-have, and it's also your safety net: if an animation ever misbehaves, users
  who opt out never see it.

## 5. Framer Motion vs GSAP — pick one per interaction, don't mix on the same element

| Use case | Tool | Why |
|---|---|---|
| Component enter/exit, hover/tap states, price-reveal on verification, cart add feedback, modal/dropdown open-close, layout reordering (cart quantity change) | **Framer Motion** | Declarative, React-native, small surface area, easy to keep predictable inside component state |
| Hero carousel transitions, scroll-triggered reveals (category grid, promo banners animating in as you scroll), the marquee bar scroll | **GSAP** (+ ScrollTrigger plugin if scroll-based) | Better for timeline control and scroll-linked animation outside normal React re-render cycles |
| Admin dashboard charts/numbers | Framer Motion (simple count-up/fade) — keep admin UI plainer than the storefront, it's a work tool | |

Do not animate the same element's same property with both libraries — pick one owner per
element to avoid conflicting transforms.

## 6. "Do not make it breakable" — mandatory guardrails

These are the rules that keep motion from turning into bugs:

1. **Static-content-first.** Every animated component must render its final, correct
   content in the DOM immediately — animation only affects opacity/transform on top of
   real content. Never animate content *into existence* via JS-only rendering; if JS fails
   or is slow, the user still sees the product, the price, the button.
2. **Animate `transform` and `opacity` only** wherever possible. Never animate `width`,
   `height`, `top`, `left`, or `margin` for motion — these cause layout thrashing and
   visible jank, especially on mobile.
3. **No animation blocks interaction.** A user must be able to click "Add to Cart" or
   "Place Order" the instant it's visible — never gate a real click behind an animation
   finishing.
4. **Every carousel/slider needs a no-JS/failed-load fallback** — e.g. CSS scroll-snap so
   slides are still swipeable/visible if the JS carousel library fails to initialize.
5. **Reduced-motion fallback on every single animated component**, not just the big ones —
   include the marquee scroll and hero carousel auto-advance (reduced motion: no auto-play,
   or drastically slow it, and no parallax/scale effects).
6. **Performance budget:** avoid animating more than a handful of elements at once (e.g.
   don't stagger-animate all 16+ product cards on every page load — animate the first
   visible row, or skip entrance animation for grids entirely and reserve motion for
   hover/interaction states).
7. **Lazy-load GSAP only on pages that use it** (homepage) — don't add it to the global
   bundle used by checkout/admin, where it's dead weight.
8. **Every animated component gets tested with dev tools' CPU throttling** (4x-6x
   slowdown) before merging — if it stutters or the layout shifts under throttling, it's
   not done.
9. **Focus states survive animation.** Keyboard focus rings must remain visible and in the
   correct position through any transition — don't let motion strip or misplace
   `:focus-visible` styling.

## 7. Where motion actually belongs (don't over-apply)

- Hero carousel — GSAP, autoplay + swipe, pauses on hover/reduced-motion.
- Category/use-case circle grids — subtle hover scale (Framer Motion, `whileHover`), no
  entrance animation needed.
- Product card — hover lift (shadow + slight translateY), price reveal fade when
  verification unlocks it.
- Add to cart — button micro-feedback (scale/checkmark), cart icon badge count bump.
- Marquee bar — GSAP infinite scroll, pauses on hover, respects reduced-motion (static
  text instead of scrolling).
- Checkout/forms — validation state transitions only (border color, error text fade-in);
  keep this section calm, it's where people are about to commit to an order.
- Admin panel — minimal motion. This is a work tool; keep it fast and plain over polished.

## 8. Pre-ship checklist for any new animated component

- [ ] Works with JavaScript disabled or failed to load (content still visible/usable)
- [ ] Respects `prefers-reduced-motion`
- [ ] Only animates `transform`/`opacity`
- [ ] No layout shift (check with throttled CPU + slow 3G in devtools)
- [ ] Doesn't delay real interactivity (buttons/links clickable immediately)
- [ ] Keyboard focus visible and correctly positioned throughout
- [ ] Matches the duration/easing rules in Section 4
