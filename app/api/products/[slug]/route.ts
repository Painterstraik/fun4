import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { parseScenarioDefaults } from "@/lib/db/serialize";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ product: { ...product, scenarioDefaults: parseScenarioDefaults(product.scenarioDefaults) } });
}
