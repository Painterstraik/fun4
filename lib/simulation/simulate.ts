import { SimulationInput, SimulationResult } from "./types";

function formatMonth(base: Date, offsetMonths: number) {
  const date = new Date(base);
  date.setMonth(date.getMonth() + offsetMonths);
  return date.toISOString().slice(0, 10);
}

export function simulateInvestment(input: SimulationInput): SimulationResult {
  const { monthlyContribution, months, returnsPa, feesPa } = input;
  const monthlyReturn = Math.pow(1 + returnsPa, 1 / 12) - 1;

  let investedTotal = 0;
  let portfolioValue = 0;
  const series = [] as SimulationResult["series"];
  const startDate = new Date();

  for (let month = 0; month < months; month += 1) {
    investedTotal += monthlyContribution;
    portfolioValue = (portfolioValue + monthlyContribution) * (1 + monthlyReturn);
    // Monthly fee deduction to keep the fee impact visible in the simulation.
    portfolioValue = portfolioValue * (1 - feesPa / 12);

    series.push({
      date: formatMonth(startDate, month),
      investedTotal,
      portfolioValue
    });
  }

  const last = series[series.length - 1] ?? {
    investedTotal: 0,
    portfolioValue: 0
  };

  return {
    series,
    kpis: {
      finalValue: last.portfolioValue,
      totalInvested: last.investedTotal,
      profit: last.portfolioValue - last.investedTotal
    }
  };
}
