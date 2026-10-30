import { describe, expect, it } from 'vitest';
import { aktiveFiltreringer } from 'components/oppgaveliste/filtrering/filtreringUtils';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';

describe('aktiveFiltreringer', () => {
  it('returnerer tomt array når ingen filtre er satt', () => {
    const result = aktiveFiltreringer({});
    expect(result).toHaveLength(0);
  });

  it('inkluderer tilbakekrevingBeløpFom i aktive filtre med korrekt label', () => {
    const filter: FormFieldsFilter = { tilbakekrevingBeløpFom: '1000' };
    const result = aktiveFiltreringer(filter);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      key: 'tilbakekrevingBeløpFom',
      value: '1000',
      label: 'Beløp fra: 1000',
    });
  });

  it('inkluderer tilbakekrevingBeløpTom i aktive filtre med korrekt label', () => {
    const filter: FormFieldsFilter = { tilbakekrevingBeløpTom: '5000' };
    const result = aktiveFiltreringer(filter);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      key: 'tilbakekrevingBeløpTom',
      value: '5000',
      label: 'Beløp til: 5000',
    });
  });

  it('inkluderer begge beløpsfiltere når begge er satt', () => {
    const filter: FormFieldsFilter = { tilbakekrevingBeløpFom: '1000', tilbakekrevingBeløpTom: '5000' };
    const result = aktiveFiltreringer(filter);

    expect(result).toHaveLength(2);
    expect(result.map((f) => f.key)).toContain('tilbakekrevingBeløpFom');
    expect(result.map((f) => f.key)).toContain('tilbakekrevingBeløpTom');
  });

  it('ekskluderer beløpsfiltre når verdiene er undefined', () => {
    const filter: FormFieldsFilter = { tilbakekrevingBeløpFom: undefined, tilbakekrevingBeløpTom: undefined };
    const result = aktiveFiltreringer(filter);

    expect(result).toHaveLength(0);
  });

  it('beholder innsettingsrekkefølge, etiketter og opprinnelige datoverdier', () => {
    const fom = new Date(2026, 0, 2);
    const tom = new Date(2026, 1, 3);
    const filter: FormFieldsFilter = {
      tilbakekrevingBeløpTom: '5000',
      behandlingOpprettetTom: tom,
      saksbehandlere: [
        { value: 'Z000001', label: 'Første saksbehandler' },
        { value: 'Z000002', label: 'Andre saksbehandler' },
      ],
      behandlingOpprettetFom: fom,
      tilbakekrevingBeløpFom: '1000',
    };

    const result = aktiveFiltreringer(filter);

    expect(result).toEqual([
      { key: 'tilbakekrevingBeløpTom', value: '5000', label: 'Beløp til: 5000' },
      { key: 'behandlingOpprettetTom', value: tom, label: 'Behandling opprettet til: 03.02.2026' },
      { key: 'saksbehandlere', value: 'Z000001', label: 'Reservert av: Første saksbehandler' },
      { key: 'saksbehandlere', value: 'Z000002', label: 'Reservert av: Andre saksbehandler' },
      { key: 'behandlingOpprettetFom', value: fom, label: 'Behandling opprettet fra: 02.01.2026' },
      { key: 'tilbakekrevingBeløpFom', value: '1000', label: 'Beløp fra: 1000' },
    ]);
    expect(result[1].value).toBe(tom);
    expect(result[4].value).toBe(fom);
  });

  it('utelater tomme filtre, men beholder beløpet null som tekst', () => {
    const filter: FormFieldsFilter = {
      tilbakekrevingBeløpFom: '',
      tilbakekrevingBeløpTom: '0',
      behandlingOpprettetFom: undefined,
      behandlingOpprettetTom: undefined,
      saksbehandlere: [],
      avklaringsbehov: [],
    };

    expect(aktiveFiltreringer(filter)).toEqual([{ key: 'tilbakekrevingBeløpTom', value: '0', label: 'Beløp til: 0' }]);
  });
});
