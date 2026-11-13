import { ForeslåVedtakGrunnlag, UnderveisAvslagsÅrsak, VilkårsavslagDto } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { BodyShort, Detail, HStack, Table, VStack } from '@navikt/ds-react';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from './ForeslåVedtakTabell.module.css';
import { exhaustiveCheck } from 'lib/utils/typescript';
import { mapRettighetsTypeTilTekst } from 'lib/utils/rettighetstype';
import { mapÅrsakTilTekst } from 'components/behandlinger/vedtak/foreslaavedtak/StansOpphørTabell';

type StansOpphør = ForeslåVedtakGrunnlag['stansOpphør'][number];
type StansOpphørType = StansOpphør['historikk'][number]['type'];
type Periode = ForeslåVedtakGrunnlag['perioder'][number];
type StansOpphørVurdering = StansOpphør['historikk'][number];

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

  const harEndret = grunnlag.perioder.some((periode) => !periode.erNy && periode.tidligerePerioder.length > 0);
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
          <Table.HeaderCell>Type</Table.HeaderCell>
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
        {grunnlag.perioder.map((vedtaksPeriode, index) => (
          <VedtaksPeriodeRad
            key={index}
            vedtaksPeriode={vedtaksPeriode}
            stansOpphør={grunnlag.stansOpphør}
            erAvslagUtenViderePerioder={
              vedtaksPeriode.utfall === 'IKKE_OPPFYLT' && index > sistePeriodeMedRettighetIndex
            }
            tagKolonneKlasse={tagKolonneKlasse}
          />
        ))}
        {stansOpphørUtenPeriode.map((stansOpphør) => (
          <StansOpphørUtenPeriodeRad
            key={`stansopphør-${stansOpphør.stansOpphørFraOgMed}`}
            stansOpphør={stansOpphør}
            tagKolonneKlasse={tagKolonneKlasse}
          />
        ))}
      </Table.Body>
    </TableStyled>
  );
};

interface VedtaksPeriodeRadProps {
  vedtaksPeriode: Periode;
  stansOpphør: StansOpphør[];
  erAvslagUtenViderePerioder: boolean;
  tagKolonneKlasse: string;
}

const VedtaksPeriodeRad = ({
  vedtaksPeriode,
  stansOpphør,
  erAvslagUtenViderePerioder,
  tagKolonneKlasse,
}: VedtaksPeriodeRadProps) => {
  const stansOpphørVurdering = finnStansOpphørVurdering(vedtaksPeriode.periode, stansOpphør);
  const stansOpphørType = stansOpphørVurdering?.type;
  const erEndret = !vedtaksPeriode.erNy && vedtaksPeriode.tidligerePerioder.length > 0;
  const erStansEllerOpphør =
    vedtaksPeriode.utfall === 'IKKE_OPPFYLT' && (stansOpphørType === 'STANS' || stansOpphørType === 'OPPHØR');

  const { fom, tom } = vedtaksPeriode.periode;
  const kunFomEndret = vedtaksPeriode.tidligerePerioder.find((p) => p.fom !== fom && p.tom === tom);
  const kunTomEndret = vedtaksPeriode.tidligerePerioder.find((p) => p.fom === fom && p.tom !== tom);
  const perioderMedBeggeDatoerEndret = vedtaksPeriode.tidligerePerioder.filter((p) => p.fom !== fom && p.tom !== tom);

  return (
    <Table.Row className={finnRadKlasse(vedtaksPeriode.erNy, erEndret, erStansEllerOpphør)}>
      <Table.DataCell>
        <HStack gap={'space-8'} align={'center'} wrap={false}>
          {vedtaksPeriode.erNy && (
            <span className={tagKolonneKlasse}>
              <NyTag />
            </span>
          )}
          {erEndret && (
            <span className={tagKolonneKlasse}>
              <EndretTag />
            </span>
          )}
          {vedtaksPeriode.utfall === 'OPPFYLT' ? (
            <CheckmarkCircleIcon className={styles.godkjentIcon} />
          ) : (
            <XMarkOctagonIcon className={styles.avslåttIcon} />
          )}
          <span className={styles.statusTekst}>{mapUtfallTilTekst(vedtaksPeriode.utfall, stansOpphørType)}</span>
        </HStack>
      </Table.DataCell>
      <Table.DataCell>
        <VStack gap={'space-2'}>
          {perioderMedBeggeDatoerEndret.map((p) => (
            <span key={`${p.fom}-${p.tom}`} className={styles.periode}>
              <BodyShort as="del" className={styles.gammelDato}>
                {formatDatoMedMånedsnavn(p.fom)} – {formatDatoMedMånedsnavn(p.tom)}
              </BodyShort>
            </span>
          ))}
          <span className={styles.periode}>
            {kunFomEndret && (
              <>
                <BodyShort as="del" className={styles.gammelDato}>
                  {formatDatoMedMånedsnavn(kunFomEndret.fom)}
                </BodyShort>{' '}
              </>
            )}
            <span className={kunFomEndret ? styles.endretDato : undefined}>{formatDatoMedMånedsnavn(fom)}</span> –
            {kunTomEndret && !vedtaksPeriode.tidligereVarÅpen && (
              <>
                {' '}
                <BodyShort as="del" className={styles.gammelDato}>
                  {formatDatoMedMånedsnavn(kunTomEndret.tom)}
                </BodyShort>
              </>
            )}
            {!erAvslagUtenViderePerioder && (
              <span className={kunTomEndret ? styles.endretDato : undefined}> {formatDatoMedMånedsnavn(tom)}</span>
            )}
          </span>
        </VStack>
      </Table.DataCell>
      <Table.DataCell className={styles.periode}>{finnTypeTekst(vedtaksPeriode, stansOpphørVurdering)}</Table.DataCell>
      <Table.DataCell>{finnÅrsakTekst(vedtaksPeriode, stansOpphørVurdering)}</Table.DataCell>
    </Table.Row>
  );
};

