import { HoldingsPayload } from "@/lib/types";

export interface HoldingsProvider {
  getHoldings(slug: string): Promise<HoldingsPayload>;
}
