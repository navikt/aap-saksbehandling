import { describe, expect, test } from 'vitest';
import { erNorskHelligdag } from 'lib/utils/helligdager';

describe('erNorskHelligdag', () => {
  test.each([
    ['1. nyttårsdag', new Date(2026, 0, 1)],
    ['1. mai', new Date(2025, 4, 1)],
    ['17. mai', new Date(2025, 4, 17)],
    ['1. juledag', new Date(2025, 11, 25)],
    ['2. juledag', new Date(2025, 11, 26)],
    ['skjærtorsdag 2025', new Date(2025, 3, 17)],
    ['langfredag 2025', new Date(2025, 3, 18)],
    ['2. påskedag 2025', new Date(2025, 3, 21)],
    ['Kristi himmelfartsdag 2025', new Date(2025, 4, 29)],
    ['2. pinsedag 2025', new Date(2025, 5, 9)],
  ])('regner %s som helligdag', (_, dato) => {
    expect(erNorskHelligdag(dato)).toBe(true);
  });

  test.each([
    ['en vanlig tirsdag', new Date(2025, 3, 15)],
    ['dagen før skjærtorsdag', new Date(2025, 3, 16)],
    ['dagen etter 2. påskedag', new Date(2025, 3, 22)],
  ])('regner %s som ikke helligdag', (_, dato) => {
    expect(erNorskHelligdag(dato)).toBe(false);
  });
});
