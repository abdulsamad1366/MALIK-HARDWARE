# Access Control Matrix

| Capability | Guest | Pending (logged in, unverified) | Verified customer | Admin |
|---|:---:|:---:|:---:|:---:|
| Browse catalog, blog, static pages | ✅ | ✅ | ✅ | ✅ |
| View specs/SKUs | ✅ | ✅ | ✅ | ✅ |
| View wholesale price | ❌ (stripped server-side) | ❌ ("Pending approval" notice) | ✅ | ✅ |
| Add to cart / checkout | ❌ (redirect to login) | ❌ (403) | ✅ | ❌ (admin isn't a buyer) |
| Submit contact form | ✅ | ✅ | ✅ | ✅ |
| See marquee bar | ✅ (read-only) | ✅ (read-only) | ✅ (read-only) | ✅ (read-only on site; editable in `/admin/settings`) |
| Edit marquee text | ❌ | ❌ | ❌ | ✅ |
| Read published blog posts | ✅ | ✅ | ✅ | ✅ |
| Read/write draft blog posts | ❌ | ❌ | ❌ | ✅ |
| Product/order/customer CRUD | ❌ | ❌ | ❌ | ✅ |

Enforcement point for every ❌ above must be the API route handler (`getAuthUser` +
role/verification check), never a client-side conditional alone — same rule as the
original Section 7 price-gate requirement, just extended to the new surfaces.
