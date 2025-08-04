'use client';

import { BodyShort, Detail, Table, VStack } from '@navikt/ds-react';
import { BehandlingÅrsakAntallGjennomsnitt } from 'lib/types/statistikkTypes';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { sekunderTilDager } from 'lib/utils/time';
import { formaterFrittVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { ScopedSortState, useSortertListe } from 'hooks/oppgave/SorteringHook';
import styles from '../../barn/oppgittebarnvurdering/OppgitteBarnVurdering.module.css';

interface Props {
  vurderingsbehov: Array<BehandlingÅrsakAntallGjennomsnitt>;
}

export const VurderingsbehovPåBehandlinger = ({ vurderingsbehov }: Props) => {
  const { sort, håndterSortering, sortertListe } = useSortertListe(vurderingsbehov);

  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'2'}>
        <BodyShort size={'small'}>{'Vurderingsbehov på behandlinger'}</BodyShort>
        <VStack align={'center'}>
          <Detail className={styles.detailgray}>
            {'Viser alle registrerte vurderingsbehov på behandlinger. Én behandling kan ha flere vurderingsbehov.'}
          </Detail>
        </VStack>
      </VStack>
      <VStack padding={'space-8'} />
      <Table
        sort={sort}
        onSortChange={(sortKey) =>
          håndterSortering(sortKey as ScopedSortState<BehandlingÅrsakAntallGjennomsnitt>['orderBy'])
        }
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Vurderingsbehov</Table.HeaderCell>
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
              <Table.DataCell>{formaterFrittVurderingsbehov(it.årsak)}</Table.DataCell>
              <Table.DataCell>{it.antall}</Table.DataCell>
              <Table.DataCell>{sekunderTilDager(it.gjennomsnittligAlder)} dager</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </PlotWrapper>
  );
};
