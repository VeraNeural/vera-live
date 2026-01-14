export type Band = 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'UNKNOWN';

const BAND_1 = new Set<number>([
  1, 5, 8, 19, 21, 22, 25, 30, 31, 33, 34, 36, 39, 40, 41, 43, 50, 54, 57, 59, 75, 86,
  87, 90, 95, 97,
]);

const BAND_2 = new Set<number>([
  2, 3, 4, 7, 9, 10, 11, 12, 13, 16, 18, 20, 23, 24, 26, 32, 37, 38, 42, 44, 45, 46,
  47, 49, 51, 55, 56, 58, 76, 79, 80, 82, 91, 93, 94, 99, 100,
]);

const BAND_3 = new Set<number>([
  27, 28, 29, 35, 48, 53, 61, 62, 63, 64, 65, 68, 70, 77, 78, 83, 84, 85, 89, 98,
]);

const BAND_4 = new Set<number>([14, 15, 49, 52, 60, 66, 67, 69, 92, 96]);

const BAND_5 = new Set<number>([6, 17, 71, 72, 73, 74, 81, 88]);

export function bandForCode(code: number): Band {
  if (BAND_3.has(code)) return 'B3';
  if (BAND_2.has(code)) return 'B2';
  if (BAND_4.has(code)) return 'B4';
  if (BAND_5.has(code)) return 'B5';
  if (BAND_1.has(code)) return 'B1';
  return 'UNKNOWN';
}

export function determineBand(codes: Array<{ code: number }>): Band {
  if (!codes.length) return 'UNKNOWN';

  const bands = new Set<Band>(codes.map((c) => bandForCode(c.code)));

  // Safety-first precedence:
  // - Any B3 => B3
  // - Any B2 => B2
  // - Mixed B1+B2 => B2 (already covered)
  // - Otherwise, keep the strongest non-unknown band.
  if (bands.has('B3')) return 'B3';
  if (bands.has('B2')) return 'B2';

  // If there is any unknown alongside safe bands, keep the known band.
  if (bands.has('B4')) return 'B4';
  if (bands.has('B5')) return 'B5';
  if (bands.has('B1')) return 'B1';

  return 'UNKNOWN';
}

export function hasAnyCodeInBand(codes: Array<{ code: number }>, band: Band): boolean {
  return codes.some((c: any) => {
    if (typeof c?.band === 'string') return c.band === band;
    return bandForCode(c.code) === band;
  });
}
