import { ForeløpigBehandlingsutfall } from 'lib/types/types';
import { HStack, Table } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from 'components/behandlinger/vedtak/foreslåvedtak/foreslåvedtaktabell/ForeslåVedtakTabell.module.css';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapRettighetsTypeTilTekst } from 'lib/utils/rettighetstype';

export const ForeløpigBehandlingsutfallOppsummering = ({
  foreløpigBehandlingsutfall,
}: {
  foreløpigBehandlingsutfall: ForeløpigBehandlingsutfall;
}) => {
  function mapUtfallTilTekst(utfall: ForeløpigBehandlingsutfall['tidligereVurderinger'][0]['utfall']) {
    switch (utfall) {
      case 'POTENSIELT_OPPFYLT':
        return 'AAP innvilget (foreløpig resultat)';
      case 'IKKE_BEHANDLINGSGRUNNLAG':
        return 'Ikke behandlingsgrunnlag';
      case 'UUNGÅELIG_AVSLAG':
        return 'Ikke rett på AAP';
    }
  }

  return (
    <TableStyled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Foreløpig resultat</Table.HeaderCell>
          <Table.HeaderCell>Periode</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {foreløpigBehandlingsutfall.tidligereVurderinger.length === 0 ? (
          <Table.Row>
            <Table.DataCell>
              <HStack gap={'2'} align={'center'}>
                <XMarkOctagonIcon className={styles.avslåttIcon} />
                Ingen tidligere vurderinger
              </HStack>
            </Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
          </Table.Row>
        ) : (
          foreløpigBehandlingsutfall.tidligereVurderinger.map((segment) => (
            <Table.Row key={`${segment.periode.fom}`}>
              <Table.DataCell>
                <HStack gap={'2'} align={'center'}>
                  {segment.utfall == 'POTENSIELT_OPPFYLT' ? (
                    <CheckmarkCircleIcon className={styles.godkjentIcon} />
                  ) : (
                    <XMarkOctagonIcon className={styles.avslåttIcon} />
                  )}
                  {mapUtfallTilTekst(segment.utfall)}
                </HStack>
              </Table.DataCell>
              <Table.DataCell>
                {formaterDatoForFrontend(segment.periode.fom)} - {formaterDatoForFrontend(segment.periode.tom)}
              </Table.DataCell>
              <Table.DataCell>{mapRettighetsTypeTilTekst(segment.rettighetstype)}</Table.DataCell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </TableStyled>
  );
};
