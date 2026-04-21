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
});
