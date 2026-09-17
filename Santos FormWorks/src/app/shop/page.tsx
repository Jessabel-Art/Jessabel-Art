import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Catalog } from "@/components/catalog";
export const metadata: Metadata = { title: "Shop 3D printed products" };
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <PageHero kind="shop" />
      <Catalog
        key={`${params.q ?? ""}-${params.category ?? ""}`}
        initialQuery={typeof params.q === "string" ? params.q : ""}
        initialCategory={
          typeof params.category === "string" ? params.category : undefined
        }
      />
    </>
  );
}
