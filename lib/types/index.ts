export type ProductType = "trend" | "fund_bond" | "fund_equity" | "index";

export type HoldingsType = "multi_asset_markets" | "bonds" | "equity_companies";

export type Product = {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  currency: "EUR";
  defaultFeesPa: number;
  defaultDurationYears: number;
  description: string;
  riskHint: string;
  holdingsType: HoldingsType;
  scenarioDefaults: {
    conservative: number;
    base: number;
    optimistic: number;
  };
};

export type PricePoint = {
  date: string;
  close: number;
};

export type HoldingItem = {
  name: string;
  weightPct: number;
  meta?: Record<string, string | number>;
};

export type HoldingsPayload = {
  slug: string;
  type: HoldingsType;
  asOfDate: string;
  items: HoldingItem[];
};

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
