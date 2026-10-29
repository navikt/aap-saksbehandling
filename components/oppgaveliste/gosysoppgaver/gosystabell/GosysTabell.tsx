import { Button, Table } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { GosysOppgave } from 'lib/types/gosysTypes';

interface Props {
  oppgaver: GosysOppgave[];
  gosysUrl?: string;
}

export const GosysTabell = ({ oppgaver, gosysUrl }: Props) => {
  return (
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
  );
};
