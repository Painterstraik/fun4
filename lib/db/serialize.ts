export type ScenarioDefaults = {
  conservative: number;
  base: number;
  optimistic: number;
};

const fallbackDefaults: ScenarioDefaults = {
  conservative: 0.03,
  base: 0.05,
  optimistic: 0.07
};

export function parseScenarioDefaults(value: unknown): ScenarioDefaults {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as ScenarioDefaults;
      if (
        typeof parsed?.conservative === "number" &&
        typeof parsed?.base === "number" &&
        typeof parsed?.optimistic === "number"
      ) {
        return parsed;
      }
    } catch {
      return fallbackDefaults;
    }
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "conservative" in value &&
    "base" in value &&
    "optimistic" in value
  ) {
    const typed = value as ScenarioDefaults;
    return {
      conservative: Number(typed.conservative),
      base: Number(typed.base),
      optimistic: Number(typed.optimistic)
    };
  }

  return fallbackDefaults;
}

export function stringifyScenarioDefaults(value: ScenarioDefaults) {
  return JSON.stringify(value);
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return value as T;
}
