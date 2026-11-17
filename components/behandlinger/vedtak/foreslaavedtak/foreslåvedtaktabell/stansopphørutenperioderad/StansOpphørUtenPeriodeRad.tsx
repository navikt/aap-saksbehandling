import { HStack, Table } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { NyEndretTag } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/nyendrettag/NyEndretTag';
import {
  mapStansOpphørTilTekst,
  mapStansOpphørÅrsakerTilHjemmel,
  mapStansOpphørÅrsakerTilTekst,
  StansOpphør,
} from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/foreslaaVedtakRadTekster';
import styles from './StansOpphorUtenPeriodeRad.module.css';

interface Props {
  stansOpphør: StansOpphør;
  kunNyTagger: boolean;
}

export const StansOpphørUtenPeriodeRad = ({ stansOpphør, kunNyTagger }: Props) => {
  const vurdering = stansOpphør.historikk.at(0);

  return (
    <Table.Row className={vurdering?.erNy ? styles.stansOpphørNy : styles.stansOpphør}>
      <Table.DataCell>
        <HStack gap={'space-8'} align={'center'}>
          {vurdering?.erNy && <NyEndretTag type="Ny" kunNyTagger={kunNyTagger} />}
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
