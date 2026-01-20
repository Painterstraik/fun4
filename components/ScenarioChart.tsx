"use client";

import { useEffect, useRef, useState } from "react";
import { SimulationPoint } from "@/lib/simulation/types";
import { ScenarioOverlay } from "@/components/ScenarioOverlay";
import { ScenarioType } from "@/lib/simulation/scenario";
import { ResultChart } from "@/components/ResultChart";

export function ScenarioChart({
  data,
  scenario,
  eventDate,
  startDate,
  startAge,
  pensionLabel
}: {
  data: SimulationPoint[];
  scenario: ScenarioType | null;
  eventDate?: string;
  startDate: string;
  startAge: number;
  pensionLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative -ml-8">
      <ResultChart data={data} startDate={startDate} startAge={startAge} scenario={scenario} pensionLabel={pensionLabel} />
      {scenario && eventDate && (
        <ScenarioOverlay
          data={data}
          scenario={scenario}
          eventDate={eventDate}
          width={size.width}
          height={size.height}
        />
      )}
    </div>
  );
}
