import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { parseJson } from "@/lib/db/serialize";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const simulation = await prisma.simulation.findUnique({
    where: { id: params.id },
    include: { product: true }
  });

  if (!simulation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: simulation.id,
    product: simulation.product,
    input: {
      monthlyContribution: simulation.monthlyContribution,
      durationYears: simulation.durationYears,
      feesPa: simulation.feesPa,
      returnsPa: simulation.returnsPa
    },
    result: parseJson(simulation.result, { series: [], kpis: { finalValue: 0, totalInvested: 0, profit: 0 } })
  });
}
