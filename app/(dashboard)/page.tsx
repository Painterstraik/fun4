import { prisma } from "@/lib/db/client";
import { ProductCard } from "@/components/ProductCard";
import { parseScenarioDefaults } from "@/lib/db/serialize";
import { Product } from "@/lib/types";

export default async function DashboardPage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  const hydrated = products.map((product) => ({
    ...product,
    scenarioDefaults: parseScenarioDefaults(product.scenarioDefaults)
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Fund4 Produkte</h1>
        <p className="text-sm text-slate-600">
          Vier ausgewaehlte Produkte mit Performance, Holdings und Sparplan-Simulation.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {hydrated.map((product) => (
          <ProductCard key={product.slug} product={product as unknown as Product} />
        ))}
      </div>
    </div>
  );
}
