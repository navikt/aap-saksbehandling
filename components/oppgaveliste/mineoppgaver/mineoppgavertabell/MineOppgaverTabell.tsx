import { Oppgave } from 'lib/types/oppgaveTypes';
import { Dispatch, SetStateAction, useState } from 'react';
import { Alert, SortState, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { ManglerTilgangModal } from 'components/oppgaveliste/manglertilgangmodal/ManglerTilgangModal';
import { MineOppgaverTabellRad } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabellRad';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';
import { PathsMineOppgaverGetParametersQuerySortby } from '@navikt/aap-oppgave-typescript-types';

interface Props {
  oppgaver: Oppgave[];
  revalidateFunction: () => void;
  setSortBy: (orderBy: PathsMineOppgaverGetParametersQuerySortby) => void;
  sort: SortState | undefined;
}

export const MineOppgaverTabell = ({ oppgaver, revalidateFunction, setSortBy, sort }: Props) => {
  const [feilmelding, setFeilmelding] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <VStack gap={'5'}>
      <ManglerTilgangModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        revalidateFunction={revalidateFunction}
      />
      <TildelOppgaveModal revalidateFunction={revalidateFunction} />
      {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => setSortBy(sortKey as PathsMineOppgaverGetParametersQuerySortby)}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader textSize={'small'}>Navn</Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={PathsMineOppgaverGetParametersQuerySortby.PERSONIDENT}
              sortable={true}
              textSize={'small'}
            >
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={PathsMineOppgaverGetParametersQuerySortby.SAKSNUMMER} sortable={true}>
              Sak
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={PathsMineOppgaverGetParametersQuerySortby.BEHANDLINGSTYPE} sortable={true}>
              Behandlingstype
            </Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={PathsMineOppgaverGetParametersQuerySortby.BEHANDLING_OPPRETTET}
              sortable={true}
            >
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={PathsMineOppgaverGetParametersQuerySortby._RSAK_TIL_OPPRETTELSE}
              sortable={true}
            >
              Årsak
            </Table.ColumnHeader>
            <Table.ColumnHeader>Vurderingsbehov</Table.ColumnHeader>
            <Table.ColumnHeader
              sortKey={PathsMineOppgaverGetParametersQuerySortby.AVKLARINGSBEHOV_KODE}
              sortable={true}
            >
              Oppgave
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={PathsMineOppgaverGetParametersQuerySortby.OPPRETTET_TIDSPUNKT} sortable={true}>
              Oppg. opprettet
            </Table.ColumnHeader>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver.map((oppgave) => (
            <MineOppgaverTabellRad
              key={oppgave.id}
              oppgave={oppgave}
              setFeilmelding={setFeilmelding}
              setIsModalOpen={setIsModalOpen}
              revalidateFunction={revalidateFunction}
            />
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};
