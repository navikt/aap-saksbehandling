import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { HStack, Table } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from './ForeslåVedtakTabell.module.css';
import { VedtaksPeriodeRad } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/VedtaksPeriodeRad';
import { StansOpphørUtenPeriodeRad } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/StansOpphørUtenPeriodeRad';
import { mapUtfallTilTekst } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/foreslaaVedtakRadTekster';

interface Props {
  grunnlag: ForeslåVedtakGrunnlag;
}

export const ForeslåVedtakTabell = ({ grunnlag }: Props) => {
  const sistePeriodeMedRettighetIndex = grunnlag.perioder.findLastIndex((periode) => periode.utfall === 'OPPFYLT');

  const harEndret = grunnlag.perioder.some((periode) => !periode.erNy && periode.tidligerePerioder.length > 0);

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
            kunNyTagger={!harEndret}
          />
        ))}
        {stansOpphørUtenPeriode.map((stansOpphør) => (
          <StansOpphørUtenPeriodeRad
            key={`stansopphør-${stansOpphør.stansOpphørFraOgMed}`}
            stansOpphør={stansOpphør}
            kunNyTagger={!harEndret}
          />
        ))}
      </Table.Body>
    </TableStyled>
  );
};
