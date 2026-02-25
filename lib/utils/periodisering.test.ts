import { describe, expect, it } from 'vitest';
import { hentPerioderSomTrengerVurdering, trengerVurderingsForslag } from 'lib/utils/periodisering';

describe('trengerVurderingsForslag', () => {
  it('skal returnere false hvis vi har nyeVurderinger', () => {
    const grunnlag = {
      nyeVurderinger: [{ begrunnelse: 'en begrunnelse' }],
      behøverVurderinger: [],
      sisteVedtatteVurderinger: [],
      kanVurderes: [],
    };
    const res = trengerVurderingsForslag(grunnlag);
    expect(res).toEqual(false);
  });
  it('skal returnere true hvis vi ikke har nyeVurderinger og det finnes noe i behøverVurdering', () => {
    const grunnlag = {
      behøverVurderinger: [{ fom: '2026-01-01', tom: '2999-01-01' }],
      nyeVurderinger: [],
      sisteVedtatteVurderinger: [],
      kanVurderes: [],
    };
    const res = trengerVurderingsForslag(grunnlag);
    expect(res).toEqual(true);
  });
  it('skal returnere true hvis vi ikke har nyeVurderinger og ikke har sisteVedtatteVurderinger', () => {
    const grunnlag = {
      behøverVurderinger: [],
      nyeVurderinger: [],
      sisteVedtatteVurderinger: [],
      kanVurderes: [],
    };
    const res = trengerVurderingsForslag(grunnlag);
    expect(res).toEqual(true);
  });
});
describe('hentPerioderSomTrengerVurdering', () => {
  it('skal returnere vurdering med fraDato fra  kanVurderes hvis vi ikke har sisteVedtatteVurderinger eller nyeVurderinger', () => {
    const grunnlag = {
      behøverVurderinger: [],
      nyeVurderinger: [],
      sisteVedtatteVurderinger: [],
      kanVurderes: [{ fom: '2026-01-01', tom: '2999-01-01' }],
    };
    const res = hentPerioderSomTrengerVurdering(grunnlag, () => ({}));
    expect(res).toEqual({ vurderinger: [{ fraDato: '01.01.2026', behøverVurdering: false }] });
  });
  it('skal returnere vurdering med fraDato fra  behøverVurdering hvis vi har perioder der', () => {
    const grunnlag = {
      kanVurderes: [{ fom: '2026-01-01', tom: '2999-01-01' }],
      nyeVurderinger: [],
      sisteVedtatteVurderinger: [],
      behøverVurderinger: [{ fom: '2026-02-01', tom: '2999-01-01' }],
    };
    const res = hentPerioderSomTrengerVurdering(grunnlag, () => ({ fraDato: '' }));
    expect(res).toEqual({ vurderinger: [{ fraDato: '01.02.2026', behøverVurdering: true }] });
  });
});
