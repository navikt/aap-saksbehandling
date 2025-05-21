'use client';

import { AvklaringsbehovKode, Oppgave, ÅrsakTilBehandling } from 'lib/types/types';
import { BodyShort, Table, Tooltip } from '@navikt/ds-react';
import { mapBehovskodeTilBehovstype, mapTilOppgaveBehandlingstypeTekst } from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import Link from 'next/link';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { AlleOppgaverActionMenu } from 'components/oppgaveliste/alleoppgaver/alleoppgaveractionmenu/AlleOppgaverActionMenu';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';

interface Props {
  oppgaver: Oppgave[];
}

export const AlleOppgaverTabell = ({ oppgaver }: Props) => {
  const { sort, sortertListe, håndterSortering } = useSortertListe(oppgaver);

  return (
    <TableStyled
      size={'small'}
      zebraStripes
      sort={sort}
      onSortChange={(sortKey) => håndterSortering(sortKey as ScopedSortState<Oppgave>['orderBy'])}
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Behandlingstype</Table.HeaderCell>
          <Table.ColumnHeader sortKey={'behandlingOpprettet'} sortable={true}>
            Beh. opprettet
          </Table.ColumnHeader>
          <Table.HeaderCell>Årsak</Table.HeaderCell>
          <Table.HeaderCell>Oppgave</Table.HeaderCell>
          <Table.ColumnHeader sortKey={'opprettetTidspunkt'} sortable={true}>
            Oppg. opprettet
          </Table.ColumnHeader>
          <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortertListe.map((oppgave, i) => (
          <Table.Row key={`oppgave-${i}`}>
            <Table.DataCell textSize={'small'}>
              {oppgave.saksnummer ? (
                <Link href={`/saksbehandling/sak/${oppgave.saksnummer}`}>{oppgave.saksnummer}</Link>
              ) : (
                <span>{oppgave.journalpostId}</span>
              )}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
              {mapTilOppgaveBehandlingstypeTekst(oppgave.behandlingstype)}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.behandlingOpprettet)}</Table.DataCell>
            <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
              <Tooltip
                content={oppgave.årsakerTilBehandling
                  .map((årsak) => formaterÅrsak(årsak as ÅrsakTilBehandling))
                  .join(', ')}
              >
                <BodyShort truncate size={'small'}>
                  {oppgave.årsakerTilBehandling.map((årsak) => formaterÅrsak(årsak as ÅrsakTilBehandling)).join(', ')}
                </BodyShort>
              </Tooltip>
            </Table.DataCell>
            <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
              <Tooltip content={mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode as AvklaringsbehovKode)}>
                <BodyShort truncate size={'small'}>
                  {mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode as AvklaringsbehovKode)}
                </BodyShort>
              </Tooltip>
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.opprettetTidspunkt)}</Table.DataCell>
            <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
              <Tooltip content={oppgave.reservertAv || 'Ledig'}>
                <BodyShort truncate size={'small'}>
                  {oppgave.reservertAv || 'Ledig'}
                </BodyShort>
              </Tooltip>
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
              <OppgaveInformasjon oppgave={oppgave} />
            </Table.DataCell>
            <Table.DataCell textSize={'small'} align={'right'}>
              <AlleOppgaverActionMenu oppgave={oppgave} />
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </TableStyled>
  );
};
