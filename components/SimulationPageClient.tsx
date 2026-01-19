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
  const [durationYears, setDurationYears] = useState<number>(product.defaultDurationYears);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Simulation: {product.name}</h1>
        <p className="text-sm text-slate-600">Sparplan mit wenigen Eingaben berechnen.</p>
      </header>

      <SimulationForm
        product={product}
        onResult={(payload, id, duration) => {
          setResult(payload as SimulationResult);
          setSimulationId(id);
          setDurationYears(duration);
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
            <p>Monatliche Sparrate wird zu Monatsbeginn investiert.</p>
            <p>Rendite basiert auf dem gewaehlten Szenario p.a.</p>
            <p>Gebuehren werden monatlich anteilig abgezogen.</p>
          </div>
        </DialogContent>
      </Dialog>

      {result && (
        <div className="space-y-6">
          <KpiCards
            finalValue={result.kpis.finalValue}
            totalInvested={result.kpis.totalInvested}
            profit={result.kpis.profit}
            durationYears={durationYears}
          />
          <ResultChart data={result.series} />
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
