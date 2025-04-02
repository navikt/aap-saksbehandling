'use client';

import { HStack, Table } from '@navikt/ds-react';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { ReactNode } from 'react';
import { TableStyled } from 'components/saksbehandling/tablestyled/TableStyled';
interface Props {
  vurdering: AutomatiskLovvalgOgMedlemskapVurdering['tilhørighetVurdering'];
  resultatIkonTrue: ReactNode;
  resultatIkonFalse: ReactNode;
}
export const TilhørigetsVurderingTabell = ({ vurdering, resultatIkonTrue, resultatIkonFalse }: Props) => {
  return (
    <TableStyled size={'small'}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
          <Table.HeaderCell scope="col">Opplysning</Table.HeaderCell>
          <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {vurdering.map((opplysning, index) => {
          return (
            <Table.ExpandableRow key={`${opplysning.kilde.join('-')}-${index}`} content={opplysning.fordypelse}>
              <Table.DataCell textSize={'small'}>{opplysning.kilde.join(', ')}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{opplysning.opplysning}</Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {opplysning.resultat ? (
                  <HStack gap={'2'} align={'center'}>
                    {resultatIkonTrue}
                    Ja
                  </HStack>
                ) : (
                  <HStack gap={'2'} align={'center'}>
                    {resultatIkonFalse}
                    Nei
                  </HStack>
                )}
              </Table.DataCell>
            </Table.ExpandableRow>
          );
        })}
      </Table.Body>
    </TableStyled>
  );
};
