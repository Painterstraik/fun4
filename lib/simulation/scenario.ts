import { SimulationInput, SimulationResult } from "./types";
import { simulateInvestment } from "./simulate";

export type ScenarioType = "accident" | "bu" | "death";

export type ScenarioConfig = {
  eventDate?: string;
  eventAge?: number;
};

export function resolveEventDate(
  baseParams: SimulationInput,
  config: ScenarioConfig
): string {
  if (config.eventDate) {
    return config.eventDate;
  }

  if (config.eventAge !== undefined) {
    const deltaYears = Math.max(0, config.eventAge - baseParams.startAge);
    const date = new Date(baseParams.startDate);
    date.setFullYear(date.getFullYear() + deltaYears);
    return date.toISOString().slice(0, 10);
  }

  const fallback = new Date(baseParams.startDate);
  fallback.setFullYear(fallback.getFullYear() + 10);
  return fallback.toISOString().slice(0, 10);
}

function formatMonth(base: Date, offsetMonths: number) {
  const date = new Date(base);
  date.setMonth(date.getMonth() + offsetMonths);
  return date.toISOString().slice(0, 10);
}

export function simulateScenario(
  baseParams: SimulationInput,
  scenario: ScenarioType | null,
  config: ScenarioConfig
): SimulationResult {
  if (!scenario) {
    return simulateInvestment(baseParams);
  }

  const eventDate = resolveEventDate(baseParams, config);
  const eventMs = new Date(eventDate).getTime();
  const start = new Date(baseParams.startDate);
  const monthlyReturn = baseParams.interestRate / 12;
  const yearsTo60 = Math.max(0, 60 - baseParams.startAge);
  const investMonths = Math.min(
    baseParams.investDurationYears * 12,
    yearsTo60 * 12,
    35 * 12
  );
  const growthMonths = 84;
  const totalMonths = investMonths + growthMonths;

  const series: SimulationResult["series"] = [];
  let investedTotal = 0;
  let portfolioValue = 0;
  let freezeCapital = false;

  for (let month = 0; month < totalMonths; month += 1) {
    const date = new Date(start);
    date.setMonth(date.getMonth() + month);
    const dateMs = date.getTime();
    const dateString = date.toISOString().slice(0, 10);

    let cashIn = month < investMonths ? baseParams.contribution : 0;

    if ((scenario === "bu" || scenario === "death") && dateMs >= eventMs) {
      cashIn = 0;
    }

    investedTotal += cashIn;

    if (scenario === "death" && dateMs >= eventMs) {
      freezeCapital = true;
    }

    if (!freezeCapital) {
      const accidentBenefit =
        scenario === "accident" && dateMs >= eventMs ? 250 : 0;
      portfolioValue = (portfolioValue + cashIn + accidentBenefit) * (1 + monthlyReturn);
    }

    series.push({
      date: dateString,
      investedTotal,
      portfolioValue
    });
  }

  const last = series[series.length - 1] ?? {
    investedTotal: 0,
    portfolioValue: 0
  };

  const investEndDate = formatMonth(start, Math.max(investMonths - 1, 0));
  const endDate = formatMonth(start, Math.max(totalMonths - 1, 0));

  return {
    series,
    kpis: {
      finalValue: last.portfolioValue,
      totalInvested: last.investedTotal,
      profit: last.portfolioValue - last.investedTotal
    },
    meta: {
      investMonths,
      totalMonths,
      investEndDate,
      endDate,
      startDate: baseParams.startDate,
      startAge: baseParams.startAge
    }
  };
}
