import { Trekk } from 'components/saksoversikt/trekkoversikt/TrekkOversikt';
import { BodyShort, Label, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend } from 'lib/utils/date';

export const TrekkTabell = ({ trekk }: { trekk: Trekk }) => {
  return (
    <VStack gap={'4'}>
      <BodyShort>Beløp som skal trekkes: {trekk.beløp}</BodyShort>
      <Label>Posteringer</Label>
      <TableStyled size={'medium'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Dato</Table.HeaderCell>
            <Table.HeaderCell align={'right'} textSize={'small'}>
              Beløp
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {trekk.posteringer.map((postering) => (
            <Table.Row key={'postering' + postering.dato} shadeOnHover={false}>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(postering.dato)}</Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {postering.beløp}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};
