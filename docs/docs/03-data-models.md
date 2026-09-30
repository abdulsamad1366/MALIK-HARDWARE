# Data Models — Prisma / Postgres (Supabase)

> Rewritten from the original Mongoose/MongoDB version to match the finalized stack
> (`ARCHITECTURE.md`). Relations here are real foreign keys, not embedded arrays — that's
> the main structural difference from the old version of this file.

This is the reference `prisma/schema.prisma` shape. Field names/types below are the
contract; exact Prisma syntax (`@id @default(cuid())`, `@relation(...)`, etc.) is
Antigravity's to write, but every field and relation listed here must exist.

```prisma
model User {
  id              String    @id @default(cuid())
  name            String
  email           String    @unique
  passwordHash    String
  role            Role      @default(CUSTOMER)
  isPriceVerified Boolean   @default(false)   // CRITICAL: admin-controlled, gates all pricing
  phone           String?
  companyName     String?
  gstin           String?
  addresses       Address[]
  cart            Cart?
  orders          Order[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum Role {
  CUSTOMER
  ADMIN
}

model Address {
  id          String  @id @default(cuid())
  user        User    @relation(fields: [userId], references: [id])
  userId      String
  fullName    String
  phone       String
  street      String
  city        String
  state       String
  postalCode  String
  country     String
  isDefault   Boolean @default(false)
}

model Category {
  id               String    @id @default(cuid())
  name             String
  slug             String    @unique
  description      String
  placeholderImage String
  displayOrder     Int
  products         Product[]
}

model UseCase {
  id           String    @id @default(cuid())
  name         String              // e.g. "Bathroom", "Main Entrance"
  slug         String    @unique
  image        String              // circular thumbnail; falls back per image policy
  displayOrder Int
  products     Product[]           // implicit many-to-many via Prisma
}

model Product {
  id           String    @id @default(cuid())
  name         String
  slug         String    @unique
  category     Category  @relation(fields: [categoryId], references: [id])
  categoryId   String
  useCases     UseCase[]           // many-to-many: a product can serve several use cases
  brand        String
  price        Decimal             // PRICE GATE: never serialize this field for a
                                    // request that fails the isPriceVerified check
  description  String
  specs        Json                // array of { key, value } — technical spec table
  imageUrl     String?             // falls back per the image policy if unset
  stockStatus  StockStatus @default(IN_STOCK)
  featured     Boolean   @default(false)
  cartItems    CartItem[]
  orderItems   OrderItem[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

enum StockStatus {
  IN_STOCK
  OUT_OF_STOCK
  ON_REQUEST
}

model Cart {
  id        String     @id @default(cuid())
  user      User       @relation(fields: [userId], references: [id])
  userId    String     @unique
  items     CartItem[]
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String   @id @default(cuid())
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  cartId    String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  quantity  Int      @default(1)
  addedAt   DateTime @default(now())
}

model Order {
  id            String      @id @default(cuid())
  orderNumber   String      @unique   // format: MHM-YYYYMMDD-XXXX
  user          User        @relation(fields: [userId], references: [id])
  userId        String
  items         OrderItem[]
  subtotal      Decimal
  taxAmount     Decimal
  totalAmount   Decimal
  shippingAddress Json      // snapshot at order time — name/phone/street/city/state/postalCode/country
  status        OrderStatus @default(PENDING)
  paymentMethod PaymentMethod
  notes         String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  CASH_ON_DELIVERY
  TRADE_CREDIT
}

model OrderItem {
  id          String  @id @default(cuid())
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId     String
  product     Product @relation(fields: [productId], references: [id])
  productId   String
  productName String            // snapshot — survives if the product is later renamed/deleted
  unitPrice   Decimal           // price locked in at order time, not looked up later
  quantity    Int
  lineTotal   Decimal
}

// --- Content / admin-editable models ---

model SiteSettings {
  id             String   @id @default(cuid())  // enforce single-row in app logic (findFirst + upsert)
  marqueeMessage String   @default("")           // empty = marquee bar collapses
  updatedById    String?
  updatedAt      DateTime @updatedAt
}

model BlogPost {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String
  content     String              // markdown or HTML — pick one, be consistent
  coverImage  String?             // falls back per image policy if unset
  authorName  String
  isPublished Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model HeroSlide {
  id           String  @id @default(cuid())
  imageUrl     String              // falls back to hero-banner.jpg if unset
  headline     String?
  linkUrl      String?
  displayOrder Int
  isActive     Boolean @default(true)
}

model PromoBanner {
  id           String  @id @default(cuid())
  title        String              // e.g. "Aldrop"
  image        String
  linkUrl      String
  displayOrder Int
  isActive     Boolean @default(true)
}
```

## Notes carried over from the original design

- `Product.price` (a `Decimal`) is the single field the whole access-control system exists
  to protect — see `ARCHITECTURE.md` Section 3. It must never appear in a JSON response to
  a request that fails the `isPriceVerified` check, at the query/serialization level (e.g.
  a Prisma `select` that omits `price` for ungated requests), not stripped after the fact
  in a way that's easy to forget on a new endpoint.
- `OrderItem` snapshots `productName` and `unitPrice` at order time — orders must stay
  accurate even if a product is later renamed, re-priced, or deleted.
- `HeroSlide` and `PromoBanner` are admin-editable (same CRUD pattern as `/admin/products`),
  per the original assumption — flag it if you'd rather these be static/hardcoded instead.
- `Category` vs `UseCase`: still two separate taxonomies, not the same list twice — a
  product has one category and can have several use cases.
