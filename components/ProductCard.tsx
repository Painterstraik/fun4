import Link from "next/link";
import { Product } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const typeLabel: Record<Product["type"], string> = {
  trend: "Trend / Multi-Asset",
  fund_bond: "Rentenfonds",
  fund_equity: "Aktienfonds",
  index: "Index"
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription className="mt-1">{product.description}</CardDescription>
          </div>
          <Badge variant="secondary">{typeLabel[product.type]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        <p>{product.riskHint}</p>
      </CardContent>
      <CardFooter className="mt-auto flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/products/${product.slug}`}>Details</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href={`/simulate/${product.slug}`}>Simulieren</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
