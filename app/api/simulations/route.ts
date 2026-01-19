import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/client";

import { simulateInvestment } from "@/lib/simulation/simulate";

const schema = z.object({
  productSlug: z.string(),
  startDate: z.string(),
  startAge: z.number().min(0).max(100),
  investDurationYears: z.number().min(1).max(60),
  interestRate: z.number().min(0).max(0.2),
  contribution: z.number().min(0)
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

  const result = simulateInvestment({
    startDate: data.startDate,
    startAge: data.startAge,
    investDurationYears: data.investDurationYears,
    interestRate: data.interestRate,
    contribution: data.contribution
  });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const simulation = await prisma.simulation.create({
    data: {
      productId: product.id,
      userId: user?.id,
      startDate: new Date(data.startDate),
      startAge: data.startAge,
      investDurationYears: data.investDurationYears,
      interestRate: data.interestRate,
      contribution: data.contribution,
      result: JSON.stringify(result)
    }
  });

  return NextResponse.json({ id: simulation.id, result });
}
