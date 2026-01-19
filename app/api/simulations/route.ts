import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/client";
import { parseScenarioDefaults } from "@/lib/db/serialize";
import { simulateInvestment } from "@/lib/simulation/simulate";

const schema = z.object({
  productSlug: z.string(),
  monthlyContribution: z.number().min(0),
  durationYears: z.number().min(1).max(60),
  feesPa: z.number().min(0).max(0.2),
  scenario: z.enum(["conservative", "base", "optimistic"])
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const data = schema.parse(payload);

  const product = await prisma.product.findUnique({ where: { slug: data.productSlug } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const scenarioDefaults = parseScenarioDefaults(product.scenarioDefaults);

  const returnsPa = scenarioDefaults[data.scenario];
  const months = data.durationYears * 12;
  const result = simulateInvestment({
    monthlyContribution: data.monthlyContribution,
    months,
    returnsPa,
    feesPa: data.feesPa
  });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const simulation = await prisma.simulation.create({
    data: {
      productId: product.id,
      userId: user?.id,
      monthlyContribution: data.monthlyContribution,
      durationYears: data.durationYears,
      feesPa: data.feesPa,
      returnsPa,
      result: JSON.stringify(result)
    }
  });

  return NextResponse.json({ id: simulation.id, result });
}
