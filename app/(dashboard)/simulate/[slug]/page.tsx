import { prisma } from "@/lib/db/client";
import { SimulationPageClient } from "@/components/SimulationPageClient";
import { parseScenarioDefaults } from "@/lib/db/serialize";
import { Product } from "@/lib/types";

export default async function SimulationPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });

  if (!product) {
    return <div>Produkt nicht gefunden.</div>;
  }

  const hydrated = {
    ...product,
    scenarioDefaults: parseScenarioDefaults(product.scenarioDefaults)
  } as unknown as Product;

  return <SimulationPageClient product={hydrated} />;
}
