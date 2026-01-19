import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { parseScenarioDefaults } from "@/lib/db/serialize";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  const hydrated = products.map((product) => ({
    ...product,
    scenarioDefaults: parseScenarioDefaults(product.scenarioDefaults)
  }));
  return NextResponse.json({ products: hydrated });
}
