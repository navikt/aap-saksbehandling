import {
  erDelmalValgt,
  finnFritekstForValgtAlternativ,
  finnValgtAlternativ,
} from 'components/brevbygger/brevmalMapping';
import { FritekstDto, ValgDto } from 'lib/types/types';
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
    test('gir tom string når et valg ikke er valgt', () => {
      expect(finnValgtAlternativ('enId', [{ id: 'enAnnenId', key: 'enKey' }])).toEqual('');
    });

    test('gir tom string når ingen valg er valgt', () => {
      expect(finnValgtAlternativ('enId', undefined)).toEqual('');
    });

    test('gir en string tilbake når et valg er valgt', () => {
      expect(finnValgtAlternativ('enId', [{ id: 'enId', key: 'enKey' }])).toEqual('enKey');
    });
  });

  describe('finnFritekstForValg', () => {
    test('returnerer tom string når valget ikke er av fritekst-type', () => {
      expect(finnFritekstForValgtAlternativ('id1', undefined, undefined)).toEqual('');
    });

    test('returnerer friteksten når valget er av fritekst-type', () => {
      const valg: ValgDto[] = [{ id: 'id1', key: 'key1' }];
      const fritekst: FritekstDto[] = [
        { fritekst: JSON.stringify({ tekst: 'Her er det litt fritekst' }), key: 'key1', parentId: 'id1' },
      ];

      expect(finnFritekstForValgtAlternativ('id1', valg, fritekst)).toEqual('Her er det litt fritekst');
    });

    test('returnerer riktig fritekst for en gitt id', () => {
      const valg: ValgDto[] = [
        { id: 'id1', key: 'key1' },
        { id: 'id2', key: 'key1' },
      ];
      const fritekst: FritekstDto[] = [
        { fritekst: JSON.stringify({ tekst: 'Her er det litt fritekst' }), key: 'key1', parentId: 'id1' },
        {
          fritekst: JSON.stringify({ tekst: 'Her er det litt fritekst på et annet valg' }),
          key: 'key1',
          parentId: 'id2',
        },
      ];

      expect(finnFritekstForValgtAlternativ('id1', valg, fritekst)).toEqual('Her er det litt fritekst');
      expect(finnFritekstForValgtAlternativ('id2', valg, fritekst)).toEqual(
        'Her er det litt fritekst på et annet valg'
      );
    });
  });
});
