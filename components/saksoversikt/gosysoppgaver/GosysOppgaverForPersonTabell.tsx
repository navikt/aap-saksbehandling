'use client';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Box, Button, Table } from '@navikt/ds-react';
import { OppgaveBeskrivelse } from 'components/oppgaveliste/gosysoppgaver/oppgavebeskrivelse/OppgaveBeskrivelse';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { GosysOppgave } from 'lib/types/gosysTypes';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { GosysSortering, mapGjelderTilTekst, mapOppgaveTypeTilTekst, sorterGosysOppgaver } from 'lib/utils/gosys';
import { useState } from 'react';
import styles from './GosysOppgaverForPersonTabell.module.css';

interface Props {
  oppgaver: GosysOppgave[];
  gosysUrl?: string;
}

export const GosysOppgaverForPersonTabell = ({ oppgaver, gosysUrl }: Props) => {
  const [sortering, setSortering] = useState<GosysSortering>();
  const sorterteOppgaver = sorterGosysOppgaver(oppgaver, sortering);

  return (
    <Box
      borderColor="neutral-subtle"
      background="default"
      borderWidth="1"
      borderRadius="12"
      overflow="auto"
      role="region"
      aria-label="Gosys-oppgaver på personen"
      tabIndex={0}
    >
      <TableStyled
        size="small"
        aria-label="Gosys-oppgaver"
        sort={sortering}
        onSortChange={(sortKey) => {
          if (sortKey !== 'opprettetTidspunkt' && sortKey !== 'fristFerdigstillelse') return;

          setSortering((forrige) => {
            if (forrige?.orderBy !== sortKey) {
              return { orderBy: sortKey, direction: 'ascending' };
            }
            if (forrige.direction === 'ascending') {
              return { orderBy: sortKey, direction: 'descending' };
            }
            return undefined;
          });
        }}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader sortKey="opprettetTidspunkt" sortable>
              Opprettet
            </Table.ColumnHeader>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Gjelder</Table.HeaderCell>
            <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
            <Table.ColumnHeader sortKey="fristFerdigstillelse" sortable>
              Frist
            </Table.ColumnHeader>
            <Table.HeaderCell>Enhet</Table.HeaderCell>
            <Table.HeaderCell>Tildelt</Table.HeaderCell>
            <Table.HeaderCell>Handling</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver.length === 0 ? (
            <Table.Row>
              <Table.DataCell colSpan={9}>Ingen Gosys-oppgaver funnet.</Table.DataCell>
            </Table.Row>
          ) : (
            sorterteOppgaver.map((oppgave) => (
              <Table.Row key={oppgave.id}>
                <Table.DataCell textSize="small">
                  {oppgave.opprettetTidspunkt ? formaterDatoForFrontend(oppgave.opprettetTidspunkt) : ''}
                </Table.DataCell>
                <Table.DataCell textSize="small">{mapOppgaveTypeTilTekst(oppgave.oppgavetype)}</Table.DataCell>
                <Table.DataCell textSize="small">{mapGjelderTilTekst(oppgave)}</Table.DataCell>
                <Table.DataCell textSize="small" className={styles.beskrivelseCelle}>
                  {oppgave.beskrivelse && <OppgaveBeskrivelse beskrivelse={oppgave.beskrivelse} />}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {oppgave.fristFerdigstillelse ? formaterDatoForFrontend(oppgave.fristFerdigstillelse) : ''}
                </Table.DataCell>
                <Table.DataCell textSize="small">{oppgave.tildeltEnhetsnr}</Table.DataCell>
                <Table.DataCell textSize="small">{oppgave.tilordnetRessurs ?? 'Ikke tildelt'}</Table.DataCell>
                <Table.DataCell textSize="small">
                  {gosysUrl && (
                    <Button
                      as="a"
                      role="link"
                      href={`${gosysUrl.replace(/\/$/, '')}/oppgavebehandling/oppgave/${oppgave.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                      size="xsmall"
                      className={styles.gosysLenke}
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
    </Box>
  );
};
