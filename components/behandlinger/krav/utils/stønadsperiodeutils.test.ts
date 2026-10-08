import { describe, expect, it } from 'vitest';
import { StønadsperiodeVurdering } from 'lib/types/types';
import {
  byggInitielleStønadsperiodeVurderinger,
  finnStønadsperiodeVurderingByReferanse,
  hentOriginaleStønadsperiodeFormFelter,
  stønadsperiodeVurderingTilFormFields,
} from './stønadsperiodeutils';

const vurdering: StønadsperiodeVurdering = {
  referanse: 'krav-1',
  begrunnelse: 'Eksisterende begrunnelse',
  harGjenværendeKvote: true,
  harHattOrdinærSiste52Uker: false,
  opprettet: '2025-04-01T10:30:00Z',
  relevantKravType: { type: 'NY_STØNADSPERIODE' },
  startDato: '2025-04-15',
  vurdertAv: 'Z000000',
  vurdertIBehandling: { id: 1 },
};

describe('stønadsperiodeutils', () => {
  it('henter originalfelter fra riktig referanse og prioriterer nye vurderinger', () => {
    const nyVurdering = { ...vurdering, begrunnelse: 'Ny vurdering' };
    const vedtattVurdering = { ...vurdering, referanse: 'krav-2' };
    const grunnlag = {
      harTilgangTilÅSaksbehandle: true,
      nyeVurderinger: [nyVurdering],
      vedtatteVurderinger: [vurdering, vedtattVurdering],
    };

    expect(finnStønadsperiodeVurderingByReferanse(grunnlag, 'krav-1')).toBe(nyVurdering);
    expect(hentOriginaleStønadsperiodeFormFelter(grunnlag, 'krav-1')).toEqual(
      stønadsperiodeVurderingTilFormFields(nyVurdering)
    );
    expect(finnStønadsperiodeVurderingByReferanse(grunnlag, 'krav-2')).toBe(vedtattVurdering);
    expect(hentOriginaleStønadsperiodeFormFelter(grunnlag, 'krav-2')).toEqual(
      stønadsperiodeVurderingTilFormFields(vedtattVurdering)
    );
    expect(finnStønadsperiodeVurderingByReferanse(grunnlag, 'ukjent')).toBeUndefined();
    expect(hentOriginaleStønadsperiodeFormFelter(grunnlag, 'ukjent')).toBeUndefined();
  });

  it('mapper begrunnelse, boolske verdier og dato til formfelter', () => {
    expect(stønadsperiodeVurderingTilFormFields(vurdering)).toEqual({
      begrunnelse: 'Eksisterende begrunnelse',
      brukerenHarHattOrdinærAAPInnen52Uker: 'nei',
      harGjenværendeKvote: 'ja',
      datoKravetSkalVurderesFra: '15.04.2025',
    });
    expect(
      stønadsperiodeVurderingTilFormFields({
        ...vurdering,
        harHattOrdinærSiste52Uker: true,
        harGjenværendeKvote: false,
      })
    ).toMatchObject({
      brukerenHarHattOrdinærAAPInnen52Uker: 'ja',
      harGjenværendeKvote: 'nei',
    });
  });

  it('beholder ett element per referanse og prioriterer nye vurderinger', () => {
    const resultat = byggInitielleStønadsperiodeVurderinger({
      harTilgangTilÅSaksbehandle: true,
      nyeVurderinger: [{ ...vurdering, begrunnelse: 'Ny vurdering' }],
      vedtatteVurderinger: [vurdering, { ...vurdering, referanse: 'krav-2' }],
    });
    expect(resultat).toEqual({
      'krav-1': stønadsperiodeVurderingTilFormFields({ ...vurdering, begrunnelse: 'Ny vurdering' }),
      'krav-2': stønadsperiodeVurderingTilFormFields(vurdering),
    });
  });

  it('gir tomt objekt uten vurderinger', () => {
    expect(
      byggInitielleStønadsperiodeVurderinger({
        harTilgangTilÅSaksbehandle: true,
        nyeVurderinger: [],
        vedtatteVurderinger: [],
      })
    ).toEqual({});
  });
});
