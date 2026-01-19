"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  startDate: z.string(),
  startAge: z.coerce.number().min(0).max(100),
  investDurationYears: z.coerce.number().min(1).max(60),
  interestRate: z.coerce.number().min(0).max(0.2),
  contribution: z.coerce.number().min(0)
});

type FormValues = z.infer<typeof schema>;

type SimulationFormProps = {
  product: Product;
  onResult: (result: unknown, id: string) => void;
};

export function SimulationForm({ product, onResult }: SimulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: new Date().toISOString().slice(0, 10),
      startAge: 30,
      investDurationYears: product.defaultDurationYears,
      interestRate: 0.05,
      contribution: 200
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
          startDate: values.startDate,
          startAge: values.startAge,
          investDurationYears: values.investDurationYears,
          interestRate: values.interestRate,
          contribution: values.contribution
        })
      });

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const payload = await response.json();
      onResult(payload.result, payload.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">Startdatum</label>
          <Input type="date" {...register("startDate")} />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Startalter</label>
          <Input type="number" min="0" max="100" {...register("startAge")} />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700">Monatliche Einzahlung (EUR)</label>
        <Input type="number" step="1" min="0" {...register("contribution")} />
        {errors.contribution && (
          <p className="mt-1 text-xs text-red-600">Bitte eine Einzahlung eingeben.</p>
        )}
      </div>

      <details className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-700">
          Erweiterte Annahmen
        </summary>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">Investitionsdauer (Jahre)</label>
            <Input type="number" min="1" max="60" {...register("investDurationYears")} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Zinssatz p.a.</label>
            <Input type="number" step="0.001" min="0" max="0.2" {...register("interestRate")} />
          </div>
        </div>
      </details>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Berechne..." : "Simulation starten"}
      </Button>
    </form>
  );
}
