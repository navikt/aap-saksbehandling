'use client';

import { AvklaringsbehovKode, Oppgave, ÅrsakTilBehandling } from 'lib/types/types';
import { BodyShort, Table, Tooltip } from '@navikt/ds-react';
import { mapBehovskodeTilBehovstype, mapTilOppgaveBehandlingstypeTekst } from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import Link from 'next/link';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { PåVentInfoboks } from 'components/oppgaveliste/påventinfoboks/PåVentInfoboks';
import { AlleOppgaverActionMenu } from 'components/oppgaveliste/alleoppgaver/alleoppgaveractionmenu/AlleOppgaverActionMenu';
import { useState } from 'react';
import { ScopedSortState } from 'components/oppgaveliste/oppgavetabell/OppgaveTabell';

interface Props {
  oppgaver: Oppgave[];
}

export const AlleOppgaverTabell = ({ oppgaver }: Props) => {
  const [sort, setSort] = useState<ScopedSortState | undefined>();

  const sorterteOppgaver = (oppgaver || []).slice().sort((a, b) => {
    if (sort) {
      return sort.direction === 'ascending' ? comparator(b, a, sort.orderBy) : comparator(a, b, sort.orderBy);
    }
    return 1;
  });

  function comparator<T>(a: T, b: T, orderBy: keyof T): number {
    if (b[orderBy] == null || b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const handleSort = (sortKey: ScopedSortState['orderBy']) => {
    setSort(
      sort && sortKey === sort.orderBy && sort.direction === 'descending'
        ? undefined
        : {
            orderBy: sortKey,
            direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
          }
    );
  };

  return (
    <TableStyled
      size={'small'}
      zebraStripes
      onSortChange={(sortKey) => handleSort(sortKey as ScopedSortState['orderBy'])}
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
        {sorterteOppgaver.map((oppgave, i) => (
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
            <Table.DataCell textSize={'small'}>{oppgave.reservertAv || 'Ledig'}</Table.DataCell>
            <Table.DataCell textSize={'small'}>
              {oppgave.påVentTil && (
                <PåVentInfoboks
                  frist={oppgave.påVentTil}
                  årsak={oppgave.påVentÅrsak}
                  begrunnelse={oppgave.venteBegrunnelse}
                />
              )}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
              <AlleOppgaverActionMenu oppgave={oppgave} />
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </TableStyled>
  );
};
