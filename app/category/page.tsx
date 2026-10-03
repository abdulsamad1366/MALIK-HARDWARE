/**
 * app/category/page.tsx — Redirects /category to /categories
 */

import { redirect } from "next/navigation";

export default function CategoryIndexPage() {
  redirect("/categories");
}
