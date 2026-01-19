import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { CsvPriceProvider } from "@/lib/providers/CsvPriceProvider";
import { StaticHoldingsProvider } from "@/lib/providers/StaticHoldingsProvider";
import { PriceChartSection } from "@/components/PriceChartSection";
import { HoldingsTable } from "@/components/HoldingsTable";
import { HoldingsPieChart } from "@/components/HoldingsPieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const priceProvider = new CsvPriceProvider();
const holdingsProvider = new StaticHoldingsProvider();

const typeLabel: Record<string, string> = {
  trend: "Trend / Multi-Asset",
  fund_bond: "Rentenfonds",
  fund_equity: "Aktienfonds",
  index: "Index"
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}.${month}.${year.slice(2)}`;
};

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });

  if (!product) {
    return <div>Produkt nicht gefunden.</div>;
  }

  const series = await priceProvider.getSeries(product.slug, "MAX");
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const change = last && prev ? ((last.close - prev.close) / prev.close) * 100 : 0;
  const holdings = await holdingsProvider.getHoldings(product.slug);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-sm text-slate-600">{product.description}</p>
        </div>
        <Badge variant="secondary">{typeLabel[product.type] ?? product.type}</Badge>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Preisverlauf</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceChartSection slug={product.slug} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase text-slate-500">Letzter Kurs</p>
            <p className="text-lg font-semibold">
              {last ? last.close.toFixed(2) : "-"} EUR
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase text-slate-500">Veraenderung (Vormonat)</p>
            <p className="text-lg font-semibold">{change.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase text-slate-500">Datenstand</p>
            <p className="text-lg font-semibold">{formatDate(last?.date)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="w-full max-w-2xl">
            <HoldingsPieChart holdings={holdings} />
          </div>
          <div className="w-full">
            <HoldingsTable holdings={holdings} />
          </div>
        </CardContent>
      </Card>

      <Button asChild className="w-full md:w-auto">
        <Link href={`/simulate/${product.slug}`}>Simulation starten</Link>
      </Button>
    </div>
  );
}
