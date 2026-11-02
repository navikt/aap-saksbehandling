import { ForeslåVedtakGrunnlag, UnderveisAvslagsÅrsak, VilkårsavslagDto } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { Detail, HStack, Table, VStack } from '@navikt/ds-react';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from './ForeslåVedtakTabell.module.css';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { mapRettighetsTypeTilTekst } from 'lib/utils/rettighetstype';
import { mapÅrsakTilTekst } from 'components/behandlinger/vedtak/foreslåvedtak/StansOpphørTabell';

type StansOpphør = ForeslåVedtakGrunnlag['stansOpphør'][number];
type StansOpphørType = StansOpphør['historikk'][number]['type'];
type StansOpphørVurdering = StansOpphør['historikk'][number];
type StansOpphørÅrsak = StansOpphørVurdering['årsaker'][number];

interface Props {
  grunnlag: ForeslåVedtakGrunnlag;
}

const NyTag = () => (
  <Detail weight="semibold" className={styles.nyEndretTekstTag}>
    Ny
  </Detail>
);

const EndretTag = () => (
  <Detail weight="semibold" className={styles.nyEndretTekstTag}>
    Endret
  </Detail>
);

export const ForeslåVedtakTabell = ({ grunnlag }: Props) => {
  const sistePeriodeMedRettighetIndex = grunnlag.perioder.findLastIndex((periode) => periode.utfall === 'OPPFYLT');

  const harEndret = grunnlag.perioder.some((periode) => {
    const vurdering = finnStansOpphørVurdering(periode.periode, grunnlag.stansOpphør);
    const erNy = periode.utfall === 'OPPFYLT' ? periode.erNy : vurdering?.erNy === true;
    return !erNy && periode.tidligerePerioder.length > 0;
  });
  const tagKolonneKlasse = harEndret ? styles.tagKolonne : `${styles.tagKolonne} ${styles.tagKolonneKunNy}`;

  const stansOpphørUtenPeriode = grunnlag.stansOpphør.filter(
    (s) =>
      s.historikk.at(0)?.type !== 'OPPHEVET' &&
      !grunnlag.perioder.some((p) => s.stansOpphørFraOgMed >= p.periode.fom && s.stansOpphørFraOgMed <= p.periode.tom)
  );

  return (
    <TableStyled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>AAP status</Table.HeaderCell>
          <Table.HeaderCell>Periode</Table.HeaderCell>
          <Table.HeaderCell className={tagKolonneKlasse}>Type</Table.HeaderCell>
          <Table.HeaderCell>Årsak</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {grunnlag.perioder.length === 0 && stansOpphørUtenPeriode.length === 0 && (
          <Table.Row>
            <Table.DataCell>
              <HStack gap={'space-8'} align={'center'}>
                <XMarkOctagonIcon className={styles.avslåttIcon} />
                {mapUtfallTilTekst('IKKE_OPPFYLT')}
              </HStack>
            </Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
          </Table.Row>
        )}
        {grunnlag.perioder.map((vedtaksPeriode, index) => {
          const avslagUtenViderePerioder =
            vedtaksPeriode.utfall === 'IKKE_OPPFYLT' && index > sistePeriodeMedRettighetIndex;
          const stansOpphørType = finnStansOpphørType(vedtaksPeriode.periode, grunnlag.stansOpphør);
          const stansOpphørVurdering = finnStansOpphørVurdering(vedtaksPeriode.periode, grunnlag.stansOpphør);
          const erNy = vedtaksPeriode.utfall === 'OPPFYLT' ? vedtaksPeriode.erNy : stansOpphørVurdering?.erNy === true;
          const erEndret = !erNy && vedtaksPeriode.tidligerePerioder.length > 0;
          const erStansEllerOpphør =
            vedtaksPeriode.utfall === 'IKKE_OPPFYLT' && (stansOpphørType === 'STANS' || stansOpphørType === 'OPPHØR');
          const radKlasse = erNy
            ? erStansEllerOpphør
              ? styles.nyAvslag
              : styles.ny
            : erEndret
              ? styles.endret
              : undefined;

          return (
            <Table.Row
              key={`${vedtaksPeriode.utfall}-${vedtaksPeriode.rettighetsType}-${vedtaksPeriode.periode?.fom}`}
              className={radKlasse}
            >
              <Table.DataCell>
                <HStack gap={'space-8'} align={'center'} wrap={false}>
                  {(erNy || erEndret) && <span className={tagKolonneKlasse}>{erNy ? <NyTag /> : <EndretTag />}</span>}
                  {vedtaksPeriode.utfall == 'OPPFYLT' ? (
                    <CheckmarkCircleIcon className={styles.godkjentIcon} />
                  ) : (
                    <XMarkOctagonIcon className={styles.avslåttIcon} />
                  )}
                  <span className={styles.statusTekst}>
                    {mapUtfallTilTekst(vedtaksPeriode.utfall, stansOpphørType)}
                  </span>
                </HStack>
              </Table.DataCell>
              <Table.DataCell>
                <VStack gap={'space-2'}>
                  {vedtaksPeriode.tidligerePerioder
                    .filter((p) => p.fom !== vedtaksPeriode.periode.fom)
                    .map((p) => (
                      <span key={`${p.fom}-${p.tom}`} className={`${styles.periode} ${styles.gammelDato}`}>
                        {formatDatoMedMånedsnavn(p.fom)} – {formatDatoMedMånedsnavn(p.tom)}
                      </span>
                    ))}
                  <span className={styles.periode}>
                    {formatDatoMedMånedsnavn(vedtaksPeriode.periode.fom)} –
                    {vedtaksPeriode.tidligerePerioder
                      .filter((p) => p.fom === vedtaksPeriode.periode.fom && !vedtaksPeriode.tidligereVarÅpen)
                      .map((p) => (
                        <span key={p.tom} className={styles.gammelDato}>
                          {' '}
                          {formatDatoMedMånedsnavn(p.tom)}
                        </span>
                      ))}
                    {!avslagUtenViderePerioder && (
                      <span className={erEndret ? styles.endretDato : undefined}>
                        {' '}
                        {formatDatoMedMånedsnavn(vedtaksPeriode.periode.tom)}
                      </span>
                    )}
                  </span>
                </VStack>
              </Table.DataCell>
              <Table.DataCell className={styles.periode}>
                {vedtaksPeriode.utfall == 'OPPFYLT'
                  ? mapRettighetsTypeTilTekst(vedtaksPeriode.rettighetsType)
                  : mapAvslagsÅrsakTilTekst(
                      vedtaksPeriode.avslagsårsak.vilkårsavslag,
                      vedtaksPeriode.avslagsårsak.underveisavslag,
                      stansOpphørVurdering
                    )}
              </Table.DataCell>
              <Table.DataCell>
                {vedtaksPeriode.utfall == 'OPPFYLT' ? '-' : mapStansOpphørÅrsakerTilTekst(stansOpphørVurdering)}
              </Table.DataCell>
            </Table.Row>
          );
        })}
        {stansOpphørUtenPeriode.map((stansOpphør) => {
          const vurdering = stansOpphør.historikk.at(0);

          return (
            <Table.Row
              key={`stansopphør-${stansOpphør.stansOpphørFraOgMed}`}
              className={vurdering?.erNy ? styles.nyAvslag : undefined}
            >
              <Table.DataCell>
                <HStack gap={'space-8'} align={'center'}>
                  {vurdering?.erNy && (
                    <span className={tagKolonneKlasse}>
                      <NyTag />
                    </span>
                  )}
                  <XMarkOctagonIcon className={styles.avslåttIcon} />
                  {mapStansOpphørTilTekst(vurdering?.type)}
                </HStack>
              </Table.DataCell>
              <Table.DataCell>{formatDatoMedMånedsnavn(stansOpphør.stansOpphørFraOgMed)} -</Table.DataCell>
              <Table.DataCell>{mapStansOpphørÅrsakerTilHjemmel(vurdering)}</Table.DataCell>
              <Table.DataCell>{mapStansOpphørÅrsakerTilTekst(vurdering)}</Table.DataCell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </TableStyled>
  );
};

function mapStansOpphørÅrsakerTilTekst(vurdering?: StansOpphørVurdering) {
  if (!vurdering || vurdering.type === 'OPPHEVET' || vurdering.årsaker.length === 0) {
    return '-';
  }
  return vurdering.årsaker.map(mapÅrsakTilTekst).join(', ');
}

function finnStansOpphørVurdering(
  periode: { fom: string; tom: string },
  stansOpphør: StansOpphør[]
): StansOpphørVurdering | undefined {
  return stansOpphør
    .find((s) => s.stansOpphørFraOgMed >= periode.fom && s.stansOpphørFraOgMed <= periode.tom)
    ?.historikk.at(0);
}

function finnStansOpphørType(
  periode: { fom: string; tom: string },
  stansOpphør: StansOpphør[]
): StansOpphørType | undefined {
  return stansOpphør
    .find((s) => s.stansOpphørFraOgMed >= periode.fom && s.stansOpphørFraOgMed <= periode.tom)
    ?.historikk.at(0)?.type;
}

function mapUtfallTilTekst(utfall: string, stansOpphørType?: StansOpphørType) {
  switch (utfall) {
    case 'OPPFYLT':
      return 'AAP innvilget';
    case 'IKKE_OPPFYLT':
      return mapStansOpphørTilTekst(stansOpphørType);
  }
}

function mapStansOpphørTilTekst(type?: StansOpphørType) {
  switch (type) {
    case 'STANS':
      return 'Stans';
    case 'OPPHØR':
      return 'Opphør';
    default:
      return 'Ikke rett til AAP';
  }
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

function mapÅrsakTilHjemmel(årsak: StansOpphørÅrsak): string | undefined {
  switch (årsak) {
    case 'IKKE_RETT_UNDER_STRAFFEGJENNOMFØRING':
      return '§ 11-26';
    case 'ANNEN_FULL_YTELSE':
      return '§ 11-27';
    case 'INNTEKTSTAP_DEKKES_ETTER_ANNEN_LOVGIVNING':
      return '§ 11-29';
    case 'IKKE_RETT_PA_AAP_UNDER_BEHANDLING_AV_UFORE':
      return '§ 11-18';
    case 'VARIGHET_OVERSKREDET_OVERGANG_UFORE':
      return '§ 11-18 1. ledd';
    case 'VARIGHET_OVERSKREDET_ARBEIDSSØKER':
    case 'IKKE_RETT_PA_AAP_I_PERIODE_SOM_ARBEIDSSOKER':
      return '§ 11-17';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_STANS':
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_OPPHØR':
      return '§ 11-7';
    case 'BRUDD_PÅ_OPPHOLDSKRAV_STANS':
    case 'BRUDD_PÅ_OPPHOLDSKRAV_OPPHØR':
      return '§ 11-3';
    case 'ORDINÆRKVOTE_BRUKT_OPP':
      return '§ 11-12';
    case 'SYKEPENGEERSTATNINGKVOTE_BRUKT_OPP':
      return '§ 11-13';
    default:
      return undefined;
  }
}

function mapÅrsakerTilHjemler(vurdering?: StansOpphørVurdering): string[] {
  if (!vurdering || vurdering.type === 'OPPHEVET') {
    return [];
  }
  return vurdering.årsaker.map(mapÅrsakTilHjemmel).filter((hjemmel) => hjemmel !== undefined);
}

function mapStansOpphørÅrsakerTilHjemmel(vurdering?: StansOpphørVurdering) {
  const hjemler = mapÅrsakerTilHjemler(vurdering);
  return hjemler.length === 0 ? '-' : [...new Set(hjemler)].join(', ');
}

function mapAvslagsÅrsakTilTekst(
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
