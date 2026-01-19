import { PricePoint } from "@/lib/types";

export type PriceRange = "1Y" | "3Y" | "MAX";

export interface PriceProvider {
  getSeries(slug: string, range: PriceRange): Promise<PricePoint[]>;
}
