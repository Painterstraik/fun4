export type SimulationInput = {
  monthlyContribution: number;
  months: number;
  returnsPa: number;
  feesPa: number;
};

export type SimulationPoint = {
  date: string;
  investedTotal: number;
  portfolioValue: number;
};

export type SimulationResult = {
  series: SimulationPoint[];
  kpis: {
    finalValue: number;
    totalInvested: number;
    profit: number;
  };
};
