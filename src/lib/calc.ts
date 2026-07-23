/** Educational reconstitution math (U-100 / U-40 syringe unit conversion). */

export type SyringeType = 'U100' | 'U40' | '1mL';

export interface ReconInput {
  vialStrengthMg: number;
  bacWaterMl: number;
  targetDoseMcg: number;
  syringeType: SyringeType;
}

export interface ReconResult {
  concentrationMgPerMl: number;
  doseMg: number;
  volumeMl: number;
  syringeUnits: number | null;
  dosesPerVial: number;
  unitsPerMl: number | null;
}

const UNITS_PER_ML: Record<SyringeType, number | null> = {
  U100: 100,
  U40: 40,
  '1mL': null,
};

export function reconstitute(input: ReconInput): ReconResult {
  const { vialStrengthMg, bacWaterMl, targetDoseMcg, syringeType } = input;

  if (!(vialStrengthMg > 0) || !(bacWaterMl > 0) || !(targetDoseMcg > 0)) {
    throw new Error('All inputs must be greater than zero.');
  }

  const doseMg = targetDoseMcg / 1000;
  const concentrationMgPerMl = vialStrengthMg / bacWaterMl;
  const volumeMl = doseMg / concentrationMgPerMl;
  const unitsPerMl = UNITS_PER_ML[syringeType];
  const syringeUnits = unitsPerMl == null ? null : volumeMl * unitsPerMl;
  const dosesPerVial = vialStrengthMg / doseMg;

  return {
    concentrationMgPerMl,
    doseMg,
    volumeMl,
    syringeUnits,
    dosesPerVial,
    unitsPerMl,
  };
}

export function formatNumber(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return Number(n.toFixed(digits)).toString();
}
