'use client';

import { Button, Heading, Table, VStack } from '@navikt/ds-react';
import { StønadsperiodeGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { KravTag } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodetabell/KravTag';

interface Props {
  grunnlag: StønadsperiodeGrunnlag;
  readOnly: boolean;
  valgteKrav: string[];
  onToggleValgtKrav: (referanse: string) => void;
}

export const StønadsperiodeTabell = ({ grunnlag, valgteKrav, onToggleValgtKrav }: Props) => {
  const rader = [
    ...grunnlag.vedtatteVurderinger.map((vedtatt) => ({ status: 'Vedtatt', ...vedtatt })),
    ...grunnlag.nyeVurderinger.map((ny) => ({ status: 'Ny', ...ny })),
  ];

  return (
    <VStack gap={'space-16'}>
      <Heading size={'xsmall'}>Brukerens krav om AAP</Heading>
      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Relevant krav</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Vurderes fra</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
            <Table.HeaderCell>Valg</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rader.map((rad, index) => (
            <Table.Row key={index}>
              <Table.DataCell>{rad.referanse}</Table.DataCell>
              <Table.DataCell>
                <KravTag type={rad.relevantKravType.type} />
              </Table.DataCell>
              <Table.DataCell>{formaterDatoForFrontend(rad.startDato)}</Table.DataCell>
              <Table.DataCell>{`${rad.vurdertAv} (${formaterDatoForFrontend(rad.opprettet)})`}</Table.DataCell>
              <Table.DataCell>
                <Button
                  type="button"
                  size="small"
                  variant={valgteKrav.includes(rad.referanse) ? 'primary' : 'secondary'}
                  onClick={() => onToggleValgtKrav(rad.referanse)}
                >
                  {valgteKrav.includes(rad.referanse) ? 'Avbryt' : 'Endre'}
                </Button>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};
