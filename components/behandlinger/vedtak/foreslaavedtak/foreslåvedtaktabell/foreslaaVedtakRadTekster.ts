import { ForeslåVedtakGrunnlag, UnderveisAvslagsÅrsak, VilkårsavslagDto } from 'lib/types/types';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { mapÅrsakTilTekst } from 'components/behandlinger/vedtak/foreslaavedtak/StansOpphørTabell';

export type StansOpphør = ForeslåVedtakGrunnlag['stansOpphør'][number];
export type StansOpphørVurdering = StansOpphør['historikk'][number];
export type StansOpphørType = StansOpphørVurdering['type'];
export type Periode = ForeslåVedtakGrunnlag['perioder'][number];

export function mapUtfallTilTekst(utfall: string, stansOpphørType?: StansOpphørType) {
  switch (utfall) {
    case 'OPPFYLT':
      return 'AAP innvilget';
    case 'IKKE_OPPFYLT':
      return mapStansOpphørTilTekst(stansOpphørType);
  }
}

export function mapStansOpphørTilTekst(type?: StansOpphørType) {
  switch (type) {
    case 'STANS':
      return 'Stans';
    case 'OPPHØR':
      return 'Opphør';
    default:
      return 'Ikke rett til AAP';
  }
}

export function mapStansOpphørÅrsakerTilTekst(vurdering?: StansOpphørVurdering) {
  if (!vurdering || vurdering.type === 'OPPHEVET' || vurdering.årsaker.length === 0) {
    return '-';
  }
  return vurdering.årsaker.map(mapÅrsakTilTekst).join(', ');
}

export function mapÅrsakerTilHjemler(vurdering?: StansOpphørVurdering): string[] {
  if (!vurdering || vurdering.type === 'OPPHEVET') {
    return [];
  }
  return vurdering.hjemler;
}

export function mapStansOpphørÅrsakerTilHjemmel(vurdering?: StansOpphørVurdering) {
  const hjemler = mapÅrsakerTilHjemler(vurdering);
  return hjemler.length === 0 ? '-' : [...new Set(hjemler)].join(', ');
}

export function mapVilkårsavslagTilTekst(vilkårsavslag: VilkårsavslagDto[]) {
  const tekster = vilkårsavslag
    .map((avslag) => (avslag.avslagsårsak ? mapÅrsakTilTekst(avslag.avslagsårsak) : undefined))
    .filter((tekst) => tekst !== undefined);
  return tekster.length === 0 ? '-' : [...new Set(tekster)].join(', ');
}

function mapUnderveisÅrsakTilHjemmel(underveisAvslag: UnderveisAvslagsÅrsak) {
  switch (underveisAvslag) {
    case 'IKKE_GRUNNLEGGENDE_RETT':
      return '';
    case 'IKKE_OVERHOLDT_MELDEPLIKT_SANKSJON':
      return '§ 11-10';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_11_7_OPPHØR':
      return '§ 11-7';
    case 'SONER_STRAFF':
      return '§ 11-26';
    case 'ARBEIDER_MER_ENN_GRENSEVERDI':
      return '§ 11-23';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_11_7_STANS':
      return '§ 11-7';
    case 'BRUDD_PÅ_OPPHOLDSKRAV_11_3_STANS':
      return '§ 11-3';
    case 'BRUDD_PÅ_OPPHOLDSKRAV_11_3_OPPHØR':
      return '§ 11-3';
    case 'MELDEPLIKT_FRIST_IKKE_PASSERT':
      return '§ 11-10';
    case 'VARIGHETSKVOTE_BRUKT_OPP':
      return '§ 11-12';
    default:
      return exhaustiveCheck(underveisAvslag);
  }
}

export function mapAvslagsÅrsakTilTekst(
  vilkårAvslag: VilkårsavslagDto[],
  underveisAvslag?: UnderveisAvslagsÅrsak | null,
  stansOpphørVurdering?: StansOpphørVurdering
) {
  const hjemler = vilkårAvslag.map((avslag) => avslag.vilkår);
  if (underveisAvslag && underveisAvslag != 'IKKE_GRUNNLEGGENDE_RETT') {
    hjemler.push(mapUnderveisÅrsakTilHjemmel(underveisAvslag));
  }
  hjemler.push(...mapÅrsakerTilHjemler(stansOpphørVurdering));
  return [...new Set(hjemler)].join(', ');
}
