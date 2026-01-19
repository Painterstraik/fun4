import { Card, CardContent } from "@/components/ui/card";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);

export function KpiCards({
  finalValue,
  totalInvested,
  profit,
  durationYears
}: {
  finalValue: number;
  totalInvested: number;
  profit: number;
  durationYears: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-xs uppercase text-slate-500">Endwert</p>
          <p className="text-xl font-semibold text-slate-900">{formatCurrency(finalValue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs uppercase text-slate-500">Investiert</p>
          <p className="text-xl font-semibold text-slate-900">{formatCurrency(totalInvested)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs uppercase text-slate-500">Gewinn</p>
          <p className="text-xl font-semibold text-slate-900">{formatCurrency(profit)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs uppercase text-slate-500">Laufzeit</p>
          <p className="text-xl font-semibold text-slate-900">{durationYears} Jahre</p>
        </CardContent>
      </Card>
    </div>
  );
}
