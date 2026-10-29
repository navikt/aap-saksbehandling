'use client';

import { useState } from 'react';
import { Button, Select, Table, VStack } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { Spinner } from 'components/felles/Spinner';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { Enhet } from 'lib/types/oppgaveTypes';
import { useGosysOppgaver } from 'hooks/oppgave/GosysOppgaverHook';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  enheter: Enhet[];
  gosysUrl?: string;
}

export const GosysOppgaver = ({ enheter, gosysUrl }: Props) => {
  const [aktivEnhet, setAktivEnhet] = useState(enheter[0]?.enhetNr ?? '');
  const { oppgaver, antallTreff, kanLasteFlere, isLoading, isValidating, error, harLastetOppgaver, lastInnFlere } =
    useGosysOppgaver(aktivEnhet);

  console.log(oppgaver);

  return (
    <VStack gap="space-16">
      <Select
        label="Velg enhet"
        className={'fit-content'}
        size="small"
        value={aktivEnhet}
        onChange={(event) => {
          setAktivEnhet(event.target.value);
        }}
      >
        {enheter.map((enhet) => (
          <option key={enhet.enhetNr} value={enhet.enhetNr}>
            {enhet.navn}
          </option>
        ))}
      </Select>
      {isLoading ? (
        <Spinner label="Henter Gosys-oppgaver" />
      ) : error && !harLastetOppgaver ? (
        <Alert variant="error">Kunne ikke hente Gosys-oppgaver.</Alert>
      ) : (
        <>
          <div>
            Viser {oppgaver.length}
            {antallTreff !== undefined && ` av ${antallTreff}`} Gosys-oppgaver.
          </div>
          <TableStyled size="small" zebraStripes aria-label="Gosys-oppgaver">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Oppgavetype</Table.HeaderCell>
                <Table.HeaderCell>Opprettet</Table.HeaderCell>
                <Table.HeaderCell>Frist</Table.HeaderCell>
                <Table.HeaderCell>Tildelt</Table.HeaderCell>
                <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
                <Table.HeaderCell>Handling</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {oppgaver.length === 0 ? (
                <Table.Row>
                  <Table.DataCell colSpan={6}>Ingen Gosys-oppgaver funnet.</Table.DataCell>
                </Table.Row>
              ) : (
                oppgaver.map((oppgave) => (
                  <Table.Row key={oppgave.id}>
                    <Table.DataCell>{oppgave.oppgavetype}</Table.DataCell>
                    <Table.DataCell>
                      {oppgave.opprettetTidspunkt ? formaterDatoForFrontend(oppgave.opprettetTidspunkt) : ''}
                    </Table.DataCell>
                    <Table.DataCell>
                      {oppgave.fristFerdigstillelse ? formaterDatoForFrontend(oppgave.fristFerdigstillelse) : ''}
                    </Table.DataCell>
                    <Table.DataCell>{oppgave.tilordnetRessurs ?? 'Ikke tildelt'}</Table.DataCell>
                    <Table.DataCell>{oppgave.beskrivelse}</Table.DataCell>
                    <Table.DataCell>
                      {gosysUrl && (
                        <Button
                          as="a"
                          role="link"
                          href={`${gosysUrl.replace(/\/$/, '')}/oppgavebehandling/oppgave/${oppgave.id}`}
                          target="_blank"
                          variant="secondary"
                          size="small"
                          icon={<ExternalLinkIcon aria-hidden />}
                        >
                          Åpne i Gosys
                        </Button>
                      )}
                    </Table.DataCell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </TableStyled>
          {error && <Alert variant="error">Kunne ikke hente flere Gosys-oppgaver. Prøv igjen.</Alert>}
          {kanLasteFlere && (
            <Button
              variant="secondary"
              size="small"
              loading={isValidating}
              disabled={isValidating}
              onClick={() => lastInnFlere()}
              className={'fit-content'}
            >
              Last inn flere oppgaver
            </Button>
          )}
        </>
      )}
    </VStack>
  );
};
