import { Avslag11_27Krav } from 'lib/types/types';
import { BodyShort, Button, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  label: string;
  avslag11_27krav: Avslag11_27Krav[];
}

export const Avslag11_27KravTabell = ({ label, avslag11_27krav }: Props) => {
  return (
    <VStack gap={'space-16'}>
      <VStack gap={'space-4'}>
        <BodyShort weight={'semibold'} size={'small'} as={'p'}>
          {label}
        </BodyShort>
      </VStack>
      <TableStyled title={label}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Søknadsdokument
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Type
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Søknadsdato
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Mulig rettighet fra
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Velg
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {avslag11_27krav.map((krav, index) => (
            <Table.Row key={index}>
              <Table.DataCell textSize={'small'}>{krav.søknadsdokument}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{krav.type}</Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {krav.søknadsdato ? formaterDatoForFrontend(krav.søknadsdato) : '-'}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {krav.muligRettighetFra ? formaterDatoForFrontend(krav.muligRettighetFra) : '-'}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                <Button size={'small'} variant={'secondary'}>
                  Vurder
                </Button>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};
