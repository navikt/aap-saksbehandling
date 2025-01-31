'use client';

import { HStack, Table } from '@navikt/ds-react';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { ReactNode } from 'react';
interface Props {
  vurdering: AutomatiskLovvalgOgMedlemskapVurdering['tilhørighetVurdering'];
  resultatIkonTrue: ReactNode;
  resultatIkonFalse: ReactNode;
}
export const TilhørigetsVurderingTabell = ({ vurdering, resultatIkonTrue, resultatIkonFalse }: Props) => {
  return (
    <Table>
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
              <Table.DataCell>{opplysning.kilde.join(', ')}</Table.DataCell>
              <Table.DataCell>{opplysning.opplysning}</Table.DataCell>
              <Table.DataCell>
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
    </Table>
  );
};
