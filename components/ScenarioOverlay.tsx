"use client";

import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import { SimulationPoint } from "@/lib/simulation/types";
import { ScenarioType } from "@/lib/simulation/scenario";

const plotPadding = { top: 10, right: 20, bottom: 34, left: 50 };

type ScenarioOverlayProps = {
  data: SimulationPoint[];
  scenario: ScenarioType;
  eventDate: string;
  width: number;
  height: number;
};

export function ScenarioOverlay({ data, scenario, eventDate, width, height }: ScenarioOverlayProps) {
  const [lottieData, setLottieData] = useState<unknown | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const handler = () => setReducedMotion(media.matches);
    media.addEventListener?.("change", handler);
    return () => media.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (scenario === "death") {
      setLottieData(null);
      return;
    }

    const url = scenario === "accident" ? "/lottie/accident.json" : "/lottie/bu.json";
    fetch(url)
      .then((res) => res.json())
      .then(setLottieData)
      .catch(() => setLottieData(null));
  }, [scenario]);

  const { eventX, labelX, plotTop, plotBottom } = useMemo(() => {
    if (!data.length) {
      return {
        eventX: 0,
        labelX: 0,
        plotTop: plotPadding.top,
        plotBottom: height - plotPadding.bottom
      };
    }

    const minDate = new Date(data[0].date).getTime();
    const maxDate = new Date(data[data.length - 1].date).getTime();
    const event = new Date(eventDate).getTime();
    const plotWidth = Math.max(0, width - plotPadding.left - plotPadding.right);

    if (maxDate <= minDate || plotWidth <= 0) {
      return {
        eventX: plotPadding.left,
        labelX: plotPadding.left,
        plotTop: plotPadding.top,
        plotBottom: height - plotPadding.bottom
      };
    }

    const ratio = (event - minDate) / (maxDate - minDate);
    const clamped = Math.min(1, Math.max(0, ratio));
    const x = plotPadding.left + clamped * plotWidth;

    return {
      eventX: x,
      labelX: Math.min(x + 12, width - plotPadding.right - 140),
      plotTop: plotPadding.top,
      plotBottom: height - plotPadding.bottom
    };
  }, [data, eventDate, width, height]);

  if (!width || !height || !data.length) {
    return null;
  }

  const labelText =
    scenario === "accident" ? "Unfall" : scenario === "bu" ? "BU-Ereignis" : "Tod";
  const rentAmount = scenario === "accident" ? 250 : scenario === "bu" ? 400 : 0;

  const lottieWidth = scenario === "accident" ? 320 : 220;
  const lottieX = Math.min(
    Math.max(eventX - lottieWidth / 2, plotPadding.left),
    width - plotPadding.right - lottieWidth
  );
  const lottieY = scenario === "accident" ? plotBottom - 140 : plotTop + 8;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <svg width={width} height={height} className="absolute inset-0">
        {scenario !== "accident" && (
          <>
            <line
              x1={eventX}
              y1={plotTop}
              x2={eventX}
              y2={plotBottom}
              stroke="#be123c"
              strokeDasharray="4 4"
              strokeWidth="2"
            />
            <text x={labelX} y={plotTop + 14} fill="#be123c" fontSize="12" fontWeight="600">
              {labelText}
            </text>
          </>
        )}
      </svg>

      {scenario === "death" && (
        <div
          className="absolute rounded-md bg-white/85 px-3 py-2 text-xs text-slate-700 shadow"
          style={{ left: labelX, top: plotTop + 24 }}
        >
          <p>Vor Rentenbeginn: Beitraege + Gewinne</p>
          <p>Nach Rentenbeginn: Leistung gesichert</p>
        </div>
      )}

      {scenario === "bu" && (
        <div
          className="absolute rounded-md bg-white/85 px-3 py-2 text-xs text-slate-700 shadow"
          style={{ left: labelX, top: plotTop + 24 }}
        >
          <p>Beitraege entfallen ab Ereignis</p>
          <p>Rente: {rentAmount} € mtl.</p>
          <p>Kapital waechst weiter durch Zinsen</p>
        </div>
      )}


      {scenario !== "death" && !reducedMotion && lottieData && (
        <div style={{ position: "absolute", left: lottieX, top: lottieY, width: lottieWidth }}>
          <Lottie key={`${scenario}-${eventDate}`} animationData={lottieData} loop={false} />
        </div>
      )}

      {scenario === "accident" && (
        <div
          className="absolute"
          style={{ left: lottieX - 10, top: lottieY - 110 }}
        >
          <div className="relative">
            <svg width="190" height="110" viewBox="0 0 190 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <filter id="shadow" x="-10" y="-10" width="210" height="140" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.12"/>
              </filter>
              <g filter="url(#shadow)">
                <path d="M45 70C32 70 22 60 22 48C22 36 32 26 45 26C50 26 55 28 59 31C64 20 76 12 90 12C108 12 123 23 128 38C130 38 132 37 135 37C150 37 162 49 162 64C162 79 150 91 135 91H52C45 91 39 89 34 85C39 78 41 74 45 70Z" fill="white"/>
              </g>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-base font-semibold text-slate-700">8,79€ mntl</div>
          </div>
        </div>
      )}

      {scenario !== "death" && (reducedMotion || !lottieData) && (
        <div
          className="absolute rounded-md bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow"
          style={{ left: lottieX + 20, top: lottieY + 20 }}
        >
          {scenario === "accident" ? "Unfall" : "Berufsunfaehigkeit"}
        </div>
      )}
    </div>
  );
}
