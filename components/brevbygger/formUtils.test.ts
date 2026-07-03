import { describe, test, expect } from 'vitest';
import { initialiserFormVerdier, byggBrevdataPayload } from 'components/brevbygger/formUtils';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { BrevdataDto } from 'lib/types/types';
import { sanityAttrs } from 'components/brevbygger/brevbyggerTestdata';

describe('formUtils', () => {
  describe('initialiserFormVerdier', () => {
    test('bruker sammensatt nøkkel (delmalId###fritekstKey) for fritekst i delmaler', () => {
      const brevmal: BrevmalType = {
        ...sanityAttrs,
        _id: 'brevmal-1',
        beskrivelse: 'Test brevmal',
        overskrift: 'Test',
        journalposttittel: 'test',
        kanSendesAutomatisk: false,
        delmaler: [
          {
            _key: 'delmal-1-ref',
            _type: 'delmalRef',
            obligatorisk: false,
            delmal: {
              ...sanityAttrs,
              _id: 'delmal-1',
              beskrivelse: 'Delmal 1',
              teksteditor: [
                {
                  _key: 'fritekstnøkkel',
                  _type: 'fritekst',
                  fritekst: '',
                },
              ],
            },
          },
        ],
      };

      const brevdata: BrevdataDto = {
        betingetTekst: [],
        delmaler: [{ id: 'delmal-1' }],
        valg: [],
        fritekster: [
          {
            fritekst: JSON.stringify({ tekst: 'Tekst fra delmal 1' }),
            key: 'fritekstnøkkel',
            parentId: 'delmal-1',
          },
        ],
      };

      const result = initialiserFormVerdier(brevmal, brevdata);

      const compositeKey = 'delmal-1###fritekstnøkkel';
      expect(result.fritekster[compositeKey]).toBe('Tekst fra delmal 1');
      expect(result.fritekster['fritekstnøkkel']).toBeUndefined();
    });

    test('håndterer fritekst med samme nøkkel i forskjellige delmaler', () => {
      const brevmal: BrevmalType = {
        ...sanityAttrs,
        _id: 'brevmal-1',
        beskrivelse: 'Test brevmal',
        overskrift: 'Test',
        journalposttittel: 'test',
        kanSendesAutomatisk: false,
        delmaler: [
          {
            _key: 'delmal-1-ref',
            _type: 'delmalRef',
            obligatorisk: false,
            delmal: {
              ...sanityAttrs,
              _id: 'delmal-1',
              beskrivelse: 'Delmal 1',
              teksteditor: [
                {
                  _key: 'fritekstnøkkel',
                  _type: 'fritekst',
                  fritekst: '',
                },
              ],
            },
          },
          {
            _key: 'delmal-2-ref',
            _type: 'delmalRef',
            obligatorisk: false,
            delmal: {
              ...sanityAttrs,
              _id: 'delmal-2',
              beskrivelse: 'Delmal 2',
              teksteditor: [
                {
                  _key: 'fritekstnøkkel',
                  _type: 'fritekst',
                  fritekst: '',
                },
              ],
            },
          },
        ],
      };

      const brevdata: BrevdataDto = {
        betingetTekst: [],
        delmaler: [{ id: 'delmal-1' }, { id: 'delmal-2' }],
        valg: [],
        fritekster: [
          {
            fritekst: JSON.stringify({ tekst: 'Tekst fra delmal 1' }),
            key: 'fritekstnøkkel',
            parentId: 'delmal-1',
          },
          {
            fritekst: JSON.stringify({ tekst: 'Tekst fra delmal 2' }),
            key: 'fritekstnøkkel',
            parentId: 'delmal-2',
          },
        ],
      };

      const result = initialiserFormVerdier(brevmal, brevdata);

      expect(result.fritekster['delmal-1###fritekstnøkkel']).toBe('Tekst fra delmal 1');
      expect(result.fritekster['delmal-2###fritekstnøkkel']).toBe('Tekst fra delmal 2');
    });

    test('fritekst i valg bruker ikke sammensatt nøkkel', () => {
      const brevmal: BrevmalType = {
        ...sanityAttrs,
        _id: 'brevmal-1',
        beskrivelse: 'Test brevmal',
        overskrift: 'Test',
        journalposttittel: 'test',
        kanSendesAutomatisk: false,
        delmaler: [
          {
            _key: 'delmal-1-ref',
            _type: 'delmalRef',
            obligatorisk: false,
            delmal: {
              ...sanityAttrs,
              _id: 'delmal-1',
              beskrivelse: 'Delmal 1',
              teksteditor: [
                {
                  _key: 'valg-ref-key',
                  _type: 'valgRef',
                  obligatorisk: false,
                  valg: {
                    ...sanityAttrs,
                    _id: 'valg-1',
                    beskrivelse: 'Valg 1',
                    alternativer: [
                      {
                        _key: 'fritekstnøkkel',
                        _type: 'fritekst',
                        fritekst: '',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      };

      const brevdata: BrevdataDto = {
        betingetTekst: [],
        delmaler: [],
        valg: [],
        fritekster: [
          {
            fritekst: JSON.stringify({ tekst: 'Fritekst fra valg' }),
            key: 'fritekstnøkkel',
            parentId: 'valg-1',
          },
        ],
      };

      const result = initialiserFormVerdier(brevmal, brevdata);

      expect(result.fritekster['valg-1']).toBe('Fritekst fra valg');
    });
  });

  describe('byggBrevdataPayload', () => {
    test('bygger payload for fritekst med sammensatt nøkkel', () => {
      const brevmal: BrevmalType = {
        ...sanityAttrs,
        _id: 'brevmal-1',
        beskrivelse: 'Test brevmal',
        overskrift: 'Test',
        journalposttittel: 'test',
        kanSendesAutomatisk: false,
        delmaler: [
          {
            _key: 'delmal-1-ref',
            _type: 'delmalRef',
            obligatorisk: false,
            delmal: {
              ...sanityAttrs,
              _id: 'delmal-1',
              beskrivelse: 'Delmal 1',
              teksteditor: [
                {
                  _key: 'fritekstnøkkel',
                  _type: 'fritekst',
                  fritekst: '',
                },
              ],
            },
          },
        ],
      };

      const formVerdier = {
        delmaler: { 'delmal-1': true },
        valg: {},
        fritekster: {
          'delmal-1###fritekstnøkkel': 'User input tekst',
        },
      };

      const result = byggBrevdataPayload(formVerdier, brevmal, undefined);

      expect(result.fritekster).toHaveLength(1);
      expect(result.fritekster[0]).toEqual({
        fritekst: JSON.stringify({ tekst: 'User input tekst' }),
        key: 'fritekstnøkkel',
        parentId: 'delmal-1',
      });
    });

    test('håndterer samme fritekstnøkkel i forskjellige delmaler', () => {
      const brevmal: BrevmalType = {
        ...sanityAttrs,
        _id: 'brevmal-1',
        beskrivelse: 'Test brevmal',
        overskrift: 'Test',
        journalposttittel: 'test',
        kanSendesAutomatisk: false,
        delmaler: [
          {
            _key: 'delmal-1-ref',
            _type: 'delmalRef',
            obligatorisk: false,
            delmal: {
              ...sanityAttrs,
              _id: 'delmal-1',
              beskrivelse: 'Delmal 1',
              teksteditor: [
                {
                  _key: 'fritekstnøkkel',
                  _type: 'fritekst',
                  fritekst: '',
                },
              ],
            },
          },
          {
            _key: 'delmal-2-ref',
            _type: 'delmalRef',
            obligatorisk: false,
            delmal: {
              ...sanityAttrs,
              _id: 'delmal-2',
              beskrivelse: 'Delmal 2',
              teksteditor: [
                {
                  _key: 'fritekstnøkkel',
                  _type: 'fritekst',
                  fritekst: '',
                },
              ],
            },
          },
        ],
      };

      const formVerdier = {
        delmaler: { 'delmal-1': true, 'delmal-2': true },
        valg: {},
        fritekster: {
          'delmal-1###fritekstnøkkel': 'Tekst fra delmal 1',
          'delmal-2###fritekstnøkkel': 'Tekst fra delmal 2',
        },
      };

      const result = byggBrevdataPayload(formVerdier, brevmal, undefined);

      expect(result.fritekster).toHaveLength(2);
      expect(result.fritekster).toContainEqual({
        fritekst: JSON.stringify({ tekst: 'Tekst fra delmal 1' }),
        key: 'fritekstnøkkel',
        parentId: 'delmal-1',
      });
      expect(result.fritekster).toContainEqual({
        fritekst: JSON.stringify({ tekst: 'Tekst fra delmal 2' }),
        key: 'fritekstnøkkel',
        parentId: 'delmal-2',
      });
    });

    test('bruker ikke sammensatt nøkkel for fritekst knyttet til et valg', () => {
      const brevmal: BrevmalType = {
        ...sanityAttrs,
        _id: 'brevmal-1',
        beskrivelse: 'Test brevmal',
        overskrift: 'Test',
        journalposttittel: 'test',
        kanSendesAutomatisk: false,
        delmaler: [
          {
            _key: 'delmal-1-ref',
            _type: 'delmalRef',
            obligatorisk: false,
            delmal: {
              ...sanityAttrs,
              _id: 'delmal-1',
              beskrivelse: 'Delmal 1',
              teksteditor: [
                {
                  _key: 'valg-ref-key',
                  _type: 'valgRef',
                  obligatorisk: false,
                  valg: {
                    ...sanityAttrs,
                    _id: 'valg-1',
                    beskrivelse: 'Valg 1',
                    alternativer: [
                      {
                        _key: 'fritekstnøkkel',
                        _type: 'fritekst',
                        fritekst: '',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      };

      const formVerdier = {
        delmaler: {},
        valg: { 'valg-1': 'fritekstnøkkel' },
        fritekster: {
          'valg-1': 'Fritekst fra valg',
        },
      };

      const result = byggBrevdataPayload(formVerdier, brevmal, undefined);

      // Verify fritekst in valg uses valgId as parentId (unchanged)
      expect(result.fritekster).toHaveLength(1);
      expect(result.fritekster[0]).toEqual({
        fritekst: JSON.stringify({ tekst: 'Fritekst fra valg' }),
        key: 'fritekstnøkkel',
        parentId: 'valg-1',
      });
    });
  });
});
