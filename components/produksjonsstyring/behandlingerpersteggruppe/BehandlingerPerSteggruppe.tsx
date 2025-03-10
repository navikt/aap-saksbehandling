'use client';

import { BodyShort, Heading, HStack, Table, ToggleGroup, VStack } from '@navikt/ds-react';
import { mapTilSteggruppeTekst } from 'lib/utils/oversettelser';
import { BarChartIcon, TableIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { BehandlingPerSteggruppe } from 'lib/types/statistikkTypes';
import { steggruppeRekkefølge } from 'lib/utils/steggruppe';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { ResponsivePlot } from 'components/produksjonsstyring/responsiveplot/ResponsivePlot';

interface Props {
  data: Array<BehandlingPerSteggruppe>;
}

export const BehandlingerPerSteggruppe = ({ data }: Props) => {
  const [visning, setVisning] = useState<string>('chart');
  const sorterteSteg: Array<BehandlingPerSteggruppe> = steggruppeRekkefølge.reduce(
    (acc: Array<BehandlingPerSteggruppe>, steggruppe) => {
      const steggruppeIData = data.find((e) => `${e.steggruppe}` === steggruppe);
      if (steggruppeIData) {
        return [...acc, steggruppeIData];
      } else {
        return acc;
      }
    },
    []
  );
  const ukjenteSteg: BehandlingPerSteggruppe[] = data.reduce(
    (acc: BehandlingPerSteggruppe[], steg: BehandlingPerSteggruppe) => {
      const erISortertListe = sorterteSteg.find((e) => e.steggruppe === steg.steggruppe);
      if (!erISortertListe) {
        return [...acc, steg];
      }
      return acc;
    },
    []
  );
  const alleSteg = [...sorterteSteg, ...ukjenteSteg];
  return (
    <PlotWrapper>
      <HStack justify={'end'}>
        <ToggleGroup defaultValue="chart" size={'small'} onChange={(val) => setVisning(val)}>
          <ToggleGroup.Item value="chart" icon={<BarChartIcon title="Graf" />} />
          <ToggleGroup.Item value="table" icon={<TableIcon title="Tabell" />} />
        </ToggleGroup>
      </HStack>
      <VStack align={'center'} gap={'5'}>
        <Heading level={'3'} size={'small'}>
          Stegfordeling
        </Heading>
        <BodyShort size={'large'}>Hvor ligger behandling i flyten?</BodyShort>
      </VStack>

      {visning === 'chart' && (
        <ResponsivePlot
          data={alleSteg.map((gruppe) => ({
            y: [mapTilSteggruppeTekst(gruppe.steggruppe)],
            x: [gruppe.antall],
            type: 'bar',
            orientation: 'h',
          }))}
          layout={{
            xaxis: { title: 'Antall' },
            showlegend: false,
            margin: { l: 110 },
          }}
        />
      )}
      {visning === 'table' && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Steg</Table.HeaderCell>
              <Table.HeaderCell>Antall</Table.HeaderCell>
              <Table.HeaderCell>Eldste oppgave</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {alleSteg.toReversed().map((it, i) => (
              <Table.Row key={`rad-${i}`}>
                <Table.DataCell>{mapTilSteggruppeTekst(it.steggruppe)}</Table.DataCell>
                <Table.DataCell>{it.antall}</Table.DataCell>
                <Table.DataCell>{'finnes ikke'}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </PlotWrapper>
  );
};
