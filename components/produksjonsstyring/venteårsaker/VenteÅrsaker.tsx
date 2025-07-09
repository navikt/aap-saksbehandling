'use client';

import { BodyShort, Heading, Table, VStack } from '@navikt/ds-react';
import { mapTilVenteÅrsakTekst } from 'lib/utils/oversettelser';
import { PlotWrapper } from '../plotwrapper/PlotWrapper';
import { VenteÅrsakOgGjennomsnitt } from 'lib/types/statistikkTypes';
import { SettPåVentÅrsaker } from 'lib/types/types';
import { sekunderTilDager } from 'lib/utils/time';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';

interface Props {
  venteÅrsaker: Array<VenteÅrsakOgGjennomsnitt>;
}

export const VenteÅrsaker = ({ venteÅrsaker }: Props) => {
  const totalt = venteÅrsaker.reduce((sum, e) => sum + (e.antall || 0), 0);
  const { sort, håndterSortering, sortertListe } = useSortertListe(venteÅrsaker);

  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'5'}>
        <Heading level={'3'} size={'small'}>
          {'Årsakene til at en behandling er på vent'}
        </Heading>
        <VStack align={'center'}>
          <BodyShort size={'large'}>{totalt} behandlinger på vent</BodyShort>
        </VStack>
      </VStack>
      <Table
        sort={sort}
        onSortChange={(sortKey) => håndterSortering(sortKey as ScopedSortState<VenteÅrsakOgGjennomsnitt>['orderBy'])}
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
              <Table.DataCell>{mapTilVenteÅrsakTekst(it.årsak as SettPåVentÅrsaker)}</Table.DataCell>
              <Table.DataCell>{it.antall}</Table.DataCell>
              <Table.DataCell>{sekunderTilDager(it.gjennomsnittligAlder)} dager</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </PlotWrapper>
  );
};
