'use client';

import { Button } from '@navikt/ds-react/Button';
import { Page } from '@navikt/ds-react/Page';
import { Table } from '@navikt/ds-react/Table';
import { Heading } from '@navikt/ds-react/Typography';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { UbehandletJournalpost } from 'lib/types/postmottakTypes';
import { Alert } from 'components/alert/Alert';

export const UbehandledeJournalposter = ({ journalposter }: { journalposter: UbehandletJournalpost[] }) => {
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
              <Table.HeaderCell>Kanal</Table.HeaderCell>
              <Table.HeaderCell>Dato</Table.HeaderCell>
              <Table.HeaderCell align="right">Handlinger</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {journalposter.map((jp) => (
              <Table.Row key={`${jp.journalpostId}`}>
                <Table.DataCell>{jp.journalpostId}</Table.DataCell>
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
                    <Alert variant="warning">Ingen behandling</Alert>
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
