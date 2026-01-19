import { NextResponse } from "next/server";
import { StaticHoldingsProvider } from "@/lib/providers/StaticHoldingsProvider";

const provider = new StaticHoldingsProvider();

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const holdings = await provider.getHoldings(params.slug);
  return NextResponse.json({ holdings });
}
