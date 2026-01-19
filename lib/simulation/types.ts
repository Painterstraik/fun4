export type SimulationInput = {
  startDate: string;
  startAge: number;
  investDurationYears: number;
  interestRate: number;
  contribution: number;
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
  meta: {
    investMonths: number;
    totalMonths: number;
    investEndDate: string;
    endDate: string;
    startDate: string;
    startAge: number;
  };
};
