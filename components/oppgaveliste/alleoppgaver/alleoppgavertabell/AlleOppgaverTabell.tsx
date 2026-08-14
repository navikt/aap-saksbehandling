import { Link as AkselLink, BodyShort, Checkbox, CopyButton, Table, Tooltip } from '@navikt/ds-react';
import { ScopedBackendSortState } from 'hooks/oppgave/BackendSorteringHook';
import { AktivKø } from 'hooks/oppgave/aktivkøHook';
import { OppgaveMedKontekst, SortBy } from 'lib/types/oppgaveTypes';
import { VurderingsbehovIntern, ÅrsakTilOpprettelse } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import {
  mapBehovskodeTilBehovstype,
  mapTilOppgaveBehandlingstypeTekst,
  mapTilÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/oversettelser';
import { isOppgavelisteOppgaveSorteringSortBy } from 'lib/utils/request';
import { formaterTilNok } from 'lib/utils/string';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';

import { AlleOppgaverActionMenu } from 'components/oppgaveliste/alleoppgaver/alleoppgaveractionmenu/AlleOppgaverActionMenu';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import { SynkroniserEnhetModal } from 'components/oppgaveliste/synkroniserenhetmodal/SynkroniserEnhetModal';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';

interface Props {
  oppgaver: OppgaveMedKontekst[];
  revalidateFunction: () => Promise<unknown>;
  setValgteRader: Dispatch<SetStateAction<number[]>>;
  valgteRader: number[];
  setSortBy: (orderBy: SortBy) => void;
  sort: ScopedBackendSortState<SortBy> | undefined;
  aktivKø: AktivKø | undefined;
  visBeløpKolonne: boolean;
}

export const AlleOppgaverTabell = ({
  oppgaver,
  revalidateFunction,
  setValgteRader,
  valgteRader,
  setSortBy,
  sort,
  aktivKø,
  visBeløpKolonne,
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
        onSortChange={(sortKey) => {
          if (isOppgavelisteOppgaveSorteringSortBy(sortKey)) {
            setSortBy(sortKey);
          }
        }}
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Sak</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'PERSONIDENT'} sortable={true}>
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'BEHANDLINGSTYPE'} sortable={true}>
              Behandlingstype
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'BEHANDLING_OPPRETTET'} sortable={true}>
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'ÅRSAK_TIL_OPPRETTELSE'} sortable={true}>
              Årsak
            </Table.ColumnHeader>
            <Table.ColumnHeader>Vurderingsbehov</Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'AVKLARINGSBEHOV_KODE'} sortable={aktivKø?.type !== 'KVALITETSSIKRING'}>
              {aktivKø?.type !== 'KVALITETSSIKRING' ? 'Oppgave' : 'Kontor'}
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'OPPRETTET_TIDSPUNKT'} sortable={true}>
              Oppg. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'RESERVERT_AV'} sortable={true}>
              Tildelt
            </Table.ColumnHeader>
            {visBeløpKolonne && (
              <Table.ColumnHeader sortKey={'TILBAKEKREVINGS_BELOP'} sortable={true}>
                Beløp
              </Table.ColumnHeader>
            )}
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver.map((oppgave, i) => (
            <Table.Row key={`oppgave-${i}`} selected={valgteRader.includes(oppgave.oppgaveMetadata.id)}>
              <Table.DataCell>
                <Checkbox
                  hideLabel
                  checked={valgteRader.includes(oppgave.oppgaveMetadata.id)}
                  onChange={() => toggleValgtRad(oppgave.oppgaveMetadata.id)}
                >
                  {' '}
                </Checkbox>
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {oppgave.behandlingskontekst.saksnummer ? (
                  <AkselLink
                    as={Link}
                    prefetch={false}
                    href={`/saksbehandling/sak/${oppgave.behandlingskontekst.saksnummer}`}
                  >
                    {oppgave.behandlingskontekst.saksnummer}
                  </AkselLink>
                ) : (
                  <span>{oppgave.behandlingskontekst.journalpostId}</span>
                )}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                <CopyButton
                  copyText={oppgave?.personOgEnhet.personIdent}
                  size="xsmall"
                  text={oppgave?.personOgEnhet.personIdent}
                  iconPosition="right"
                />
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {mapTilOppgaveBehandlingstypeTekst(oppgave.behandlingskontekst.behandlingstype)}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.behandlingOpprettet)}</Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {oppgave.årsakTilOpprettelse
                  ? mapTilÅrsakTilOpprettelseTilTekst(oppgave.årsakTilOpprettelse as ÅrsakTilOpprettelse)
                  : '-'}
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip
                  content={oppgave.vurderingsbehov
                    .map((årsak) => formaterVurderingsbehov(årsak as VurderingsbehovIntern))
                    .join(', ')}
                >
                  <BodyShort truncate size={'small'}>
                    {oppgave.vurderingsbehov
                      .map((årsak) => formaterVurderingsbehov(årsak as VurderingsbehovIntern))
                      .join(', ')}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                {aktivKø?.type === 'KVALITETSSIKRING' ? (
                  (oppgave.personOgEnhet.enhetForrigeOppgave?.navn ?? '-')
                ) : (
                  <Tooltip content={mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}>
                    <BodyShort truncate size={'small'}>
                      {mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}
                    </BodyShort>
                  </Tooltip>
                )}
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>
                {formaterDatoForFrontend(oppgave.oppgaveMetadata.opprettetTidspunkt)}
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '150px' }} textSize={'small'}>
                <Tooltip content={(oppgave.reservertAvNavn ?? oppgave.reservertAv) || 'Ledig'}>
                  <BodyShort truncate size={'small'}>
                    {(oppgave.reservertAvNavn ?? oppgave.reservertAv) || 'Ledig'}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              {visBeløpKolonne && (
                <Table.DataCell textSize={'small'}>
                  {oppgave.behandlingskontekst.behandlingstype === 'TILBAKEKREVING'
                    ? formaterTilNok(oppgave.tilbakekrevingsVars?.tilbakekrevings_beløp)
                    : ''}
                </Table.DataCell>
              )}
              <Table.DataCell textSize={'small'}>
                <OppgaveInformasjon oppgave={oppgave} />
              </Table.DataCell>
              <Table.DataCell textSize={'small'} align={'right'}>
                <AlleOppgaverActionMenu
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
