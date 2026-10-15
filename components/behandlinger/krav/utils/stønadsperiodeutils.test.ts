import { describe, expect, it } from 'vitest';
import { StønadsperiodeGrunnlag, StønadsperiodeVurdering } from 'lib/types/types';
import {
  byggInitielleStønadsperiodeVurderinger,
  byggVurderingerFraSKjema,
  finnStønadsperiodeVurderingFraReferanse,
  hentOriginaleStønadsperiodeFormFelter,
  StønadsperiodeKravFormFields,
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

    expect(finnStønadsperiodeVurderingFraReferanse(grunnlag, 'krav-1')).toBe(nyVurdering);
    expect(hentOriginaleStønadsperiodeFormFelter(grunnlag, 'krav-1')).toEqual(
      stønadsperiodeVurderingTilFormFields(nyVurdering)
    );
    expect(finnStønadsperiodeVurderingFraReferanse(grunnlag, 'krav-2')).toBe(vedtattVurdering);
    expect(hentOriginaleStønadsperiodeFormFelter(grunnlag, 'krav-2')).toEqual(
      stønadsperiodeVurderingTilFormFields(vedtattVurdering)
    );
    expect(finnStønadsperiodeVurderingFraReferanse(grunnlag, 'ukjent')).toBeUndefined();
    expect(hentOriginaleStønadsperiodeFormFelter(grunnlag, 'ukjent')).toBeUndefined();
  });

  it('mapper begrunnelse, boolske verdier og dato til formfelter', () => {
    expect(stønadsperiodeVurderingTilFormFields(vurdering)).toEqual({
      begrunnelse: 'Eksisterende begrunnelse',
      harHattOrdinærSiste52Uker: 'nei',
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
      harHattOrdinærSiste52Uker: 'ja',
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

  it('bygger payload med kravtypen fra grunnlaget og valgte stansårsaker', () => {
    const grunnlag: StønadsperiodeGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      nyeVurderinger: [{ ...vurdering, relevantKravType: { type: 'AVSLAG' } }],
      vedtatteVurderinger: [],
    };
    const felter: StønadsperiodeKravFormFields = {
      ...stønadsperiodeVurderingTilFormFields(vurdering),
      begrunnelse: 'Oppdatert begrunnelse',
      stansOpphørType: 'STANS',
      stansÅrsaker: ['BRUKER_UNDER_18'],
    };

    expect(byggVurderingerFraSKjema(grunnlag, { 'krav-1': felter })).toMatchObject([
      {
        relevantKravType: { type: 'AVSLAG' },
        referanse: { verdi: 'krav-1' },
        stansOpphør: { type: 'STANS', årsaker: ['BRUKER_UNDER_18'] },
      },
    ]);
  });

  it('sender Opphør med tom årsaksliste', () => {
    const grunnlag: StønadsperiodeGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      nyeVurderinger: [vurdering],
      vedtatteVurderinger: [],
    };
    const felter: StønadsperiodeKravFormFields = {
      ...stønadsperiodeVurderingTilFormFields(vurdering),
      begrunnelse: 'Oppdatert begrunnelse',
      stansOpphørType: 'OPPHØR',
    };

    expect(byggVurderingerFraSKjema(grunnlag, { 'krav-1': felter })[0].stansOpphør).toEqual({
      type: 'OPPHØR',
      årsaker: [],
    });
  });
});
