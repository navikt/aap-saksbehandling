import { sorterEtterÅrIStigendeRekkefølge } from 'lib/utils/arrays';
import { describe, expect, test } from 'vitest';

type TypeMedÅr = {
  år: string;
};

describe('sorterÅrIStigendeRekkefølge', () => {
  test('sorterer et array i stigende rekkefølge på år', () => {
    const array: TypeMedÅr[] = [{ år: '2024' }, { år: '2023' }, { år: '2022' }];
    const resultat = sorterEtterÅrIStigendeRekkefølge(array);
    expect(resultat.at(0)).toEqual({ år: '2022' });
    expect(resultat.at(1)).toEqual({ år: '2023' });
    expect(resultat.at(2)).toEqual({ år: '2024' });
  });
});
