'use client';

import { BodyShort, Heading, Table, VStack } from '@navikt/ds-react';
import { BehandlingÅrsakAntallGjennomsnitt } from 'lib/types/statistikkTypes';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { sekunderTilDager } from 'lib/utils/time';
import { formaterFrittÅrsak } from '../../../lib/utils/årsaker';

interface Props {
  årsakTilBehandling: Array<BehandlingÅrsakAntallGjennomsnitt>;
}
export const ÅrsakTilBehandling = ({ årsakTilBehandling }: Props) => {
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
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Årsak</Table.HeaderCell>
            <Table.HeaderCell>Antall</Table.HeaderCell>
            <Table.HeaderCell>Snittalder</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {årsakTilBehandling.toReversed().map((it, i) => (
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
