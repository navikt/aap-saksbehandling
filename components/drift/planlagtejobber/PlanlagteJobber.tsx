'use client';

import { Heading, Table } from '@navikt/ds-react';
import { JobbInfo } from 'lib/types/types';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';

interface Props {
  planlagteJobber: JobbInfo[];
}
export const PlanlagteJobber = ({ planlagteJobber }: Props) => {
  return (
    <div>
      <Heading size={'small'} level={'2'}>
        Planlagte jobber
      </Heading>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Id</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kjøretidspunkt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Antall feilende forsøk</Table.HeaderCell>
            <Table.HeaderCell scope="col">Feilmelding</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {planlagteJobber.map((jobb) => {
            return (
              <Table.Row key={jobb.id}>
                <Table.DataCell>{jobb.id}</Table.DataCell>
                <Table.DataCell>{jobb.type}</Table.DataCell>
                <Table.DataCell>{jobb.status}</Table.DataCell>
                <Table.DataCell>{formaterDatoMedTidspunktForFrontend(jobb.planlagtKjøretidspunkt)}</Table.DataCell>
                <Table.DataCell>{jobb.antallFeilendeForsøk}</Table.DataCell>
                <Table.DataCell>{jobb.feilmelding}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
