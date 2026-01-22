import { Oppgave } from 'lib/types/oppgaveTypes';
import { Dispatch, SetStateAction, useState } from 'react';
import { Alert, SortState, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';
import { ManglerTilgangModal } from 'components/oppgaveliste/manglertilgangmodal/ManglerTilgangModal';
import { MineOppgaverTabellRad } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabellRad';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';

interface Props {
  oppgaver: Oppgave[];
  revalidateFunction: () => void;
  setSortBy: Dispatch<SetStateAction<string>>;
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
      <TableStyled size={'small'} zebraStripes sort={sort} onSortChange={(sortKey) => setSortBy(sortKey)}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader sortKey={'personNavn'} sortable={true} textSize={'small'}>
              Navn
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'personIdent'} sortable={true} textSize={'small'}>
              Fnr
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'saksnummer'} sortable={true}>
              Sak
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
            <Table.ColumnHeader sortKey={'årsak'} sortable={true}>
              Vurderingsbehov
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'avklaringsbehovKode'} sortable={true}>
              Oppgave
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'opprettetTidspunkt'} sortable={true}>
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
