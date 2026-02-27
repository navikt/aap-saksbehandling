import { ForeløpigBehandlingsutfall } from 'lib/types/types';
import { HStack, Table } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { CheckmarkCircleIcon, QuestionmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from 'components/behandlinger/vedtak/foreslåvedtak/foreslåvedtaktabell/ForeslåVedtakTabell.module.css';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapRettighetsTypeTilTekst } from 'lib/utils/rettighetstype';

export const ForeløpigBehandlingsutfallOppsummering = ({
  foreløpigBehandlingsutfall,
}: {
  foreløpigBehandlingsutfall: ForeløpigBehandlingsutfall;
}) => {
  return (
    <TableStyled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Foreløpig resultat</Table.HeaderCell>
          <Table.HeaderCell>Periode</Table.HeaderCell>
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
                    segment.rettighetstype ? (
                      <CheckmarkCircleIcon className={styles.godkjentIcon} />
                    ) : (
                      <QuestionmarkCircleIcon className={styles.iconSubtle} />
                    )
                  ) : (
                    <XMarkOctagonIcon className={styles.avslåttIcon} />
                  )}
                  {mapTidligereVurderingTilTekst(segment)}
                </HStack>
              </Table.DataCell>
              <Table.DataCell>
                {formaterDatoForFrontend(segment.periode.fom)} - {formaterDatoForFrontend(segment.periode.tom)}
              </Table.DataCell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </TableStyled>
  );
};

function mapTidligereVurderingTilTekst(tidligereVurdering: ForeløpigBehandlingsutfall['tidligereVurderinger'][0]) {
  switch (tidligereVurdering.utfall) {
    case 'POTENSIELT_OPPFYLT':
      if (tidligereVurdering.rettighetstype) {
        return `Oppfyller ${mapRettighetsTypeTilTekst(tidligereVurdering.rettighetstype)}`;
      } else {
        return 'Bruker blir vurdert for AAP etter § 11-13'; // Eneste mulige rettighetstype dersom ingen er satt til nå
      }
    case 'IKKE_BEHANDLINGSGRUNNLAG':
      return 'Ikke behandlingsgrunnlag';
    case 'UUNNGÅELIG_AVSLAG':
      return 'Ingen rettighet';
  }
}
