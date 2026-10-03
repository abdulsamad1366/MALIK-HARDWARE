/**
 * prisma/seed.ts — Development seed script.
 *
 * Creates:
 *   - 3 test users from 07-test-accounts.md (admin, verified customer, pending customer)
 *   - 4 categories (Locks, Hinges, Handles & Pulls, Fasteners)
 *   - 2 use cases (Bathroom, Main Entrance)
 *   - 6 sample products spread across categories, with prices
 *   - 1 SiteSettings row (marquee message)
 *   - 2 HeroSlides, 3 PromoBanners
 *
 * Run via: npm run db:seed
 * Safe to re-run — uses upsert on unique fields.
 *
 * WARNING: Contains real credentials from 07-test-accounts.md.
 * These are for local dev only. Remove demo-login buttons before deploying
 * (see AGENTS.md "DON'T" section).
 */

import { PrismaClient, Role, StockStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // -------------------------------------------------------------------------
  // Users — 3 tiers from 07-test-accounts.md
  // -------------------------------------------------------------------------
  const [adminHash, customerHash, pendingHash] = await Promise.all([
    bcrypt.hash("AdminMalikHardware#2026", 12),
    bcrypt.hash("CustomerPass#2026", 12),
    bcrypt.hash("PendingPass#2026", 12),
  ]);

  const admin = await db.user.upsert({
    where: { email: "admin@malikhardware.com" },
    update: {},
    create: {
      name: "Malik Hardware Admin",
      email: "admin@malikhardware.com",
      passwordHash: adminHash,
      role: Role.ADMIN,
      isPriceVerified: true,
      companyName: "Malik Hardware Mart",
    },
  });

  const verifiedCustomer = await db.user.upsert({
    where: { email: "customer@sharmabuilders.com" },
    update: {},
    create: {
      name: "Sharma Builders",
      email: "customer@sharmabuilders.com",
      passwordHash: customerHash,
      role: Role.CUSTOMER,
      isPriceVerified: true,
      companyName: "Sharma Builders Pvt. Ltd.",
      phone: "+91 98765 43210",
    },
  });

  const pendingCustomer = await db.user.upsert({
    where: { email: "pending@contractor.com" },
    update: {},
    create: {
      name: "Ravi Contractor",
      email: "pending@contractor.com",
      passwordHash: pendingHash,
      role: Role.CUSTOMER,
      isPriceVerified: false, // pending — price gate will block this account
      companyName: "Ravi & Sons Contractors",
    },
  });

  console.log(`  ✓ Users: ${admin.email}, ${verifiedCustomer.email}, ${pendingCustomer.email}`);

  // -------------------------------------------------------------------------
  // Categories — the 7-division catalog structure
  // -------------------------------------------------------------------------
  const categoriesData = [
    {
      name: "Locks",
      slug: "locks",
      description: "Mortise locks, deadbolts, padlocks, and digital locks for all security needs.",
      placeholderImage: "/images/categories/locks.jpg",
      displayOrder: 1,
    },
    {
      name: "Hinges",
      slug: "hinges",
      description: "Butt hinges, concealed hinges, piano hinges for doors, cabinets, and furniture.",
      placeholderImage: "/images/categories/hinges.jpg",
      displayOrder: 2,
    },
    {
      name: "Handles & Pulls",
      slug: "handles-pulls",
      description: "Door handles, cabinet pulls, knobs, and aldrop bolts in multiple finishes.",
      placeholderImage: "/images/categories/handles.jpg",
      displayOrder: 3,
    },
    {
      name: "Fasteners",
      slug: "fasteners",
      description: "Screws, bolts, nuts, anchors, and rivets for construction and manufacturing.",
      placeholderImage: "/images/categories/fasteners.jpg",
      displayOrder: 4,
    },
    {
      name: "Aldrops & Bolts",
      slug: "aldrops-bolts",
      description: "Heavy duty tower bolts, aldrops, barrel bolts and padbolts.",
      placeholderImage: "/images/categories/aldrops.jpg",
      displayOrder: 5,
    },
    {
      name: "Door Closers",
      slug: "door-closers",
      description: "Hydraulic overhead door closers, floor springs and pivot sets.",
      placeholderImage: "/images/categories/door-closers.jpg",
      displayOrder: 6,
    },
    {
      name: "Cabinet Fittings",
      slug: "cabinet-fittings",
      description: "Tandem boxes, soft close drawer channels, wardrobe lift systems.",
      placeholderImage: "/images/categories/cabinet-fittings.jpg",
      displayOrder: 7,
    },
    {
      name: "Glass Hardware",
      slug: "glass-hardware",
      description: "Patch fittings, spider brackets, shower hinges and glass connectors.",
      placeholderImage: "/images/categories/glass-hardware.jpg",
      displayOrder: 8,
    },
    {
      name: "Sliding Systems",
      slug: "sliding-systems",
      description: "Heavy duty sliding door rollers, tracks, top-hung and bottom rollers.",
      placeholderImage: "/images/categories/sliding-systems.jpg",
      displayOrder: 9,
    },
    {
      name: "Kitchen Hardware",
      slug: "kitchen-hardware",
      description: "Stainless steel modular wire baskets, spice racks, tall units and pantry pullouts.",
      placeholderImage: "/images/categories/kitchen-hardware.jpg",
      displayOrder: 10,
    },
    {
      name: "Tools & Equipment",
      slug: "tools-equipment",
      description: "Industrial hand tools, power tools, measuring instruments and workshop supplies.",
      placeholderImage: "/images/categories/tools.jpg",
      displayOrder: 11,
    },
    {
      name: "Adhesives & Sealants",
      slug: "adhesives-sealants",
      description: "Silicone sealants, acrylic sealants, masking tape and construction adhesive.",
      placeholderImage: "/images/categories/adhesives.jpg",
      displayOrder: 12,
    },
    {
      name: "Safes & Security",
      slug: "safes-security",
      description: "Biometric and digital electronic safes, hotel lockers, cash boxes.",
      placeholderImage: "/images/categories/safes.jpg",
      displayOrder: 13,
    },
    {
      name: "Curtain Hardware",
      slug: "curtain-hardware",
      description: "Architectural curtain rods, finials, brackets, runners and motorized tracks.",
      placeholderImage: "/images/categories/curtain-hardware.jpg",
      displayOrder: 14,
    },
  ];

  for (const cat of categoriesData) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        placeholderImage: cat.placeholderImage,
        displayOrder: cat.displayOrder,
      },
      create: cat,
    });
  }

  const locksCat = await db.category.findUniqueOrThrow({ where: { slug: "locks" } });
  const hingesCat = await db.category.findUniqueOrThrow({ where: { slug: "hinges" } });
  const handlesCat = await db.category.findUniqueOrThrow({ where: { slug: "handles-pulls" } });
  const fastenersCat = await db.category.findUniqueOrThrow({ where: { slug: "fasteners" } });

  console.log(`  ✓ Categories: ${categoriesData.length} categories seeded`);

  // -------------------------------------------------------------------------
  // Use Cases
  // -------------------------------------------------------------------------
  const bathroomUC = await db.useCase.upsert({
    where: { slug: "bathroom" },
    update: {},
    create: {
      name: "Bathroom",
      slug: "bathroom",
      image: "/images/use-cases/bathroom.jpg",
      displayOrder: 1,
    },
  });

  const entranceUC = await db.useCase.upsert({
    where: { slug: "main-entrance" },
    update: {},
    create: {
      name: "Main Entrance",
      slug: "main-entrance",
      image: "/images/use-cases/main-entrance.jpg",
      displayOrder: 2,
    },
  });

  const bedroomUC = await db.useCase.upsert({
    where: { slug: "bedroom" },
    update: {},
    create: {
      name: "Bedroom",
      slug: "bedroom",
      image: "/images/use-cases/bedroom.jpg",
      displayOrder: 3,
    },
  });

  console.log("  ✓ Use cases: bathroom, main-entrance, bedroom");

  // -------------------------------------------------------------------------
  // Products — 6 samples with real spec tables
  // -------------------------------------------------------------------------
  const mortiseLock = await db.product.upsert({
    where: { slug: "yale-mortise-lock-y585" },
    update: { imageUrl: "/images/products/yale-mortise-lock.jpg" },
    create: {
      name: "Yale Mortise Lock Y585",
      slug: "yale-mortise-lock-y585",
      categoryId: locksCat.id,
      useCases: { connect: [{ id: entranceUC.id }, { id: bedroomUC.id }] },
      brand: "Yale",
      price: 1850,
      description: "Heavy-duty 5-lever mortise lock for wooden doors. Satin chrome finish. Suitable for main entrance and bedroom doors.",
      imageUrl: "/images/products/yale-mortise-lock.jpg",
      specs: [
        { key: "Body Material", value: "Zinc alloy" },
        { key: "Finish", value: "Satin Chrome" },
        { key: "Backset", value: "60 mm" },
        { key: "Door Thickness", value: "35–45 mm" },
        { key: "Levers", value: "5" },
      ],
      stockStatus: StockStatus.IN_STOCK,
      featured: true,
    },
  });

  const digitalLock = await db.product.upsert({
    where: { slug: "godrej-digital-lock-nx" },
    update: { imageUrl: "/images/products/godrej-digital-lock.jpg" },
    create: {
      name: "Godrej NX Digital Lock",
      slug: "godrej-digital-lock-nx",
      categoryId: locksCat.id,
      useCases: { connect: [{ id: entranceUC.id }] },
      brand: "Godrej",
      price: 7200,
      description: "Biometric + PIN + key digital door lock. Anti-peep feature, low battery alert, 100 fingerprints capacity.",
      imageUrl: "/images/products/godrej-digital-lock.jpg",
      specs: [
        { key: "Authentication", value: "Fingerprint / PIN / Key" },
        { key: "Fingerprint Capacity", value: "100" },
        { key: "PIN Capacity", value: "50" },
        { key: "Battery", value: "4 × AA" },
        { key: "Finish", value: "Antique Brass" },
      ],
      stockStatus: StockStatus.IN_STOCK,
      featured: true,
    },
  });

  const buttHinge = await db.product.upsert({
    where: { slug: "stainless-butt-hinge-4inch" },
    update: { imageUrl: "/images/products/ss-butt-hinge.jpg" },
    create: {
      name: "SS Butt Hinge 4 Inch (Pair)",
      slug: "stainless-butt-hinge-4inch",
      categoryId: hingesCat.id,
      useCases: { connect: [{ id: entranceUC.id }, { id: bedroomUC.id }] },
      brand: "Dorset",
      price: 95,
      description: "304 grade stainless steel butt hinge for wooden/metal doors. Ball bearing, anti-rust coating. Sold in pairs.",
      imageUrl: "/images/products/ss-butt-hinge.jpg",
      specs: [
        { key: "Size", value: "4 × 3 × 3 mm" },
        { key: "Material", value: "SS 304" },
        { key: "Finish", value: "Satin" },
        { key: "Load Capacity", value: "80 kg" },
        { key: "Bearings", value: "Ball bearing" },
      ],
      stockStatus: StockStatus.IN_STOCK,
      featured: false,
    },
  });

  const aldropBolt = await db.product.upsert({
    where: { slug: "aldrop-tower-bolt-12inch" },
    update: { imageUrl: "/images/products/aldrop-tower-bolt.jpg" },
    create: {
      name: "Aldrop Tower Bolt 12 Inch",
      slug: "aldrop-tower-bolt-12inch",
      categoryId: handlesCat.id,
      useCases: { connect: [{ id: bathroomUC.id }, { id: bedroomUC.id }] },
      brand: "Tata Agrico",
      price: 145,
      description: "Heavy-duty 12-inch tower bolt / aldrop for main doors and gates. Powder-coated finish.",
      imageUrl: "/images/products/aldrop-tower-bolt.jpg",
      specs: [
        { key: "Length", value: "12 inches (300 mm)" },
        { key: "Material", value: "Mild Steel" },
        { key: "Finish", value: "Powder Coated Black" },
        { key: "Barrel Dia", value: "16 mm" },
      ],
      stockStatus: StockStatus.IN_STOCK,
      featured: true,
    },
  });

  const cabinetPull = await db.product.upsert({
    where: { slug: "cp-cabinet-pull-128mm" },
    update: { imageUrl: "/images/products/cabinet-pull.jpg" },
    create: {
      name: "CP Cabinet Pull Handle 128mm",
      slug: "cp-cabinet-pull-128mm",
      categoryId: handlesCat.id,
      useCases: { connect: [{ id: bathroomUC.id }] },
      brand: "Hafele",
      price: 220,
      description: "Chrome plated zinc alloy cabinet pull handle. Centre-to-centre 128 mm. For kitchen and wardrobe cabinets.",
      imageUrl: "/images/products/cabinet-pull.jpg",
      specs: [
        { key: "C-C Distance", value: "128 mm" },
        { key: "Total Length", value: "160 mm" },
        { key: "Material", value: "Zinc alloy" },
        { key: "Finish", value: "Chrome Plated" },
      ],
      stockStatus: StockStatus.IN_STOCK,
      featured: false,
    },
  });

  const anchorBolt = await db.product.upsert({
    where: { slug: "rawl-anchor-bolt-m8" },
    update: { imageUrl: "/images/products/rawl-anchor-bolt.jpg" },
    create: {
      name: "Rawlplug Anchor Bolt M8 × 80mm (Box of 50)",
      slug: "rawl-anchor-bolt-m8",
      categoryId: fastenersCat.id,
      useCases: {},
      brand: "Rawlplug",
      price: 680,
      description: "Wedge anchor bolt for concrete and brick fixing. M8 × 80 mm. Zinc electroplated. Box of 50 pieces.",
      imageUrl: "/images/products/rawl-anchor-bolt.jpg",
      specs: [
        { key: "Thread", value: "M8" },
        { key: "Length", value: "80 mm" },
        { key: "Material", value: "Carbon Steel" },
        { key: "Finish", value: "Zinc Electroplated" },
        { key: "Pack Size", value: "50 pcs" },
      ],
      stockStatus: StockStatus.IN_STOCK,
      featured: false,
    },
  });

  console.log(`  ✓ Products: ${mortiseLock.name}, ${digitalLock.name}, ${buttHinge.name}, ${aldropBolt.name}, ${cabinetPull.name}, ${anchorBolt.name}`);

  // -------------------------------------------------------------------------
  // SiteSettings — single row, upsert by findFirst logic
  // -------------------------------------------------------------------------
  const existing = await db.siteSettings.findFirst();
  if (!existing) {
    await db.siteSettings.create({
      data: {
        marqueeMessage:
          "🔒 Welcome to Malik Hardware Mart — Wholesale Hardware, Fasteners & Tools | Register to apply for wholesale pricing access",
      },
    });
    console.log("  ✓ SiteSettings: marquee message created");
  } else {
    console.log("  ✓ SiteSettings: already exists, skipped");
  }

  // -------------------------------------------------------------------------
  // HeroSlides
  // -------------------------------------------------------------------------
  const heroSlugs = ["hero-1", "hero-2"];
  for (const [i, s] of heroSlugs.entries()) {
    const exists = await db.heroSlide.findFirst({ where: { headline: `Slide ${i + 1}` } });
    if (!exists) {
      await db.heroSlide.create({
        data: {
          imageUrl: `/images/hero/hero-${i + 1}.jpg`,
          headline: i === 0 ? "Quality Hardware for Trade Buyers" : "Trusted by 500+ Contractors Across India",
          linkUrl: "/products",
          displayOrder: i + 1,
          isActive: true,
        },
      });
    }
  }
  console.log("  ✓ HeroSlides: 2 slides");

  // -------------------------------------------------------------------------
  // PromoBanners
  // -------------------------------------------------------------------------
  const banners = [
    { title: "Pulls", image: "/images/promo/pulls_clean.jpg", linkUrl: "/category/cabinet-fittings", order: 1 },
    { title: "Aldrop", image: "/images/promo/aldrop_clean.jpg", linkUrl: "/category/aldrops", order: 2 },
    { title: "Mortise Locks", image: "/images/promo/mortise_locks_clean.jpg", linkUrl: "/category/locks", order: 3 },
    { title: "Door Lock", image: "/images/promo/door_lock_clean.jpg", linkUrl: "/category/locks", order: 4 },
    { title: "Door Stopper", image: "/images/promo/door_stopper_clean.jpg", linkUrl: "/category/door-closers", order: 5 },
    { title: "Tower Bolt", image: "/images/promo/tower_bolt_clean.jpg", linkUrl: "/category/aldrops", order: 6 },
  ];

  for (const b of banners) {
    const existing = await db.promoBanner.findFirst({ where: { title: b.title } });
    if (existing) {
      await db.promoBanner.update({
        where: { id: existing.id },
        data: { image: b.image, linkUrl: b.linkUrl, displayOrder: b.order, isActive: true },
      });
    } else {
      await db.promoBanner.create({
        data: { title: b.title, image: b.image, linkUrl: b.linkUrl, displayOrder: b.order, isActive: true },
      });
    }
  }
  console.log(`  ✓ PromoBanners: ${banners.length} banners`);

  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
