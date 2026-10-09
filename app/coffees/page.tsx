import type { Metadata } from "next";
import { PageHead } from "@/components/page-head";
import { getShop } from "@/lib/flowra";
import { RoastFilter } from "./roast-filter";

export const revalidate = 60;
export const metadata: Metadata = { title: "Coffees" };

export default async function CoffeesPage() {
  const coffees = await getShop();
  return (
    <div>
      <PageHead title="Coffees" />
      <RoastFilter coffees={coffees} />
    </div>
  );
}
