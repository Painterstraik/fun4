"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { PricePoint } from "@/lib/types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(value);

export function PriceChart({ data }: { data: PricePoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(Number(value))} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#3b7bff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
