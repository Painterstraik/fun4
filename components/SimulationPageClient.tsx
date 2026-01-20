"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { SimulationResult } from "@/lib/simulation/types";
import { ScenarioConfig, ScenarioType, resolveEventDate, simulateScenario } from "@/lib/simulation/scenario";
import { SimulationForm } from "@/components/SimulationForm";
import { ScenarioChart } from "@/components/ScenarioChart";
import { KpiCards } from "@/components/KpiCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SimulationPageClient({ product }: { product: Product }) {
  const [baseResult, setBaseResult] = useState<SimulationResult | null>(null);
  const [activeResult, setActiveResult] = useState<SimulationResult | null>(null);
  const [baseParams, setBaseParams] = useState<{
    startDate: string;
    startAge: number;
    investDurationYears: number;
    interestRate: number;
    contribution: number;
  } | null>(null);
  const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null);
  const [scenarioConfig, setScenarioConfig] = useState<ScenarioConfig>({});
  const [showInsuranceUI, setShowInsuranceUI] = useState(false);
  const [simulationId, setSimulationId] = useState<string | null>(null);

  const pensionLabel = (() => {
    if (!baseResult || !baseParams) return undefined;
    const age67Date = (() => {
      const date = new Date(baseParams.startDate);
      date.setFullYear(date.getFullYear() + Math.max(0, 67 - baseParams.startAge));
      return date.toISOString().slice(0, 10);
    })();
    const point = baseResult.series.find((item) => item.date >= age67Date) ?? baseResult.series.at(-1);
    if (!point) return undefined;
    const months = 20 * 12;
    const monthlyPension = Math.round((point.portfolioValue / months) * 10) / 10;
    return `Rente mtl. ${monthlyPension.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €`;
  })();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Simulation: {product.name}</h1>
        <p className="text-sm text-slate-600">Sparplan mit wenigen Eingaben berechnen.</p>
      </header>

      <SimulationForm
        product={product}
        onResult={(payload, id, params) => {
          const result = payload as SimulationResult;
          setBaseResult(result);
          setActiveResult(result);
          setBaseParams(params);
          setSimulationId(id);
          setScenarioConfig({ eventDate: resolveEventDate(params, {}) });
          setActiveScenario(null);
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

      {activeResult && (
        <div className="space-y-6">
          <KpiCards
            finalValue={activeScenario === "accident" ? 0 : activeResult.kpis.finalValue}
            totalInvested={activeScenario === "accident" ? 0 : activeResult.kpis.totalInvested}
            profit={activeScenario === "accident" ? 0 : activeResult.kpis.profit}
            durationYears={Math.round((activeResult.meta.totalMonths / 12) * 10) / 10}
          />
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <ScenarioChart
              data={activeResult.series}
              scenario={activeScenario}
              eventDate={activeScenario && baseParams ? resolveEventDate(baseParams, scenarioConfig) : undefined}
              startDate={activeResult.meta.startDate}
              startAge={activeResult.meta.startAge}
              pensionLabel={pensionLabel}
            />
            {activeScenario === "accident" && (
              <button className="h-fit translate-x-12 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm shadow-sm">
                <p className="font-semibold text-slate-800">Leistungen</p>
                <p className="mt-2 text-slate-600">200 000 € Rettungskosten</p>
                <p className="text-slate-600">50 000 € Schoenheits-OPs</p>
                <p className="text-slate-600">300 000 € Invaliditaetskapital ab 70%</p>
              </button>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="outline" onClick={() => setShowInsuranceUI(true)} className="w-full md:w-auto">
              Absicherung
            </Button>
            {activeScenario && (
              <Button
                variant="ghost"
                size="sm"
                className="w-fit text-slate-500"
                onClick={() => {
                  setActiveScenario(null);
                  setActiveResult(baseResult);
                }}
              >
                Szenario deaktivieren
              </Button>
            )}
          </div>
          {simulationId && (
            <Button asChild variant="outline">
              <Link href={`/api/simulations/${simulationId}`}>Permalink oeffnen</Link>
            </Button>
          )}
        </div>
      )}

      {showInsuranceUI && (
        <Dialog open={showInsuranceUI} onOpenChange={setShowInsuranceUI}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Szenario-Auswahl</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-2 md:grid-cols-3">
                <Button
                  type="button"
                  variant={activeScenario === "accident" ? "default" : "outline"}
                  onClick={() => setActiveScenario("accident")}
                >
                  Unfall
                </Button>
                <Button
                  type="button"
                  variant={activeScenario === "bu" ? "default" : "outline"}
                  onClick={() => setActiveScenario("bu")}
                >
                  Berufsunfaehigkeit
                </Button>
                <Button
                  type="button"
                  variant={activeScenario === "death" ? "default" : "outline"}
                  onClick={() => setActiveScenario("death")}
                >
                  Tod
                </Button>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Ereignis-Datum</label>
                  <Input
                    type="date"
                    value={scenarioConfig.eventDate ?? (baseParams ? resolveEventDate(baseParams, scenarioConfig) : "")}
                    onChange={(event) =>
                      setScenarioConfig((prev) => ({ ...prev, eventDate: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Ereignis-Jahr</label>
                  <Input
                    type="number"
                    min="2020"
                    max="2100"
                    value={(scenarioConfig.eventDate ?? (baseParams ? resolveEventDate(baseParams, scenarioConfig) : "")).slice(0, 4)}
                    onChange={(event) => {
                      const year = event.target.value.padStart(4, "0");
                      const current = scenarioConfig.eventDate ?? (baseParams ? resolveEventDate(baseParams, scenarioConfig) : "");
                      if (!current) return;
                      const next = `${year}${current.slice(4)}`;
                      setScenarioConfig((prev) => ({ ...prev, eventDate: next }));
                    }}
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">Optional, Standard: 10 Jahre nach Startdatum.</p>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setActiveScenario(null);
                    setActiveResult(baseResult);
                    setShowInsuranceUI(false);
                  }}
                >
                  Zuruecksetzen
                </Button>
                <Button
                  onClick={() => {
                    if (!baseParams || !activeScenario) {
                      setShowInsuranceUI(false);
                      return;
                    }
                    const next = simulateScenario(baseParams, activeScenario, scenarioConfig);
                    setActiveResult(next);
                    setShowInsuranceUI(false);
                  }}
                >
                  Uebernehmen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
