import { AvklaringsbehovKode, Oppgave, Vurderingsbehov, ÅrsakTilOpprettelse } from 'lib/types/types';
import { BodyShort, Box, Button, Checkbox, Detail, HStack, Table, Tooltip, VStack } from '@navikt/ds-react';
import {
  mapBehovskodeTilBehovstype,
  mapTilOppgaveBehandlingstypeTekst,
  mapTilÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import Link from 'next/link';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { AlleOppgaverActionMenu } from 'components/oppgaveliste/alleoppgaver/alleoppgaveractionmenu/AlleOppgaverActionMenu';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import { useState, useTransition } from 'react';
import { avreserverOppgaveClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';

interface Props {
  oppgaver: Oppgave[];
  revalidateFunction: () => Promise<unknown>;
}

export const AlleOppgaverTabell = ({ oppgaver, revalidateFunction }: Props) => {
  const { sort, sortertListe, håndterSortering } = useSortertListe(oppgaver);
  const [valgteRader, setValgteRader] = useState<number[]>([]);
  const [isPendingFrigi, startTransitionFrigi] = useTransition();

  const toggleValgtRad = (oppgaveId: number) => {
    if (oppgaveId) {
      setValgteRader((prevValgteRader) => {
        if (prevValgteRader.includes(oppgaveId)) {
          return prevValgteRader.filter((id) => id !== oppgaveId);
        }
        return [...prevValgteRader, oppgaveId];
      });
    }
  };

  const frigiValgteOppgaver = async (oppgaver: number[]) => {
    startTransitionFrigi(async () => {
      const res = await avreserverOppgaveClient(oppgaver);
      if (isSuccess(res)) {
        await revalidateFunction();
        setValgteRader([]);
      }
    });
  };

  return (
    <>
      <VStack>
        <Box>
          <HStack justify={valgteRader.length > 0 ? 'space-between' : 'end'} align={'baseline'}>
            <HStack
              gap={'4'}
              align={'baseline'}
              style={{ visibility: valgteRader.length === 0 ? 'hidden' : 'visible' }}
            >
              <Detail>{valgteRader.length} oppgaver valgt.</Detail>
              <Button
                onClick={() => frigiValgteOppgaver(valgteRader)}
                loading={isPendingFrigi}
                type={'button'}
                size={'small'}
                variant={'secondary'}
              >
                Frigi valgte oppgaver
              </Button>
            </HStack>
            <Detail>Totalt {oppgaver.length} oppgaver.</Detail>
          </HStack>
        </Box>
      </VStack>
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => håndterSortering(sortKey as ScopedSortState<Oppgave>['orderBy'])}
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'behandlingstype'} sortable={true}>
              Behandlingstype
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'behandlingOpprettet'} sortable={true}>
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.HeaderCell>Årsak</Table.HeaderCell>
            <Table.HeaderCell>Vurderingsbehov</Table.HeaderCell>
            <Table.HeaderCell>Oppgave</Table.HeaderCell>
            <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'årsak'} sortable={true}>
              Vurderingsbehov
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'avklaringsbehovKode'} sortable={true}>
              Oppgave
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'reservertAv'} sortable={true}>
              Saksbehandler
            </Table.ColumnHeader>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortertListe.map((oppgave, i) => (
            <Table.Row key={`oppgave-${i}`} selected={oppgave.id ? valgteRader.includes(oppgave.id) : false}>
              <Table.DataCell>
                <Checkbox
                  hideLabel
                  checked={oppgave.id ? valgteRader.includes(oppgave.id) : false}
                  onChange={() => oppgave.id && toggleValgtRad(oppgave.id)}
                >
                  {' '}
                </Checkbox>
              </Table.DataCell>
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
              <Table.DataCell textSize={'small'}>
                {oppgave.årsakTilOpprettelse != null
                  ? mapTilÅrsakTilOpprettelseTilTekst(oppgave.årsakTilOpprettelse as ÅrsakTilOpprettelse)
                  : ''}
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip
                  content={oppgave.årsakerTilBehandling
                    .map((årsak) => formaterVurderingsbehov(årsak as Vurderingsbehov))
                    .join(', ')}
                >
                  <BodyShort truncate size={'small'}>
                    {oppgave.årsakerTilBehandling
                      .map((årsak) => formaterVurderingsbehov(årsak as Vurderingsbehov))
                      .join(', ')}
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
                <AlleOppgaverActionMenu oppgave={oppgave} revalidateFunction={revalidateFunction} />
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </>
  );
};
