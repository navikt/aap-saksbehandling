import { Oppgave, Vurderingsbehov, ÅrsakTilOpprettelse } from 'lib/types/types';
import { BodyShort, Checkbox, CopyButton, Table, Tooltip } from '@navikt/ds-react';
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
import { Dispatch, SetStateAction, useState } from 'react';
import { SynkroniserEnhetModal } from 'components/oppgaveliste/synkroniserenhetmodal/SynkroniserEnhetModal';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';

export interface OppgaveTilSortering extends Omit<Oppgave, 'behandlingstype' | 'årsakerTilBehandling'> {
  behandlingstype: string;
  årsakerTilBehandling: string;
  originalOppgave: Oppgave;
}

interface Props {
  oppgaver: Oppgave[];
  revalidateFunction: () => Promise<unknown>;
  setValgteRader: Dispatch<SetStateAction<number[]>>;
  valgteRader: number[];
}

const mapTilSorterbarOppgave = (oppgave: Oppgave): OppgaveTilSortering => ({
  ...oppgave,
  behandlingstype: mapTilOppgaveBehandlingstypeTekst(oppgave.behandlingstype),
  årsakTilOpprettelse: mapTilÅrsakTilOpprettelseTilTekst(oppgave.årsakTilOpprettelse as ÅrsakTilOpprettelse),
  årsakerTilBehandling: oppgave.årsakerTilBehandling
    .map((årsak) => formaterVurderingsbehov(årsak as Vurderingsbehov))
    .join(', '),
  avklaringsbehovKode: mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode),
  originalOppgave: oppgave,
});

export const AlleOppgaverTabell = ({ oppgaver, revalidateFunction, setValgteRader, valgteRader }: Props) => {
  const oppgaverTilSortering: OppgaveTilSortering[] = oppgaver.map(mapTilSorterbarOppgave);
  const { sort, sortertListe, settSorteringskriterier } = useSortertListe(oppgaverTilSortering, 'alle-oppgaver');
  const [visSynkroniserEnhetModal, setVisSynkroniserEnhetModal] = useState<boolean>(false);

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

  return (
    <>
      <SynkroniserEnhetModal
        visSynkroniserEnhetModal={visSynkroniserEnhetModal}
        setVisSynkroniserEnhetModal={setVisSynkroniserEnhetModal}
      />
      <TildelOppgaveModal revalidateFunction={revalidateFunction} />
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => settSorteringskriterier(sortKey as ScopedSortState<Oppgave>['orderBy'])}
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Sak</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'personIdent'} sortable={true} textSize={'small'}>
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'behandlingstype'} sortable={true}>
              Behandlingstype
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'behandlingOpprettet'} sortable={true}>
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'årsakTilOpprettelse'} sortable={true}>
              Årsak
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'årsakerTilBehandling'} sortable={true}>
              Vurderingsbehov
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'avklaringsbehovKode'} sortable={true}>
              Oppgave
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'opprettetTidspunkt'} sortable={true}>
              Oppg. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'reservertAvNavn'} sortable={true}>
              Veileder/Saksbehandler
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
              <Table.DataCell textSize={'small'}>{oppgave.behandlingstype}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.behandlingOpprettet)}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{oppgave.årsakTilOpprettelse ?? '-'}</Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip content={oppgave.årsakerTilBehandling}>
                  <BodyShort truncate size={'small'}>
                    {oppgave.årsakerTilBehandling}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip content={oppgave.avklaringsbehovKode}>
                  <BodyShort truncate size={'small'}>
                    {oppgave.avklaringsbehovKode}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.opprettetTidspunkt)}</Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip content={(oppgave.reservertAvNavn ?? oppgave.reservertAv) || 'Ledig'}>
                  <BodyShort truncate size={'small'}>
                    {(oppgave.reservertAvNavn ?? oppgave.reservertAv) || 'Ledig'}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                <OppgaveInformasjon oppgave={oppgave.originalOppgave} />
              </Table.DataCell>
              <Table.DataCell textSize={'small'} align={'right'}>
                <AlleOppgaverActionMenu
                  oppgave={oppgave.originalOppgave}
                  revalidateFunction={revalidateFunction}
                  setVisSynkroniserEnhetModal={setVisSynkroniserEnhetModal}
                />
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </>
  );
};
