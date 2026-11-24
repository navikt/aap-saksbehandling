import { BodyShort, CopyButton, Link as AkselLink, SortState, Tooltip, VStack } from '@navikt/ds-react';
import { DataGrid } from '@navikt/ds-react/PREVIEW';
import { useFeatureFlag } from 'context/UnleashContext';
import { MineOppgaverSortBy, OppgaveMedKontekst } from 'lib/types/oppgaveTypes';
import { VurderingsbehovIntern, ÅrsakTilOpprettelse } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import {
  mapBehovskodeTilBehovstype,
  mapTilOppgaveBehandlingstypeTekst,
  mapTilÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/oversettelser';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { utledMaksdatoFraSykepenger } from 'lib/utils/sykepengermaksdato';
import { loggUmamiGåTilSaksoversikt } from 'lib/utils/umami/navigering';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { Alert } from 'components/alert/Alert';
import { ManglerTilgangModal } from 'components/oppgaveliste/manglertilgangmodal/ManglerTilgangModal';
import { MineOppgaverMeny } from 'components/oppgaveliste/mineoppgaver/mineoppgavermeny/MineOppgaverMeny';
import { OppgaveInformasjon } from 'components/oppgaveliste/oppgaveinformasjon/OppgaveInformasjon';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';

interface Props {
  oppgaver: OppgaveMedKontekst[];
  revalidateFunction: () => void;
  setSortBy: (orderBy: MineOppgaverSortBy) => void;
  sort: SortState | undefined;
}

const DATAGRID_INNSTILLINGER: DataGrid.Settings = {
  textSize: 'small',
  rowDensity: 'tight',
  zebraStripes: true,
  columnDividers: false,
  truncateContent: false,
};

const hentOppgaveId = (oppgave: OppgaveMedKontekst) => String(oppgave.oppgaveMetadata.id);

const formaterVurderingsbehovTekst = (oppgave: OppgaveMedKontekst) =>
  oppgave.vurderingsbehov.map((årsak) => formaterVurderingsbehov(årsak as VurderingsbehovIntern)).join(', ');

export const MineOppgaverDataGridTabell = ({ oppgaver, revalidateFunction, setSortBy, sort }: Props) => {
  const visMaksdatoSykepenger = useFeatureFlag('MaksdatoSykepenger');
  const [feilmelding, setFeilmelding] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const kolonner: DataGrid.Columns<OppgaveMedKontekst> = [
    {
      id: 'NAVN',
      header: 'Navn',
      isRowHeader: true,
      bodyCell: (oppgave) =>
        oppgave.behandlingskontekst.saksnummer ? (
          <AkselLink
            as={Link}
            prefetch={false}
            href={`/saksbehandling/sak/${oppgave.behandlingskontekst.saksnummer}`}
            onClick={() => loggUmamiGåTilSaksoversikt('MINE_OPPGAVER')}
          >
            {storForbokstavIHvertOrd(oppgave.personOgEnhet.personNavn)}
          </AkselLink>
        ) : (
          <span>{storForbokstavIHvertOrd(oppgave.personOgEnhet.personNavn)}</span>
        ),
    },
    {
      id: 'PERSONIDENT',
      header: 'Fnr',
      isSortable: true,
      bodyCell: (oppgave) => (
        <CopyButton
          copyText={oppgave.personOgEnhet.personIdent}
          size="xsmall"
          text={oppgave.personOgEnhet.personIdent}
          iconPosition="right"
        />
      ),
    },
    {
      id: 'SAKSNUMMER',
      header: 'Sak',
      isSortable: true,
      bodyCell: (oppgave) => oppgave.behandlingskontekst.saksnummer || oppgave.behandlingskontekst.journalpostId,
    },
    {
      id: 'BEHANDLINGSTYPE',
      header: 'Behandlingstype',
      isSortable: true,
      bodyCell: (oppgave) => mapTilOppgaveBehandlingstypeTekst(oppgave.behandlingskontekst.behandlingstype),
    },
    {
      id: 'BEHANDLING_OPPRETTET',
      header: 'Beh. opprettet',
      isSortable: true,
      bodyCell: (oppgave) => formaterDatoForFrontend(oppgave.behandlingOpprettet),
    },
    {
      id: 'ÅRSAK_TIL_OPPRETTELSE',
      header: 'Årsak',
      isSortable: true,
      bodyCell: (oppgave) =>
        oppgave.årsakTilOpprettelse != null
          ? mapTilÅrsakTilOpprettelseTilTekst(oppgave.årsakTilOpprettelse as ÅrsakTilOpprettelse)
          : '',
    },
    {
      id: 'VURDERINGSBEHOV',
      header: 'Vurderingsbehov',
      bodyCell: (oppgave) => (
        <Tooltip content={formaterVurderingsbehovTekst(oppgave)}>
          <BodyShort truncate size={'small'} style={{ maxWidth: '150px' }}>
            {formaterVurderingsbehovTekst(oppgave)}
          </BodyShort>
        </Tooltip>
      ),
    },
    {
      id: 'AVKLARINGSBEHOV_KODE',
      header: 'Oppgave',
      isSortable: true,
      bodyCell: (oppgave) => (
        <Tooltip content={mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}>
          <BodyShort truncate size={'small'} style={{ maxWidth: '150px' }}>
            {mapBehovskodeTilBehovstype(oppgave.avklaringsbehovKode)}
          </BodyShort>
        </Tooltip>
      ),
    },
    {
      id: 'OPPRETTET_TIDSPUNKT',
      header: 'Oppg. opprettet',
      isSortable: true,
      bodyCell: (oppgave) => formaterDatoForFrontend(oppgave.oppgaveMetadata.opprettetTidspunkt),
    },
    ...(visMaksdatoSykepenger
      ? [
          {
            id: 'MAKSDATO_SP',
            header: 'Maksdato SP',
            isSortable: true,
            bodyCell: (oppgave: OppgaveMedKontekst) => utledMaksdatoFraSykepenger(oppgave.gjenståendeSykedager),
          },
        ]
      : []),
    {
      id: 'INFORMASJON',
      header: 'Informasjon',
      headerCell: <span className="aksel-sr-only">Informasjon</span>,
      bodyCell: (oppgave) => <OppgaveInformasjon oppgave={oppgave} />,
    },
    {
      id: 'HANDLINGER',
      header: 'Handlinger',
      headerCell: <span className="aksel-sr-only">Handlinger</span>,
      align: 'right',
      bodyCell: (oppgave) => (
        <MineOppgaverMeny
          oppgave={oppgave}
          setFeilmelding={setFeilmelding}
          revalidateFunction={revalidateFunction}
          setÅpenModal={setIsModalOpen}
        />
      ),
    },
  ];

  const sortOrder: DataGrid.Table.SortEntry[] = sort?.orderBy
    ? [{ columnId: sort.orderBy, direction: sort.direction === 'descending' ? 'desc' : 'asc' }]
    : [];

  return (
    <VStack gap={'space-20'}>
      <ManglerTilgangModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        revalidateFunction={revalidateFunction}
      />
      <TildelOppgaveModal revalidateFunction={revalidateFunction} />
      {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
      <DataGrid
        ref={gridRef}
        style={{ height: '100vh' }}
        columns={kolonner}
        data={oppgaver}
        getRowId={hentOppgaveId}
        settings={DATAGRID_INNSTILLINGER}
      >
        <DataGrid.Table
          layout="auto"
          stickyHeader
          sorting={{
            sortOrder,
            allowMultiSort: false,
            // Sorteringen skjer i backend, og syklusen (asc → desc → ingen) styres av useBackendSortering
            onSortOrderChange: (_, { columnId }) => setSortBy(columnId as MineOppgaverSortBy),
          }}
        />
      </DataGrid>
    </VStack>
  );
};
