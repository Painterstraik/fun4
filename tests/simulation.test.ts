import { describe, expect, it } from "vitest";
import { simulateInvestment } from "../lib/simulation/simulate";

describe("simulateInvestment", () => {
  it("returns zeros when contribution is 0", () => {
    const result = simulateInvestment({
      startDate: "2026-01-01",
      startAge: 30,
      investDurationYears: 10,
      interestRate: 0.05,
      contribution: 0
    });

    expect(result.kpis.finalValue).toBe(0);
    expect(result.kpis.totalInvested).toBe(0);
    expect(result.kpis.profit).toBe(0);
  });

  it("stops contributions after invest end", () => {
    const result = simulateInvestment({
      startDate: "2026-01-01",
      startAge: 55,
      investDurationYears: 10,
      interestRate: 0.04,
      contribution: 100
    });

    const investedAtEnd = result.series[result.meta.investMonths - 1].investedTotal;
    const investedAfter = result.series[result.meta.investMonths + 5].investedTotal;
    expect(investedAtEnd).toBe(investedAfter);
  });

  it("caps invest duration by age 60", () => {
    const result = simulateInvestment({
      startDate: "2026-01-01",
      startAge: 58,
      investDurationYears: 10,
      interestRate: 0.04,
      contribution: 100
    });

    expect(result.meta.investMonths).toBe(24);
  });
});
