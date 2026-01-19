import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/client";
import { parseScenarioDefaults } from "@/lib/db/serialize";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDefaultsForm } from "@/components/admin/AdminDefaultsForm";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Admin Defaults</h1>
        <p className="text-sm text-slate-600">Produkt-Defaults pro Fonds bearbeiten.</p>
      </header>

      <div className="grid gap-6">
        {products.map((product) => (
          <Card key={product.slug}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminDefaultsForm
                slug={product.slug}
                defaults={parseScenarioDefaults(product.scenarioDefaults)}
                defaultDurationYears={product.defaultDurationYears}
                defaultFeesPa={product.defaultFeesPa}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
