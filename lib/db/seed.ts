import { readFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { prisma } from "./client";

const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

type ProductSeed = {
  slug: string;
  name: string;
  type: string;
  currency: string;
  defaultFeesPa: number;
  defaultDurationYears: number;
  description: string;
  riskHint: string;
  holdingsType: string;
};

async function main() {
  const raw = await readFile(PRODUCTS_PATH, "utf-8");
  const products: ProductSeed[] = JSON.parse(raw);

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        type: product.type,
        currency: product.currency,
        defaultFeesPa: product.defaultFeesPa,
        defaultDurationYears: product.defaultDurationYears,
        description: product.description,
        riskHint: product.riskHint,
        holdingsType: product.holdingsType,
        scenarioDefaults: JSON.stringify({
          conservative: 0.03,
          base: 0.05,
          optimistic: 0.07
        })
      },
      create: {
        slug: product.slug,
        name: product.name,
        type: product.type,
        currency: product.currency,
        defaultFeesPa: product.defaultFeesPa,
        defaultDurationYears: product.defaultDurationYears,
        description: product.description,
        riskHint: product.riskHint,
        holdingsType: product.holdingsType,
        scenarioDefaults: JSON.stringify({
          conservative: 0.03,
          base: 0.05,
          optimistic: 0.07
        })
      }
    });
  }

  const adminEmail = "admin@example.com";
  const adminPassword = "Admin123!";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: "admin"
      }
    });
  }

  const userEmail = "user@example.com";
  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!existingUser) {
    const passwordHash = await bcrypt.hash("User123!", 10);
    await prisma.user.create({
      data: {
        email: userEmail,
        passwordHash,
        role: "user"
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
