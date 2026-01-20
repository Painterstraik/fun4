"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine
} from "recharts";
import { SimulationPoint } from "@/lib/simulation/types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);

const formatYear = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : String(date.getFullYear());
};

const addMonths = (value: string, months: number) => {
  const date = new Date(value);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
};

export function ResultChart({
  data,
  startDate,
  startAge,
  scenario,
  pensionLabel
}: {
  data: SimulationPoint[];
  startDate: string;
  startAge: number;
  scenario?: "accident" | "bu" | "death" | null;
  pensionLabel?: string;
}) {

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatYear} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(Number(value))} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={formatYear} />
          <Legend />
          {pensionLabel && data.length > 0 && (
            <ReferenceLine
              x={data[data.length - 1].date}
              stroke="transparent"
              label={{
                value: pensionLabel,
                position: "bottom",
                fill: "#7f1d1d"
              }}
            />
          )}
          {scenario !== "accident" && (
            <>
              <Line
                type="monotone"
                dataKey="investedTotal"
                name="Kumulierte Einzahlungen"
                stroke="#0f172a"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="portfolioValue"
                name="Kapital"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={false}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
