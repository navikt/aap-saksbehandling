import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { Institusjonsopphold } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { TableStyled } from 'components/tablestyled/TableStyled';

type Props = {
  label: string;
  beskrivelse: string;
  instutisjonsopphold: Institusjonsopphold[];
};

export const InstitusjonsoppholdTabell = ({ label, beskrivelse, instutisjonsopphold }: Props) => {
  return (
    <VStack gap={'4'}>
      <VStack gap={'1'}>
        <BodyShort weight={'semibold'} size={'small'} as={'p'}>
          {label}
        </BodyShort>
        <BodyShort size={'small'}>{beskrivelse}</BodyShort>
      </VStack>
      <TableStyled title={label}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Institusjonstype
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Oppholdstype
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Status
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Opphold fra
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Avsluttet dato
            </Table.HeaderCell>
            <Table.HeaderCell scope={'col'} textSize={'small'}>
              Kildeinstitusjon
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {instutisjonsopphold.map((opphold, index) => (
            <Table.Row key={index}>
              <Table.DataCell textSize={'small'}>{opphold.institusjonstype}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{opphold.oppholdstype}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{opphold.status}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(opphold.oppholdFra)}</Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {opphold.avsluttetDato && formaterDatoForFrontend(opphold.avsluttetDato)}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{opphold.kildeinstitusjon}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};
