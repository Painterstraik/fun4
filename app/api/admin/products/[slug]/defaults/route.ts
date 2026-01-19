import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/client";
import { stringifyScenarioDefaults } from "@/lib/db/serialize";

const schema = z.object({
  defaultDurationYears: z.number().min(1).max(60),
  defaultFeesPa: z.number().min(0).max(0.2),
  conservative: z.number().min(0).max(0.2),
  base: z.number().min(0).max(0.2),
  optimistic: z.number().min(0).max(0.2)
});

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  const data = schema.parse(payload);

  const product = await prisma.product.update({
    where: { slug: params.slug },
    data: {
      defaultDurationYears: data.defaultDurationYears,
      defaultFeesPa: data.defaultFeesPa,
      scenarioDefaults: stringifyScenarioDefaults({
        conservative: data.conservative,
        base: data.base,
        optimistic: data.optimistic
      })
    }
  });

  return NextResponse.json({ product });
}
