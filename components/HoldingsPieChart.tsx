"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { HoldingsPayload } from "@/lib/types";

const COLORS = [
  "#f43f5e",
  "#fb7185",
  "#fda4af",
  "#fecdd3",
  "#e11d48",
  "#be123c",
  "#9f1239",
  "#881337",
  "#fca5a5",
  "#f87171"
];

const formatPct = (value: number) => `${value.toFixed(1)}%`;

export function HoldingsPieChart({ holdings }: { holdings: HoldingsPayload }) {
  const data = holdings.items.slice(0, 10).map((item) => ({
    name: item.name,
    value: item.weightPct
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={45}
            outerRadius={110}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatPct(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
