"use client";

import { useEffect, useState } from "react";
import { PricePoint } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceChart } from "@/components/PriceChart";

const ranges = ["1Y", "3Y", "MAX"] as const;

type Range = (typeof ranges)[number];

export function PriceChartSection({ slug }: { slug: string }) {
  const [range, setRange] = useState<Range>("3Y");
  const [data, setData] = useState<PricePoint[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/products/${slug}/prices?range=${range}`);
      const payload = await response.json();
      setData(payload.series ?? []);
    };

    load().catch(console.error);
  }, [slug, range]);

  return (
    <Tabs value={range} onValueChange={(value) => setRange(value as Range)}>
      <TabsList>
        {ranges.map((value) => (
          <TabsTrigger key={value} value={value}>
            {value}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={range}>
        <PriceChart data={data} />
      </TabsContent>
    </Tabs>
  );
}
