'use client';

import { BodyShort, Heading, Table, VStack } from '@navikt/ds-react';
import { BehandlingÅrsakAntallGjennomsnitt } from 'lib/types/statistikkTypes';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { sekunderTilDager } from 'lib/utils/time';
import { formaterFrittÅrsak } from 'lib/utils/årsaker';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';

interface Props {
  årsakTilBehandling: Array<BehandlingÅrsakAntallGjennomsnitt>;
}

export const ÅrsakTilBehandling = ({ årsakTilBehandling }: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks -- Fil som starter med Å liker ikke hook rulen
  const { sort, håndterSortering, sortertListe } = useSortertListe(årsakTilBehandling);

  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'5'}>
        <Heading level={'3'} size={'small'}>
          {'Årsak til behandling'}
        </Heading>
        <VStack align={'center'}>
          <BodyShort size={'medium'}>
            {'Viser alle registrerte årsaker til behandling. Én behandling kan ha flere årsaker.'}
          </BodyShort>
        </VStack>
      </VStack>
      <Table
        sort={sort}
        onSortChange={(sortKey) =>
          håndterSortering(sortKey as ScopedSortState<BehandlingÅrsakAntallGjennomsnitt>['orderBy'])
        }
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Årsak</Table.HeaderCell>
            <Table.ColumnHeader sortKey={'antall'} sortable={true}>
              Antall
            </Table.ColumnHeader>
            <Table.ColumnHeader sortKey={'gjennomsnittligAlder'} sortable={true}>
              Snittalder
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortertListe.map((it, i) => (
            <Table.Row key={`rad-${i}`}>
              <Table.DataCell>{formaterFrittÅrsak(it.årsak)}</Table.DataCell>
              <Table.DataCell>{it.antall}</Table.DataCell>
              <Table.DataCell>{sekunderTilDager(it.gjennomsnittligAlder)} dager</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </PlotWrapper>
  );
};
