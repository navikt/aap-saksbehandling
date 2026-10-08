'use client';

import { Button, Table } from '@navikt/ds-react';
import { StønadsperiodeGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { KravTag } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodetabell/KravTag';

export const StønadsperiodeTabell = ({ grunnlag }: { grunnlag: StønadsperiodeGrunnlag }) => {
  const rader = [
    ...grunnlag.vedtatteVurderinger.map((vedtatt) => ({ status: 'Vedtatt', ...vedtatt })),
    ...grunnlag.nyeVurderinger.map((ny) => ({ status: 'Ny', ...ny })),
  ];

  return (
    <>
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
                <Button size={'small'} variant={'secondary'}>
                  Endre
                </Button>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </>
  );
};
