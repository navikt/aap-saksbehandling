import { Oppgave, Vurderingsbehov, ÅrsakTilOpprettelse } from 'lib/types/types';
import { BodyShort, Checkbox, CopyButton, SortState, Table, Tooltip } from '@navikt/ds-react';
import {
  mapBehovskodeTilBehovstype,
  mapTilOppgaveBehandlingstypeTekst,
  mapTilÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import Link from 'next/link';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { AlleOppgaverActionMenuNy } from 'components/oppgaveliste/alleoppgaverny/alleoppgaveractionmenuny/AlleOppgaverActionMenuNy';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import { Dispatch, SetStateAction, useState } from 'react';
import { SynkroniserEnhetModal } from 'components/oppgaveliste/synkroniserenhetmodal/SynkroniserEnhetModal';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';
import { NoNavAapOppgaveListeOppgaveSorteringSortBy } from '@navikt/aap-oppgave-typescript-types';

interface Props {
  oppgaver: Oppgave[];
  revalidateFunction: () => Promise<unknown>;
  setValgteRader: Dispatch<SetStateAction<number[]>>;
  valgteRader: number[];
  setSortBy: (orderBy: NoNavAapOppgaveListeOppgaveSorteringSortBy) => void;
  sort: SortState | undefined;
}

export const AlleOppgaverTabellNy = ({
  oppgaver,
  revalidateFunction,
  setValgteRader,
  valgteRader,
  setSortBy,
  sort,
}: Props) => {
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
        onSortChange={(sortKey) => setSortBy(sortKey as NoNavAapOppgaveListeOppgaveSorteringSortBy)}
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Sak</Table.HeaderCell>
            <Table.ColumnHeader sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.PERSONIDENT} sortable={true}>
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.BEHANDLINGSTYPE} sortable={true}>
              Behandlingstype
            </Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.BEHANDLING_OPPRETTET}
              sortable={true}
            >
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy._RSAK_TIL_OPPRETTELSE}
              sortable={true}
            >
              Årsak
            </Table.ColumnHeader>
            <Table.ColumnHeader>Vurderingsbehov</Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.AVKLARINGSBEHOV_KODE}
              sortable={true}
            >
              Oppgave
            </Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.OPPRETTET_TIDSPUNKT}
              sortable={true}
            >
              Oppg. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader>Veileder/Saksbehandler</Table.ColumnHeader>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver.map((oppgave, i) => (
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
              <Table.DataCell textSize={'small'}>
                {mapTilOppgaveBehandlingstypeTekst(oppgave.behandlingstype)}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.behandlingOpprettet)}</Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {oppgave.årsakTilOpprettelse
                  ? mapTilÅrsakTilOpprettelseTilTekst(oppgave.årsakTilOpprettelse as ÅrsakTilOpprettelse)
                  : '-'}
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip content={oppgave.årsakerTilBehandling.join(', ')}>
                  <BodyShort truncate size={'small'}>
                    {oppgave.årsakerTilBehandling
                      .map((årsak) => formaterVurderingsbehov(årsak as Vurderingsbehov))
                      .join(', ')}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip content={mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}>
                  <BodyShort truncate size={'small'}>
                    {mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}
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
                <OppgaveInformasjon oppgave={oppgave} />
              </Table.DataCell>
              <Table.DataCell textSize={'small'} align={'right'}>
                <AlleOppgaverActionMenuNy
                  oppgave={oppgave}
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
