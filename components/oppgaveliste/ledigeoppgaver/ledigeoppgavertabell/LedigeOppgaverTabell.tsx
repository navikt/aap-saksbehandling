import { Alert, BodyShort, CopyButton, SortState, Table, Tooltip } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import Link from 'next/link';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import {
  mapBehovskodeTilBehovstype,
  mapTilOppgaveBehandlingstypeTekst,
  mapTilÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/oversettelser';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { AvklaringsbehovKode, VurderingsbehovIntern, ÅrsakTilOpprettelse } from 'lib/types/types';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { Dispatch, SetStateAction, useState } from 'react';
import { LedigeOppgaverMeny } from 'components/oppgaveliste/ledigeoppgaver/ledigeoppgavermeny/LedigeOppgaverMeny';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import { ManglerTilgangModal } from 'components/oppgaveliste/manglertilgangmodal/ManglerTilgangModal';
import { SynkroniserEnhetModal } from 'components/oppgaveliste/synkroniserenhetmodal/SynkroniserEnhetModal';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';
import { OppgaveIkkeLedigModal } from 'components/oppgaveliste/oppgaveikkeledigmodal/OppgaveIkkeLedigModal';
import {
  NoNavAapOppgaveListeOppgaveSorteringSortBy,
  PathsMineOppgaverGetParametersQuerySortby,
} from '@navikt/aap-oppgave-typescript-types';

interface Props {
  oppgaver: Oppgave[];
  revalidateFunction: () => void;
  setSortBy: (orderBy: NoNavAapOppgaveListeOppgaveSorteringSortBy) => void;
  sort: SortState | undefined;
}

export const LedigeOppgaverTabell = ({ oppgaver, revalidateFunction, setSortBy, sort }: Props) => {
  const [feilmelding, setFeilmelding] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visSynkroniserEnhetModal, setVisSynkroniserEnhetModal] = useState<boolean>(false);
  const [saksbehandlerNavn, setSaksbehandlerNavn] = useState<string>();
  const [visOppgaveIkkeLedigModal, setVisOppgaveIkkeLedigModal] = useState<boolean>(false);

  return (
    <>
      <ManglerTilgangModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        revalidateFunction={revalidateFunction}
      />
      <TildelOppgaveModal revalidateFunction={revalidateFunction} />
      <SynkroniserEnhetModal
        visSynkroniserEnhetModal={visSynkroniserEnhetModal}
        setVisSynkroniserEnhetModal={setVisSynkroniserEnhetModal}
      />
      <OppgaveIkkeLedigModal
        visOppgaveIkkeLedigModal={visOppgaveIkkeLedigModal}
        setVisOppgaveIkkeLedigModal={setVisOppgaveIkkeLedigModal}
        saksbehandlerNavn={saksbehandlerNavn}
        revaliderOppgaver={revalidateFunction}
      />
      {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => setSortBy(sortKey as NoNavAapOppgaveListeOppgaveSorteringSortBy)}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader textSize={'small'}>Navn</Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.PERSONIDENT}
              sortable={true}
              textSize={'small'}
            >
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={NoNavAapOppgaveListeOppgaveSorteringSortBy.SAKSNUMMER} sortable={true}>
              Sak
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
              <Table.DataCell textSize={'small'}>{oppgave.saksnummer || oppgave.journalpostId}</Table.DataCell>
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
                <Tooltip content={mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode as AvklaringsbehovKode)}>
                  <BodyShort truncate size={'small'}>
                    {mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode as AvklaringsbehovKode)}
                  </BodyShort>
                </Tooltip>
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(oppgave.opprettetTidspunkt)}</Table.DataCell>

              <Table.DataCell textSize={'small'}>
                <OppgaveInformasjon oppgave={oppgave} />
              </Table.DataCell>

              <Table.DataCell textSize={'small'} align={'right'}>
                <LedigeOppgaverMeny
                  oppgave={oppgave}
                  setFeilmelding={setFeilmelding}
                  setÅpenModal={setIsModalOpen}
                  setVisSynkroniserEnhetModal={setVisSynkroniserEnhetModal}
                  revaliderOppgaver={revalidateFunction}
                  setVisOppgaveIkkeLedigModal={setVisOppgaveIkkeLedigModal}
                  setSaksbehandlerNavn={setSaksbehandlerNavn}
                />
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </TableStyled>
    </>
  );
};
