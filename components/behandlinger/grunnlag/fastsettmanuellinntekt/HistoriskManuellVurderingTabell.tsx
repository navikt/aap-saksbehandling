import { ManuellInntektÅr } from '../../../../lib/types/types';
import { Label, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from '../../../tablestyled/TableStyled';
import { formaterTilNok } from '../../../../lib/utils/string';
import React from 'react';

interface Props {
  historiskeManuelleVurderinger: ManuellInntektÅr[];
}

export function HistoriskManuellVurderingTabell({ historiskeManuelleVurderinger }: Props) {
  //'{formaterTilNok(årsVurdering.ferdigLignetPGI) : '-'}'
  console.log(historiskeManuelleVurderinger)
  return (
    <VStack gap={'2'}>
      <Label size={'small'}>Hvilke år skal inntekt overstyres?</Label>
      <TableStyled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>År</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Ferdig lignet PGI</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Beregnet PGI</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>EØS inntekt</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Totalt</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body data-testid={'historiskinntektstabell'}>
          {historiskeManuelleVurderinger?.map((årsVurdering) => {
            return (
              <Table.Row key={årsVurdering.år}>
                <Table.DataCell textSize={'small'}>{årsVurdering.år}</Table.DataCell>
                <Table.DataCell textSize={'small'} data-testid={'ferdigLignetPGI'}>
                </Table.DataCell>
                <Table.DataCell textSize={'small'} data-testid={'beregnetPGI'}>
                  {årsVurdering.beløp}
                </Table.DataCell>
                <Table.DataCell textSize={'small'} data-testid={'eøsInntekt'}>
                  {årsVurdering.eøsBeløp}
                </Table.DataCell>
                <Table.DataCell data-testid={'totalt'} textSize={'small'}>
                  {(årsVurdering.beløp ?? 0) + (årsVurdering.eøsBeløp ?? 0)}
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
}