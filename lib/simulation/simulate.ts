import { SimulationInput, SimulationResult } from "./types";

function formatMonth(base: Date, offsetMonths: number) {
  const date = new Date(base);
  date.setMonth(date.getMonth() + offsetMonths);
  return date.toISOString().slice(0, 10);
}

export function simulateInvestment(input: SimulationInput): SimulationResult {
  const { startDate, startAge, investDurationYears, interestRate, contribution } = input;
  const monthlyReturn = interestRate / 12;
  const yearsTo60 = Math.max(0, 60 - startAge);
  const investMonths = Math.min(investDurationYears * 12, yearsTo60 * 12, 35 * 12);
  const growthMonths = 84;
  const totalMonths = investMonths + growthMonths;

  const series = [] as SimulationResult["series"];
  let investedTotal = 0;
  let portfolioValue = 0;
  const start = new Date(startDate);

  for (let month = 0; month < totalMonths; month += 1) {
    const cashIn = month < investMonths ? contribution : 0;
    investedTotal += cashIn;
    portfolioValue = (portfolioValue + cashIn) * (1 + monthlyReturn);

    series.push({
      date: formatMonth(start, month),
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
      startDate,
      startAge
    }
  };
}
