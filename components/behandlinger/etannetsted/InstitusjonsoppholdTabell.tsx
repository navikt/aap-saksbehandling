import { BodyShort, Label, Table } from '@navikt/ds-react';
import { Institusjonsopphold } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

type Props = {
  label: string;
  beskrivelse: string;
  instutisjonsopphold: Institusjonsopphold[];
};

export const InstitusjonsoppholdTabell = ({ label, beskrivelse, instutisjonsopphold }: Props) => {
  return (
    <section>
      <Label as={'p'}>{label}</Label>
      <BodyShort>{beskrivelse}</BodyShort>
      <Table title={label}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope={'col'}>Institusjonstype</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Oppholdstype</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Status</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Opphold fra</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Avsluttet dato</Table.HeaderCell>
            <Table.HeaderCell scope={'col'}>Kildeinstitusjon</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {instutisjonsopphold.map((opphold, index) => (
            <Table.Row key={index}>
              <Table.DataCell>{opphold.institusjonstype}</Table.DataCell>
              <Table.DataCell>{opphold.oppholdstype}</Table.DataCell>
              <Table.DataCell>{opphold.status}</Table.DataCell>
              <Table.DataCell>{formaterDatoForFrontend(opphold.oppholdFra)}</Table.DataCell>
              <Table.DataCell>{opphold.avsluttetDato && formaterDatoForFrontend(opphold.avsluttetDato)}</Table.DataCell>
              <Table.DataCell>{opphold.kildeinstitusjon}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </section>
  );
};
