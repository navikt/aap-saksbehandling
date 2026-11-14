import { BodyShort, HStack, Table, VStack } from '@navikt/ds-react';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { mapRettighetsTypeTilTekst } from 'lib/utils/rettighetstype';
import { NyEndretTag } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/NyEndretTag';
import {
  mapStansOpphørÅrsakerTilTekst,
  mapUtfallTilTekst,
  mapAvslagsÅrsakTilTekst,
  mapVilkårsavslagTilTekst,
  Periode,
  StansOpphør,
  StansOpphørVurdering,
} from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/foreslaaVedtakRadTekster';
import styles from './VedtaksPeriodeRad.module.css';

interface Props {
  vedtaksPeriode: Periode;
  stansOpphør: StansOpphør[];
  erAvslagUtenViderePerioder: boolean;
  kunNyTagger: boolean;
}

export const VedtaksPeriodeRad = ({ vedtaksPeriode, stansOpphør, erAvslagUtenViderePerioder, kunNyTagger }: Props) => {
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
          {vedtaksPeriode.erNy && <NyEndretTag type="Ny" kunNyTagger={kunNyTagger} />}
          {erEndret && <NyEndretTag type="Endret" kunNyTagger={kunNyTagger} />}
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

function finnStansOpphørVurdering(
  periode: { fom: string; tom: string },
  stansOpphør: StansOpphør[]
): StansOpphørVurdering | undefined {
  return stansOpphør
    .find((s) => s.stansOpphørFraOgMed >= periode.fom && s.stansOpphørFraOgMed <= periode.tom)
    ?.historikk.at(0);
}

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
