import { readFile } from "fs/promises";
import path from "path";
import { HoldingsPayload } from "@/lib/types";
import { HoldingsProvider } from "./HoldingsProvider";

export class StaticHoldingsProvider implements HoldingsProvider {
  async getHoldings(slug: string): Promise<HoldingsPayload> {
    const filePath = path.join(process.cwd(), "data", "holdings", `${slug}.json`);
    const json = await readFile(filePath, "utf-8");
    return JSON.parse(json) as HoldingsPayload;
  }
}
