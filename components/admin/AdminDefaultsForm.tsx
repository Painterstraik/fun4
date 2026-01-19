"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  defaultDurationYears: z.coerce.number().min(1).max(60),
  defaultFeesPa: z.coerce.number().min(0).max(0.2),
  conservative: z.coerce.number().min(0).max(0.2),
  base: z.coerce.number().min(0).max(0.2),
  optimistic: z.coerce.number().min(0).max(0.2)
});

type FormValues = z.infer<typeof schema>;

type AdminDefaultsFormProps = {
  slug: string;
  defaults: { conservative: number; base: number; optimistic: number };
  defaultDurationYears: number;
  defaultFeesPa: number;
};

export function AdminDefaultsForm({
  slug,
  defaults,
  defaultDurationYears,
  defaultFeesPa
}: AdminDefaultsFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      defaultDurationYears,
      defaultFeesPa,
      conservative: defaults.conservative,
      base: defaults.base,
      optimistic: defaults.optimistic
    }
  });

  const onSubmit = async (values: FormValues) => {
    setStatus(null);
    const response = await fetch(`/api/admin/products/${slug}/defaults`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      setStatus("Gespeichert");
    } else {
      setStatus("Fehler beim Speichern");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">Default Laufzeit (Jahre)</label>
          <Input type="number" min="1" max="60" {...register("defaultDurationYears")} />
          {errors.defaultDurationYears && (
            <p className="mt-1 text-xs text-red-600">Bitte eine Laufzeit angeben.</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Default Gebuehren p.a.</label>
          <Input type="number" step="0.001" min="0" max="0.2" {...register("defaultFeesPa")} />
          {errors.defaultFeesPa && (
            <p className="mt-1 text-xs text-red-600">Bitte Gebuehren angeben.</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-semibold text-slate-700">Konservativ p.a.</label>
          <Input type="number" step="0.001" min="0" max="0.2" {...register("conservative")} />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Basis p.a.</label>
          <Input type="number" step="0.001" min="0" max="0.2" {...register("base")} />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Optimistisch p.a.</label>
          <Input type="number" step="0.001" min="0" max="0.2" {...register("optimistic")} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Speichern
        </Button>
        {status && <span className="text-sm text-slate-600">{status}</span>}
      </div>
    </form>
  );
}