interface StansOpphørUtenPeriodeRadProps {
  stansOpphør: StansOpphør;
  tagKolonneKlasse: string;
}

const StansOpphørUtenPeriodeRad = ({ stansOpphør, tagKolonneKlasse }: StansOpphørUtenPeriodeRadProps) => {
  const vurdering = stansOpphør.historikk.at(0);

  return (
    <Table.Row className={vurdering?.erNy ? styles.stansOpphørNy : styles.stansOpphør}>
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
};

function finnRadKlasse(erNy: boolean, erEndret: boolean, erStansEllerOpphør: boolean) {
  if (erEndret) {
    return styles.endret;
  }
  if (erNy && erStansEllerOpphør) {
    return styles.stansOpphørNy;
  }
  if (erNy) {
    return styles.ny;
  }
  if (erStansEllerOpphør) {
    return styles.stansOpphør;
  }
  return undefined;
}

function finnTypeTekst(vedtaksPeriode: Periode, stansOpphørVurdering?: StansOpphørVurdering) {
  if (vedtaksPeriode.utfall === 'OPPFYLT') {
    return mapRettighetsTypeTilTekst(vedtaksPeriode.rettighetsType);
  }
  return mapAvslagsÅrsakTilTekst(
    vedtaksPeriode.avslagsårsak.vilkårsavslag,
    vedtaksPeriode.avslagsårsak.underveisavslag,
    stansOpphørVurdering
  );
}

function finnÅrsakTekst(vedtaksPeriode: Periode, stansOpphørVurdering?: StansOpphørVurdering) {
  if (vedtaksPeriode.utfall === 'OPPFYLT') {
    return '-';
  }
  if (stansOpphørVurdering) {
    return mapStansOpphørÅrsakerTilTekst(stansOpphørVurdering);
  }
  return mapVilkårsavslagTilTekst(vedtaksPeriode.avslagsårsak.vilkårsavslag);
}

function mapVilkårsavslagTilTekst(vilkårsavslag: VilkårsavslagDto[]) {
  const tekster = vilkårsavslag
    .map((avslag) => (avslag.avslagsårsak ? mapÅrsakTilTekst(avslag.avslagsårsak) : undefined))
    .filter((tekst) => tekst !== undefined);
  return tekster.length === 0 ? '-' : [...new Set(tekster)].join(', ');
}

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

function mapÅrsakerTilHjemler(vurdering?: StansOpphørVurdering): string[] {
  if (!vurdering || vurdering.type === 'OPPHEVET') {
    return [];
  }
  return vurdering.hjemler;
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
