import { ActionMenu, Alert, BodyShort, Button, CopyButton, Loader, Table, Tooltip } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import Link from 'next/link';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { mapBehovskodeTilBehovstype, mapTilOppgaveBehandlingstypeTekst } from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { AvklaringsbehovKode, ÅrsakTilBehandling } from 'lib/types/types';
import { PåVentInfoboks } from 'components/oppgaveliste/påventinfoboks/PåVentInfoboks';
import { ScopedSortState } from 'components/oppgaveliste/oppgavetabell/OppgaveTabell';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { useState, useTransition } from 'react';
import { plukkOppgaveClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { byggKelvinURL } from 'lib/utils/request';
import { useRouter } from 'next/navigation';
import { useSortertListe } from 'hooks/oppgave/SorteringHook';

interface Props {
  oppgaver: Oppgave[];
}

export const LedigeOppgaverTabell = ({ oppgaver }: Props) => {
  const [feilmelding, setFeilmelding] = useState<string>();
  const [isPendingBehandle, startTransitionBehandle] = useTransition();

  const router = useRouter();
  const { sort, sortertListe, håndterSortering } = useSortertListe(oppgaver);

  async function plukkOgGåTilOppgave(oppgave: Oppgave) {
    startTransitionBehandle(async () => {
      if (oppgave.id !== undefined && oppgave.id !== null && oppgave.versjon >= 0) {
        const plukketOppgave = await plukkOppgaveClient(oppgave.id, oppgave.versjon);
        if (isSuccess(plukketOppgave)) {
          router.push(byggKelvinURL(plukketOppgave.data));
        } else {
          setFeilmelding(`Feil ved plukking av oppgave: ${plukketOppgave.apiException.message}`);
        }
      }
    });
  }

  return (
    <>
      {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => håndterSortering(sortKey as ScopedSortState['orderBy'])}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader sortKey={'personNavn'} sortable={true} textSize={'small'}>
              Navn
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'personIdent'} sortable={true} textSize={'small'}>
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'saksnummer'} sortable={true}>
              ID
            </Table.ColumnHeader>
            <Table.HeaderCell>Behandlingstype</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'behandlingOpprettet'} sortable={true}>
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'årsak'} sortable={true}>
              Årsak
            </Table.ColumnHeader>
            <Table.HeaderCell>Oppgave</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'opprettetTidspunkt'} sortable={true}>
              Oppg. opprettet
            </Table.ColumnHeader>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortertListe.map((oppgave, i) => (
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
              <Table.DataCell textSize={'small'}>{oppgave.saksnummer || oppgave.journalpostId}</Table.DataCell>
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
                {!isPendingBehandle ? (
                  <ActionMenu>
                    <ActionMenu.Trigger>
                      <Button
                        variant={'tertiary-neutral'}
                        icon={<MenuElipsisVerticalIcon title={'Oppgavemeny'} />}
                        size={'small'}
                      />
                    </ActionMenu.Trigger>
                    <ActionMenu.Content>
                      <ActionMenu.Item onSelect={() => plukkOgGåTilOppgave(oppgave)}>Behandle</ActionMenu.Item>
                    </ActionMenu.Content>
                  </ActionMenu>
                ) : (
                  <Loader />
                )}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </>
  );
};
