import { NextResponse } from "next/server";
import { CsvPriceProvider } from "@/lib/providers/CsvPriceProvider";
import { MockPriceProvider } from "@/lib/providers/MockPriceProvider";
import { PriceRange } from "@/lib/providers/PriceProvider";

const provider = new CsvPriceProvider();
const fallback = new MockPriceProvider();

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(request.url);
  const rawRange = searchParams.get("range") ?? "3Y";
  const range = (["1Y", "3Y", "MAX"].includes(rawRange) ? rawRange : "3Y") as PriceRange;

  try {
    const series = await provider.getSeries(params.slug, range);
    return NextResponse.json({ series });
  } catch (error) {
    console.error(error);
    const series = await fallback.getSeries(params.slug, range);
    return NextResponse.json({ series, fallback: true });
  }
}
