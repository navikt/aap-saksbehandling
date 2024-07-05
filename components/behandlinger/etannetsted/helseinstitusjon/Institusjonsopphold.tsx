import { BodyShort, Label, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

// mock-type
type InstitusjonsoppholdTypeMock = {
  institusjonstype: string;
  oppholdstype: string;
  status: string;
  oppholdFra: string;
  avsluttetDato?: string;
  kildeinstitusjon: string;
};

const mockData: InstitusjonsoppholdTypeMock[] = [
  {
    institusjonstype: 'Helseinstitusjon',
    oppholdstype: 'Heldøgnspasient',
    status: 'Aktivt',
    oppholdFra: new Date().toUTCString(),
    kildeinstitusjon: 'Godthaab',
  },
];

export const Institusjonsopphold = () => {
  return (
    <section>
      <Label as={'p'}>Søker har følgende institusjonsopphold på helseinstitusjon</Label>
      <BodyShort>Opphold over tre måneder på helseinstitusjon kan gi redusert AAP ytelse</BodyShort>
      <Table title={'Søker har følgende institusjonsopphold på helseinstitusjon'}>
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
          {mockData.map((opphold, index) => (
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
