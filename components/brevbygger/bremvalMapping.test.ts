import { erDelmalValgt, erValgValgt } from 'components/brevbygger/brevmalMapping';
import { describe, expect, test } from 'vitest';

describe('brevmalMapping', () => {
  describe('erDelmalValgt', () => {
    test('returnerer false når en delmal ikke er valgt', () => {
      expect(erDelmalValgt('enId', [{ id: 'enAnnenId' }, { id: 'id2' }])).toBe(false);
    });

    test('returnerer false når ingen delmaler er valgt', () => {
      expect(erDelmalValgt('enId', [])).toBe(false);
    });

    test('returnerer true når en delmal er valgt', () => {
      expect(erDelmalValgt('enId', [{ id: 'enAnnenId' }, { id: 'enId' }])).toBe(true);
    });
  });

  describe('erValgValgt', () => {
    test('gir false når et valg ikke er valgt', () => {
      expect(erValgValgt('enValgNoekkel', 'enValgKey', [{ id: 'id1', key: 'key1' }])).toBe(false);
    });
    test('gir false når ingen valg er valgt', () => {
      expect(erValgValgt('enValgNoekkel', 'enValgKey', [])).toBe(false);
    });
    test('gir true når et valg er valgt', () => {
      expect(erValgValgt('id1', 'key1', [{ id: 'id1', key: 'key1' }])).toBe(true);
    });
  });
});
