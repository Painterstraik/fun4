import { describe, expect, it } from "vitest";
import { simulateInvestment } from "../lib/simulation/simulate";

const closeTo = (value: number, expected: number, tolerance = 0.01) =>
  Math.abs(value - expected) < tolerance;

describe("simulateInvestment", () => {
  it("returns zeros when monthly contribution is 0", () => {
    const result = simulateInvestment({
      monthlyContribution: 0,
      months: 12,
      returnsPa: 0.05,
      feesPa: 0.01
    });

    expect(result.kpis.finalValue).toBe(0);
    expect(result.kpis.totalInvested).toBe(0);
    expect(result.kpis.profit).toBe(0);
  });

  it("portfolio is below invested when return is 0 and fees positive", () => {
    const result = simulateInvestment({
      monthlyContribution: 100,
      months: 12,
      returnsPa: 0,
      feesPa: 0.02
    });

    expect(result.kpis.totalInvested).toBe(1200);
    expect(result.kpis.finalValue).toBeLessThan(result.kpis.totalInvested);
  });

  it("matches deterministic calculation for small months", () => {
    const result = simulateInvestment({
      monthlyContribution: 200,
      months: 12,
      returnsPa: 0.06,
      feesPa: 0.01
    });

    const expectedTotalInvested = 2400;
    expect(result.kpis.totalInvested).toBe(expectedTotalInvested);

    const expectedFinal = 2463.81;
    expect(closeTo(result.kpis.finalValue, expectedFinal, 1)).toBe(true);
  });
});
