// Pollution Index Calculations - Exact formulas from environmental monitoring standards

// BIS/WHO Standard values (mg/L)
export const BIS_STANDARDS = {
  Pb: 0.01,   // Lead
  Cd: 0.003,  // Cadmium
  As: 0.01,   // Arsenic
  Cr: 0.05,   // Chromium
  Se: 0.01,   // Selenium
} as const;

// Weight factors (inversely proportional to standards)
export const WEIGHT_FACTORS = {
  Pb: 1 / BIS_STANDARDS.Pb,
  Cd: 1 / BIS_STANDARDS.Cd,
  As: 1 / BIS_STANDARDS.As,
  Cr: 1 / BIS_STANDARDS.Cr,
  Se: 1 / BIS_STANDARDS.Se,
} as const;

export interface HeavyMetalData {
  Pb: number;  // Lead concentration
  Cd: number;  // Cadmium concentration
  As: number;  // Arsenic concentration
  Cr: number;  // Chromium concentration
  Se: number;  // Selenium concentration
}

export interface PollutionResults {
  hpi: number;  // Heavy Metal Pollution Index
  hei: number;  // Heavy Metal Evaluation Index
  pli: number;  // Pollution Load Index
  eri: number;  // Ecological Risk Index
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
  exceedsStandards: string[];
}

// Heavy Metal Pollution Index (HPI)
// HPI = Σ(wi × qi) / Σwi
// qi = measured concentration / standard limit
export function calculateHPI(data: HeavyMetalData): number {
  const qi = {
    Pb: data.Pb / BIS_STANDARDS.Pb,
    Cd: data.Cd / BIS_STANDARDS.Cd,
    As: data.As / BIS_STANDARDS.As,
    Cr: data.Cr / BIS_STANDARDS.Cr,
    Se: data.Se / BIS_STANDARDS.Se,
  };

  const numerator = 
    WEIGHT_FACTORS.Pb * qi.Pb +
    WEIGHT_FACTORS.Cd * qi.Cd +
    WEIGHT_FACTORS.As * qi.As +
    WEIGHT_FACTORS.Cr * qi.Cr +
    WEIGHT_FACTORS.Se * qi.Se;

  const denominator = 
    WEIGHT_FACTORS.Pb +
    WEIGHT_FACTORS.Cd +
    WEIGHT_FACTORS.As +
    WEIGHT_FACTORS.Cr +
    WEIGHT_FACTORS.Se;

  return numerator / denominator;
}

// Heavy Metal Evaluation Index (HEI)
// HEI = Σ(mi / si)
// mi = measured concentration, si = standard limit
export function calculateHEI(data: HeavyMetalData): number {
  return (
    data.Pb / BIS_STANDARDS.Pb +
    data.Cd / BIS_STANDARDS.Cd +
    data.As / BIS_STANDARDS.As +
    data.Cr / BIS_STANDARDS.Cr +
    data.Se / BIS_STANDARDS.Se
  );
}

// Pollution Load Index (PLI)
// PLI = (CF1 × CF2 × CF3 × ... × CFn)^(1/n)
// CFi = Contamination Factor = mi / si
export function calculatePLI(data: HeavyMetalData): number {
  const cf = {
    Pb: data.Pb / BIS_STANDARDS.Pb,
    Cd: data.Cd / BIS_STANDARDS.Cd,
    As: data.As / BIS_STANDARDS.As,
    Cr: data.Cr / BIS_STANDARDS.Cr,
    Se: data.Se / BIS_STANDARDS.Se,
  };

  // Geometric mean of contamination factors
  const product = cf.Pb * cf.Cd * cf.As * cf.Cr * cf.Se;
  return Math.pow(product, 1/5);
}

// Ecological Risk Index (ERI)
// ERI = Σ(Ti × mi / si)
// Ti = Toxic response factor for each metal
const TOXIC_FACTORS = {
  Pb: 5,   // Lead toxic factor
  Cd: 30,  // Cadmium toxic factor (highly toxic)
  As: 10,  // Arsenic toxic factor
  Cr: 2,   // Chromium toxic factor
  Se: 5,   // Selenium toxic factor
} as const;

export function calculateERI(data: HeavyMetalData): number {
  return (
    TOXIC_FACTORS.Pb * (data.Pb / BIS_STANDARDS.Pb) +
    TOXIC_FACTORS.Cd * (data.Cd / BIS_STANDARDS.Cd) +
    TOXIC_FACTORS.As * (data.As / BIS_STANDARDS.As) +
    TOXIC_FACTORS.Cr * (data.Cr / BIS_STANDARDS.Cr) +
    TOXIC_FACTORS.Se * (data.Se / BIS_STANDARDS.Se)
  );
}

// Determine risk level based on pollution indices
export function determineRiskLevel(hpi: number, hei: number, pli: number, eri: number): PollutionResults['riskLevel'] {
  // Critical: Multiple indices showing severe pollution
  if (hpi > 100 || hei > 10 || pli > 3 || eri > 300) {
    return 'critical';
  }
  
  // High: Significant pollution detected
  if (hpi > 50 || hei > 5 || pli > 2 || eri > 150) {
    return 'high';
  }
  
  // Moderate: Some pollution detected
  if (hpi > 25 || hei > 2 || pli > 1 || eri > 75) {
    return 'moderate';
  }
  
  // Safe: Within acceptable limits
  return 'safe';
}

// Check which metals exceed BIS standards
export function checkExceedsStandards(data: HeavyMetalData): string[] {
  const exceeded: string[] = [];
  
  if (data.Pb > BIS_STANDARDS.Pb) exceeded.push('Lead (Pb)');
  if (data.Cd > BIS_STANDARDS.Cd) exceeded.push('Cadmium (Cd)');
  if (data.As > BIS_STANDARDS.As) exceeded.push('Arsenic (As)');
  if (data.Cr > BIS_STANDARDS.Cr) exceeded.push('Chromium (Cr)');
  if (data.Se > BIS_STANDARDS.Se) exceeded.push('Selenium (Se)');
  
  return exceeded;
}

// Main function to calculate all pollution indices
export function calculatePollutionIndices(data: HeavyMetalData): PollutionResults {
  const hpi = calculateHPI(data);
  const hei = calculateHEI(data);
  const pli = calculatePLI(data);
  const eri = calculateERI(data);
  
  const riskLevel = determineRiskLevel(hpi, hei, pli, eri);
  const exceedsStandards = checkExceedsStandards(data);

  return {
    hpi: Math.round(hpi * 100) / 100,  // Round to 2 decimal places
    hei: Math.round(hei * 100) / 100,
    pli: Math.round(pli * 100) / 100,
    eri: Math.round(eri * 100) / 100,
    riskLevel,
    exceedsStandards,
  };
}