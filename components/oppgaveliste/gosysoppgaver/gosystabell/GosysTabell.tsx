'use client';

import { Box, Button, Table } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterDatoForFrontend, sorterEtterEldsteDato, sorterEtterNyesteDato } from 'lib/utils/date';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { GosysOppgave } from 'lib/types/gosysTypes';
import { useState } from 'react';
import styles from './GosysTabell.module.css';
import { OppgaveBeskrivelse } from 'components/oppgaveliste/gosysoppgaver/oppgavebeskrivelse/OppgaveBeskrivelse';

type Sorteringsfelt = 'opprettetTidspunkt' | 'fristFerdigstillelse';

interface Props {
  oppgaver: GosysOppgave[];
  gosysUrl?: string;
}

export const GosysTabell = ({ oppgaver, gosysUrl }: Props) => {
  const [sortering, setSortering] = useState<{
    orderBy: Sorteringsfelt;
    direction: 'ascending' | 'descending';
  }>();

  const sorterteOppgaver = sortering
    ? [...oppgaver].sort((a, b) => {
        const datoA = a[sortering.orderBy];
        const datoB = b[sortering.orderBy];

        if (!datoA) return datoB ? 1 : 0;
        if (!datoB) return -1;

        return sortering.direction === 'ascending'
          ? sorterEtterEldsteDato(datoA, datoB)
          : sorterEtterNyesteDato(datoA, datoB);
      })
    : oppgaver;

  return (
    <Box borderColor="neutral-subtle" background={'default'} borderWidth="1" borderRadius={'12'}>
      <TableStyled
        size="small"
        zebraStripes
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
            <Table.HeaderCell>Oppgavetype</Table.HeaderCell>
            <Table.ColumnHeader sortKey="opprettetTidspunkt" sortable>
              Opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey="fristFerdigstillelse" sortable>
              Frist
            </Table.ColumnHeader>
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
            sorterteOppgaver.map((oppgave) => (
              <Table.Row key={oppgave.id}>
                <Table.DataCell textSize={'small'}>{mapOppgaveTypeTilTekst(oppgave.oppgavetype)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {oppgave.opprettetTidspunkt ? formaterDatoForFrontend(oppgave.opprettetTidspunkt) : ''}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {oppgave.fristFerdigstillelse ? formaterDatoForFrontend(oppgave.fristFerdigstillelse) : ''}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>{oppgave.tilordnetRessurs ?? 'Ikke tildelt'}</Table.DataCell>
                <Table.DataCell textSize={'small'} className={styles.beskrivelseCelle}>
                  {oppgave.beskrivelse && <OppgaveBeskrivelse beskrivelse={oppgave.beskrivelse} />}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {gosysUrl && (
                    <Button
                      as="a"
                      role="link"
                      href={`${gosysUrl.replace(/\/$/, '')}/oppgavebehandling/oppgave/${oppgave.id}`}
                      target="_blank"
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

function mapOppgaveTypeTilTekst(oppgavetype: string): string {
  switch (oppgavetype) {
    case 'KONT_BRUK':
      return 'Kontakt bruker';
    case 'VUR_KONS_YTE':
      return 'Vurder konsekvens for ytelse';
    case 'INNH_DOK':
      return 'Innhent dokumentasjon';
    case 'JFR':
      return 'Journalføring';
    case 'VURD_HENV':
      return 'Vurder henvendelse';
    case 'BEH_SED':
      return 'Behandle SED';
    case 'RETUR':
      return 'Behandle returpost';
    case 'SVAR_IK_MOT':
      return 'Svar ikke mottatt';
    case 'VURD_NOTAT':
      return 'Vurder notat';
    case 'VUR_SVAR':
      return 'Vurder svar';
    default:
      return oppgavetype;
  }
}
