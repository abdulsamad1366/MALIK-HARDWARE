# Design QA — Apple HIG Audit Process

This is a **process**, not a rules list — run it against real, built pages, not the spec.
Complements `09-design-motion-guidelines.md` (which sets the bar going in) by catching what
actually shipped versus what was intended.

## Tooling note (Claude Code vs Antigravity)

The install commands below are Claude Code plugin syntax:
```
/plugin marketplace add https://github.com/NutshellEngineering/apple-design-skill
/plugin install apple-design-skill@apple-design-skill-marketplace
```
and, for a web-translated version of Apple's principles (from Emil Kowalski, who built
Sonner/Vaul):
```
npx skills@latest add emilkowalski/skills
```
If Antigravity doesn't support this plugin format, the install step doesn't carry over —
but the audit prompt template below is tool-agnostic. It can be run through Claude directly
(paste the page's HTML/CSS, or give a live URL for fetching) with the same effect: a
prioritized, numbers-based list of concrete issues rather than a vague "make it nicer"
critique. Both mirror Apple's published HIG — a reference, not a license to imitate Apple's
literal look; the goal is applying the underlying principles to Malik Hardware Mart's own
visual identity (light/minimal, per `06-design-system.md`), not making it look like Apple.

## The audit prompt (use as-is)

Run this against a finished page/section — not the whole site at once, and not against a
half-built page:

```
Audit this page against Apple's Human Interface Guidelines.

URL / files: [page URL, or paste HTML+CSS]

Go section by section, top to bottom. For each problem found, give:
- The element, specific enough to locate it
- Which principle it breaks, named
- Current value and target value, as numbers where numbers apply
- Impact: does this make the page feel cheap, or is it a nitpick

Rules:
- No praise — don't list what already works.
- No suggestions requiring new copy, new photography, or a redesign — CSS-only fixes.
- Sort by impact, not by position on the page.
- If a section is genuinely fine, say "fine" and move on — don't invent problems to fill
  a quota.
```

The "permission to say nothing is wrong" rule matters — without it, every audit manufactures
a full list of nitpicks regardless of actual quality.

## What this typically catches (per the source of this process)

- A type scale with no consistent ratio, so headings and body text feel unrelated
- Inconsistent spacing (e.g. 24px padding in one card, 20px in the next, no reason for the
  difference) — directly relevant since `06-design-system.md`'s 8px-unit spacing rule exists
  specifically to prevent this
- Too many font weights where one weight plus better spacing would do the job
- Contrast that passes on paper but fails on a phone screen in daylight
- Corner radii that don't nest cleanly (inner element looks glued into its container rather
  than sitting inside it)

## Fix-in-passes discipline (don't fix everything at once)

```
Take only the top three items from the audit. Change nothing else.
Show the CSS diff before applying it.
Then re-run the audit on just those sections and confirm they now pass.
```
Three at a time, each round verified, rather than one large unreviewable rewrite that risks
breaking something outside the areas being fixed — this is the same "surgical changes"
discipline as `AGENTS.md`'s Karpathy-derived rules, applied specifically to CSS/design fixes.

## When to run this in the build

Once per major surface, after it's functionally complete but before calling it done:
nav bar (all 3 parts), homepage (hero carousel through product grid), product detail page,
cart/checkout flow, and the admin panel (lower bar is fine there per
`09-design-motion-guidelines.md` Section 7). Not useful to run against a page still missing
real content or styling — audit what's actually finished.

## Troubleshooting

- **Nothing happens / feels generic:** name the process explicitly rather than asking for
  something vague like "make this nicer."
- **Can't see the page:** provide the HTML/CSS directly, or a URL if fetch access is
  available.
- **Every finding is vague ("consider adjusting"):** re-assert the numbers-only rule from
  the prompt above.
- **It starts suggesting an Apple-style redesign:** redirect it back to applying the
  underlying principles to Malik Hardware Mart's own light/minimal identity, not imitating
  Apple's specific look.
