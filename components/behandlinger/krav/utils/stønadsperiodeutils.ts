import { StønadsperiodeGrunnlag, StønadsperiodeVurdering, StønadsperiodeVurderingLøsning } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';

export interface StønadsperiodeKravFormFields {
  begrunnelse: string;
  brukerenHarHattOrdinærAAPInnen52Uker?: string;
  harGjenværendeKvote?: string;
  datoKravetSkalVurderesFra: string;
  stansOpphørType?: 'STANS' | 'OPPHØR';
  stansÅrsaker?: string[];
}

export interface StønadsperiodeFormFields {
  valgteKrav: string[];
  vurderinger: Record<string, StønadsperiodeKravFormFields>;
}

export function finnStønadsperiodeVurderingFraReferanse(
  grunnlag: StønadsperiodeGrunnlag,
  referanse: string
): StønadsperiodeVurdering | undefined {
  return (
    grunnlag.nyeVurderinger.find((vurdering) => vurdering.referanse === referanse) ??
    grunnlag.vedtatteVurderinger.find((vurdering) => vurdering.referanse === referanse)
  );
}

export function hentOriginaleStønadsperiodeFormFelter(
  grunnlag: StønadsperiodeGrunnlag,
  referanse: string
): StønadsperiodeKravFormFields | undefined {
  const vurdering = finnStønadsperiodeVurderingFraReferanse(grunnlag, referanse);
  return vurdering ? stønadsperiodeVurderingTilFormFields(vurdering) : undefined;
}

export function stønadsperiodeVurderingTilFormFields(vurdering: StønadsperiodeVurdering): StønadsperiodeKravFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse || '',
    brukerenHarHattOrdinærAAPInnen52Uker: getJaNeiEllerUndefined(vurdering.harHattOrdinærSiste52Uker),
    harGjenværendeKvote: getJaNeiEllerUndefined(vurdering.harGjenværendeKvote),
    datoKravetSkalVurderesFra: vurdering.startDato ? formaterDatoForFrontend(vurdering.startDato) : '',
  };
}

export function byggInitielleStønadsperiodeVurderinger(
  grunnlag: StønadsperiodeGrunnlag
): StønadsperiodeFormFields['vurderinger'] {
  const vurderinger = [...grunnlag.nyeVurderinger, ...grunnlag.vedtatteVurderinger];
  const unikeVurderinger = vurderinger.filter(
    (vurdering, index) => vurderinger.findIndex((annen) => annen.referanse === vurdering.referanse) === index
  );

  return Object.fromEntries(
    unikeVurderinger.map((vurdering) => [vurdering.referanse, stønadsperiodeVurderingTilFormFields(vurdering)])
  );
}

export function byggVurderingerFraSKjema(
  grunnlag: StønadsperiodeGrunnlag,
  vurderinger: Record<string, StønadsperiodeKravFormFields>
): StønadsperiodeVurderingLøsning[] {
  const endredeVurderinger = Object.entries(vurderinger).filter(([referanse, felt]) => {
    const original = hentOriginaleStønadsperiodeFormFelter(grunnlag, referanse);
    if (!original) return false;
    return erFelterEndret(original, felt);
  });

  return endredeVurderinger.map(([referanse, felter]) => feltTilLøsning(felter, referanse));
}

function feltTilLøsning(felter: StønadsperiodeKravFormFields, referanse: string): StønadsperiodeVurderingLøsning {
  const relevantKravType = { type: 'NY_STØNADSPERIODE' }; // TODO her må vi utlede hvilken type det er

  return {
    // @ts-expect-error Her må vi fikse typene
    relevantKravType: relevantKravType,
    referanse: { verdi: referanse },
    begrunnelse: felter.begrunnelse,
    harGjenværendeKvote: felter.harGjenværendeKvote === JaEllerNei.Ja,
    harHattOrdinærSiste52Uker: felter.brukerenHarHattOrdinærAAPInnen52Uker === JaEllerNei.Ja,
    startDato: felter.datoKravetSkalVurderesFra,
    stansOpphør: {
      type: 'STANS',
      årsaker: ['IKKE_RETT_PA_AAP_I_PERIODE_SOM_ARBEIDSSOKER'],
    },
  };
}

function erFelterEndret(original: StønadsperiodeKravFormFields, gjeldende: StønadsperiodeKravFormFields): boolean {
  return (
    original.begrunnelse !== gjeldende.begrunnelse ||
    original.brukerenHarHattOrdinærAAPInnen52Uker !== gjeldende.brukerenHarHattOrdinærAAPInnen52Uker ||
    original.datoKravetSkalVurderesFra !== gjeldende.datoKravetSkalVurderesFra ||
    original.harGjenværendeKvote !== gjeldende.harGjenværendeKvote
  );
}
