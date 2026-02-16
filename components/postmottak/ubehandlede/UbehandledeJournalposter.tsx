'use client';

import { Alert, Button, Heading, Page, Table } from '@navikt/ds-react';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

export const UbehandledeJournalposter = ({ journalposter }: { journalposter: any[] }) => {
  return (
    <Page>
      <Page.Block width="md">
        <Heading size="large" spacing>
          Uavstemte journalposter
        </Heading>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Journalpost ID</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Kanal</Table.HeaderCell>
              <Table.HeaderCell>Dato</Table.HeaderCell>
              <Table.HeaderCell align="right">Handlinger</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {journalposter.map((jp) => (
              <Table.Row key={`${jp.journalpostId}`}>
                <Table.DataCell>{jp.journalpostId}</Table.DataCell>
                <Table.DataCell>{jp.journalStatus}</Table.DataCell>
                <Table.DataCell>{jp.mottaksKanal}</Table.DataCell>
                <Table.DataCell>
                  {jp.datoOpprettet ? formaterDatoMedTidspunktForFrontend(jp.datoOpprettet) : 'Ukjent dato'}
                </Table.DataCell>
                <Table.DataCell align="right">
                  {jp.behandlingReferanse ? (
                    <Button
                      as="a"
                      target="_blank"
                      href={`/postmottak/${jp.behandlingReferanse}`}
                      size="small"
                      iconPosition="right"
                      icon={<ExternalLinkIcon />}
                    >
                      Vis oppgave
                    </Button>
                  ) : (
                    <Alert variant="warning" size="small">
                      Ingen behandling
                    </Alert>
                  )}
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Page.Block>
    </Page>
  );
};
