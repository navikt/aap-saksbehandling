'use client';

import { AvklaringsbehovKode, Oppgave, ÅrsakTilBehandling } from 'lib/types/types';
import { BodyShort, CopyButton, Table, Tooltip } from '@navikt/ds-react';
import { mapBehovskodeTilBehovstype, mapTilOppgaveBehandlingstypeTekst } from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import Link from 'next/link';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { PåVentInfoboks } from 'components/oppgaveliste/påventinfoboks/PåVentInfoboks';
import { AlleOppgaverActionMenu } from 'components/oppgaveliste/alleoppgaver/alleoppgaveractionmenu/AlleOppgaverActionMenu';

interface Props {
  oppgaver: Oppgave[];
}

export const AlleOppgaverTabell = ({ oppgaver }: Props) => {
  return (
    <TableStyled size={'small'} zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Navn</Table.ColumnHeader>
          <Table.ColumnHeader>Fnr</Table.ColumnHeader>
          <Table.HeaderCell>Behandlingstype</Table.HeaderCell>
          <Table.ColumnHeader>Beh. opprettet</Table.ColumnHeader>
          <Table.ColumnHeader>Årsak</Table.ColumnHeader>
          <Table.HeaderCell>Oppgave</Table.HeaderCell>
          <Table.ColumnHeader>Oppg. opprettet</Table.ColumnHeader>
          <Table.ColumnHeader>Saksbehandler</Table.ColumnHeader>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {oppgaver.map((oppgave, i) => (
          <Table.Row key={`oppgave-${i}`}>
            <Table.DataCell textSize={'small'}>
              {oppgave.saksnummer ? (
                <Link href={`/saksbehandling/sak/${oppgave.saksnummer}`}>
                  {storForbokstavIHvertOrd(oppgave.personNavn)}
                </Link>
              ) : (
                <span>{storForbokstavIHvertOrd(oppgave.personNavn)}</span>
              )}
            </Table.DataCell>
            <Table.DataCell textSize={'small'}>
              {oppgave.personIdent ? (
                <CopyButton
                  copyText={oppgave?.personIdent}
                  size="xsmall"
                  text={oppgave?.personIdent}
                  iconPosition="right"
                />
              ) : (
                'Ukjent'
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
              {oppgave.påVentTil && <PåVentInfoboks frist={oppgave.påVentTil} årsak={oppgave.påVentÅrsak} />}
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
