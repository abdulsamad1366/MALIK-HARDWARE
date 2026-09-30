# Design System — Minimal & Light Tokens (Tailwind v4)

> Originally written for Tailwind v3 (`tailwind.config.ts` with `theme.extend.colors`).
> Updated to Tailwind v4 (what `create-next-app@latest` installs): same palette,
> same token names, different mechanism. In v4 there is no `tailwind.config.ts`;
> theme tokens are CSS custom properties defined in `app/globals.css` inside an
> `@theme { }` block.

Define these tokens in `app/globals.css` inside `@theme { }`:

```css
/* app/globals.css (excerpt) */
@import "tailwindcss";

@theme {
  /* Backgrounds */
  --color-bg-primary:   #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  --color-bg-tertiary:  #F1F5F9;
  --color-bg-card:      #FFFFFF;

  /* Borders */
  --color-border-subtle: #E2E8F0;
  --color-border-medium: #CBD5E1;

  /* Text */
  --color-text-main:  #0F172A;
  --color-text-muted: #475569;
  --color-text-dim:   #64748B;

  /* Accent colours — used sparingly */
  --color-amber:   #D97706;  /* restrained accent */
  --color-emerald: #059669;  /* stock / success */
  --color-rose:    #E11D48;  /* errors / out of stock */
}
```

In Tailwind v4, `--color-bg-primary` becomes the utility class `bg-bg-primary`,
`--color-text-main` becomes `text-text-main`, etc. — the `--color-` prefix is
stripped by Tailwind's token naming convention.

Used in components as utility classes — `bg-bg-primary`, `text-text-main`,
`border-border-subtle`, etc. — never as a hardcoded hex value in a `className` or
inline `style`.

**Every new component (`MarqueeBar.tsx`, `HeaderMiddle.tsx`, `NavBottom.tsx`, the
homepage sections in `08-homepage-layout.md`, and anything else) must use these theme
classes, not one-off colors.** The marquee bar in particular is an easy place to
accidentally reintroduce a dark band — keep it on `bg-bg-secondary` or
`bg-bg-tertiary` with `text-text-main`, not a custom dark background.

## Spacing & type scale

Tailwind's default spacing scale (4px increments) already satisfies the 8px-base-unit
rule from `09-design-motion-guidelines.md` as long as values are chosen from the scale
(`p-4`, `gap-6`, `mt-8`) rather than arbitrary values (`p-[13px]`) — avoid
arbitrary-value utilities except where a design genuinely can't be expressed on the
standard scale.

For type, use Tailwind's defaults (`text-sm` through `text-4xl`) consistently across
every page — no custom `fontSize` scale unless specifically needed.
