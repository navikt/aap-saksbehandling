import { describe, expect, it } from 'vitest';
import { prosseserSkjema } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/Skjemavalidering.js';
import { Vurderinger } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { JaEllerNei } from 'lib/utils/form';

describe('Skjemavalidering', () => {
  it('gir et errors-objekt når vi har valideringsfeil', () => {
    const vurderinger: Vurderinger = {
      '1234': [
        {
          formId: '1234',
        },
      ],
    };
    const res = prosseserSkjema(vurderinger);
    expect(res).toHaveProperty('errors');
    if ('errors' in res) {
      expect(res.errors.length).toBeGreaterThan(0);
    }
    expect(res).not.toHaveProperty('mappetSkjema');
  });

  it('gir mappet skjema når det ikke er noen valideringsfeil', () => {
    const vurderinger: Vurderinger = {
      '1234': [
        {
          formId: '1234',
          fom: new Date('2022-02-02'),
          tom: new Date('2028-02-02'),
          harForeldreAnsvar: JaEllerNei.Ja,
          begrunnelse: 'begrunnelse',
        },
      ],
    };

    const res = prosseserSkjema(vurderinger);
    expect(res).toHaveProperty('mappetSkjema');
    expect(res).not.toHaveProperty('errors');

    if ('mappetSkjema' in res) {
      expect(res.mappetSkjema.length).toBeGreaterThan(0);
    }
  });
});
