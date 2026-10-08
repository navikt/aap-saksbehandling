import { describe, expect, test } from 'vitest';
import { beregnPåskedag } from 'lib/utils/paaske';

describe('beregnPåskedag', () => {
  test.each([
    [2023, new Date(2023, 3, 9)],
    [2024, new Date(2024, 2, 31)],
    [2025, new Date(2025, 3, 20)],
    [2026, new Date(2026, 3, 5)],
    [2027, new Date(2027, 2, 28)],
    [2028, new Date(2028, 3, 16)],
  ])('gir riktig påskedag for %i', (år, forventetDato) => {
    expect(beregnPåskedag(år)).toEqual(forventetDato);
  });
});
