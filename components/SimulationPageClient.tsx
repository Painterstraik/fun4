"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { SimulationResult } from "@/lib/simulation/types";
import { SimulationForm } from "@/components/SimulationForm";
import { ResultChart } from "@/components/ResultChart";
import { KpiCards } from "@/components/KpiCards";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SimulationPageClient({ product }: { product: Product }) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simulationId, setSimulationId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Simulation: {product.name}</h1>
        <p className="text-sm text-slate-600">Sparplan mit wenigen Eingaben berechnen.</p>
      </header>

      <SimulationForm
        product={product}
        onResult={(payload, id) => {
          setResult(payload as SimulationResult);
          setSimulationId(id);
        }}
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Annahmen erklaert
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Simulation Annahmen</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm text-slate-600">
            <p>Einzahlungen erfolgen monatlich bis zum Investitionsende.</p>
            <p>Ab dem Investitionsende wachsen nur noch Zinsen.</p>
            <p>Zinssatz wird monatlich anteilig angewendet.</p>
          </div>
        </DialogContent>
      </Dialog>

      {result && (
        <div className="space-y-6">
          <KpiCards
            finalValue={result.kpis.finalValue}
            totalInvested={result.kpis.totalInvested}
            profit={result.kpis.profit}
            durationYears={Math.round((result.meta.totalMonths / 12) * 10) / 10}
          />
          <ResultChart data={result.series} startDate={result.meta.startDate} startAge={result.meta.startAge} />
          {simulationId && (
            <Button asChild variant="outline">
              <Link href={`/api/simulations/${simulationId}`}>Permalink oeffnen</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
