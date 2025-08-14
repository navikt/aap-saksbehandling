import { Oppgave } from 'lib/types/oppgaveTypes';
import { useState } from 'react';
import { Alert, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';
import { ManglerTilgangModal } from 'components/oppgaveliste/manglertilgangmodal/ManglerTilgangModal';
import { MineOppgaverTabellRad } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabellRad';

interface Props {
  oppgaver: Oppgave[];
  revalidateFunction: () => void;
}

export const MineOppgaverTabell = ({ oppgaver, revalidateFunction }: Props) => {
  const [feilmelding, setFeilmelding] = useState<string | undefined>();
  const { sort, håndterSortering, sortertListe } = useSortertListe(oppgaver);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <VStack gap={'5'}>
      <ManglerTilgangModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        revalidateFunction={revalidateFunction}
      />
      {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
      <TableStyled
        size={'small'}
        zebraStripes
        sort={sort}
        onSortChange={(sortKey) => håndterSortering(sortKey as ScopedSortState<Oppgave>['orderBy'])}
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
            <Table.ColumnHeader sortKey={'behandlingstype'} sortable={true}>
              Behandlingstype
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'behandlingOpprettet'} sortable={true}>
              Beh. opprettet
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'årsakTilOpprettelse'} sortable={true} textSize={'small'}>
              Årsak
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'årsak'} sortable={true}>
              Vurderingsbehov
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'avklaringsbehovKode'} sortable={true}>
              Oppgave
            </Table.ColumnHeader>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortertListe.map((oppgave) => (
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
