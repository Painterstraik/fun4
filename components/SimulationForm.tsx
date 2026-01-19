"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  monthlyContribution: z.coerce.number().min(0),
  durationYears: z.coerce.number().min(1).max(60),
  feesPa: z.coerce.number().min(0).max(0.2),
  scenario: z.enum(["conservative", "base", "optimistic"])
});

type FormValues = z.infer<typeof schema>;

type SimulationFormProps = {
  product: Product;
  onResult: (result: unknown, id: string, durationYears: number) => void;
};

export function SimulationForm({ product, onResult }: SimulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scenarioDefaults = product.scenarioDefaults;
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      monthlyContribution: 200,
      durationYears: product.defaultDurationYears,
      feesPa: product.defaultFeesPa,
      scenario: "base"
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          monthlyContribution: values.monthlyContribution,
          durationYears: values.durationYears,
          feesPa: values.feesPa,
          scenario: values.scenario
        })
      });

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const payload = await response.json();
      onResult(payload.result, payload.id, values.durationYears);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700">Monatliche Sparrate (EUR)</label>
        <Input type="number" step="1" min="0" {...register("monthlyContribution")} />
        {errors.monthlyContribution && (
          <p className="mt-1 text-xs text-red-600">Bitte eine Sparrate eingeben.</p>
        )}
      </div>

      <details className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-700">
          Erweiterte Annahmen
        </summary>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-semibold text-slate-700">Laufzeit (Jahre)</label>
            <Input type="number" min="1" max="60" {...register("durationYears")} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Gebuehren p.a.</label>
            <Input type="number" step="0.001" min="0" max="0.2" {...register("feesPa")} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Szenario</label>
            <select
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
              {...register("scenario")}
            >
              <option value="conservative">
                Konservativ ({(scenarioDefaults.conservative * 100).toFixed(1)}%)
              </option>
              <option value="base">Basis ({(scenarioDefaults.base * 100).toFixed(1)}%)</option>
              <option value="optimistic">
                Optimistisch ({(scenarioDefaults.optimistic * 100).toFixed(1)}%)
              </option>
            </select>
          </div>
        </div>
      </details>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Berechne..." : "Simulation starten"}
      </Button>
    </form>
  );
}
