import { PriceProvider, PriceRange } from "./PriceProvider";
import { PricePoint } from "@/lib/types";

export class MockPriceProvider implements PriceProvider {
  async getSeries(slug: string, range: PriceRange): Promise<PricePoint[]> {
    const points = range === "1Y" ? 12 : range === "3Y" ? 36 : 60;
    const series: PricePoint[] = [];
    let value = 100 + slug.length;

    for (let i = 0; i < points; i += 1) {
      value = value * (1 + (Math.sin(i / 5) * 0.01 + 0.003));
      series.push({
        date: new Date(2020, i, 1).toISOString().slice(0, 10),
        close: Number(value.toFixed(2))
      });
    }

    return series;
  }
}
