import { readFile } from "fs/promises";
import path from "path";
import { PricePoint } from "@/lib/types";
import { PriceProvider, PriceRange } from "./PriceProvider";

export class CsvPriceProvider implements PriceProvider {
  async getSeries(slug: string, range: PriceRange): Promise<PricePoint[]> {
    const filePath = path.join(process.cwd(), "data", "prices", `${slug}.csv`);
    const csv = await readFile(filePath, "utf-8");
    const lines = csv.trim().split("\n").slice(1);

    const data = lines
      .map((line) => {
        const [date, close] = line.split(",");
        return { date, close: Number(close) };
      })
      .filter((point) => !Number.isNaN(point.close));

    if (range === "MAX") {
      return data;
    }

    const months = range === "1Y" ? 12 : 36;
    return data.slice(-months);
  }
}
