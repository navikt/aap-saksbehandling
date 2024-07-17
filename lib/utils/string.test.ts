import { describe, it, expect } from 'vitest';
import { storForbokstav } from 'lib/utils/string';

describe('storForbokstav', () => {
  it('skal returnere en string med stor forbokstav dersom value er bare uppercase', () => {
    expect(storForbokstav('HELLO PELLO')).toBe('Hello pello');
  });

  it('skal returnere en string med stor forbokstav dersom value er bare lowercase', () => {
    expect(storForbokstav('hello pello')).toBe('Hello pello');
  });
});
