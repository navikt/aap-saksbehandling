'use client';

import { BodyShort, Heading, HStack, Label, Table, VStack } from '@navikt/ds-react';
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
            <Table.HeaderCell scope="col"></Table.HeaderCell>
            <Table.HeaderCell scope="col">Id</Table.HeaderCell>
            <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kjøretidspunkt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Antall feilende forsøk</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {planlagteJobber.map((jobb) => {
            return (
              <Table.ExpandableRow
                key={jobb.id}
                content={
                  <HStack>
                    <VStack gap={'4'}>
                      <div>
                        <Label>Beskrivelse</Label>
                        <BodyShort>{jobb.beskrivelse}</BodyShort>
                      </div>
                      {jobb.feilmelding && (
                        <div>
                          <Label>Feilmelding</Label>
                          <BodyShort>{jobb.feilmelding}</BodyShort>
                        </div>
                      )}
                    </VStack>
                    <VStack gap={'4'}>
                      {[...objectToMap(jobb.metadata)].map(([key, value]) => {
                        return (
                          <div key={key}>
                            <Label>{key}</Label>
                            <BodyShort>{value}</BodyShort>
                          </div>
                        );
                      })}
                    </VStack>
                  </HStack>
                }
              >
                <Table.DataCell>{jobb.id}</Table.DataCell>
                <Table.DataCell>{jobb.navn}</Table.DataCell>
                <Table.DataCell>{jobb.status}</Table.DataCell>
                <Table.DataCell>{formaterDatoMedTidspunktForFrontend(jobb.planlagtKjøretidspunkt)}</Table.DataCell>
                <Table.DataCell>{jobb.antallFeilendeForsøk}</Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export function objectToMap(value: Object): Map<string, string> {
  return new Map(Object.entries(value));
}
