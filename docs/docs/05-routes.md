# Routes

## Pages (✨ = new in this revision)

```
/                          Home
/products                  Catalog
/products/[slug]           Product detail
/category/[category-slug]  Category listing
/cart                      Cart (auth required)
/checkout                  Checkout (auth + verified required)
/orders, /orders/[id]      Order history / invoice
/login, /register, /account
/our-story                 ✨ static page
/about-us                  ✨ static page
/contact-us                ✨ static page + form
/blog                      ✨ published post list
/blog/[slug]                ✨ single post
/admin, /admin/products, /admin/orders, /admin/customers
/admin/settings             ✨ marquee editor
/admin/blog                 ✨ (optional but recommended) blog CRUD
```

## API routes (✨ = new)

```
GET  /api/products, /api/products/[slug]      price-gated
GET  /api/categories
POST /api/auth/register|login|logout, GET /api/auth/me
GET/POST /api/cart, PUT/DELETE /api/cart/[itemId]   verified-guarded
POST /api/checkout                                   verified-guarded
GET  /api/orders, /api/orders/[id]
GET  /api/admin/products|orders|customers|stats, mutations under /api/admin/*
✨ GET  /api/blog, /api/blog/[slug]                    published-only for public
✨ GET/POST/PUT/DELETE /api/admin/blog, /api/admin/blog/[id]   admin-only
✨ GET  /api/settings                                   public read (marquee text)
✨ PUT  /api/admin/settings                             admin-only write
✨ POST /api/contact                                    public, no auth
✨ GET  /api/hero-slides                                active slides only
✨ GET  /api/use-cases
✨ GET  /api/promo-banners                              active only
✨ GET/POST/PUT/DELETE /api/admin/hero-slides|use-cases|promo-banners   admin-only
```

See `08-homepage-layout.md` for how these compose into the homepage.
