'use client';

import { useState } from 'react';
import { VStack, Heading, BodyShort } from '@navikt/ds-react';
import { parseISO } from 'date-fns';
import { AntallDagerFilter } from '../antalldagerfilter/AntallDagerFilter';
import { ResponsivePlot } from '../responsiveplot/ResponsivePlot';
import { PlotWrapper } from '../plotwrapper/PlotWrapper';
import { BehandlingEndringerPerDag } from 'lib/types/statistikkTypes';
import { filtrerPeriode } from '../../../lib/utils/datefilter';

interface Props {
  behandlingerEndringer: BehandlingEndringerPerDag[];
}

export const BehandlingerInnUt = ({ behandlingerEndringer }: Props) => {
  const [selectedFilter, setSelectedFilter] = useState(0);

  const filteredData = behandlingerEndringer.filter((entry) => {
    const date = parseISO(entry.dato);
    return filtrerPeriode[selectedFilter]?.(date);
  });

  const sumNye = filteredData.reduce((sum, e) => sum + (e.nye || 0), 0);
  const sumAvsluttede = filteredData.reduce((sum, e) => sum + (e.avsluttede || 0), 0);
  const sumInnUt = sumNye - sumAvsluttede;

  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'5'}>
        <Heading level={'3'} size={'small'}>
          {'Nye og avsluttede behandlinger'}
        </Heading>
        <VStack align={'center'}>
          <BodyShort size={'large'}>
            {sumInnUt >= 0 ? '+' : ''} {sumInnUt} inngang/utgang
          </BodyShort>
        </VStack>
        <AntallDagerFilter selectedValue={selectedFilter} onChange={setSelectedFilter} />
      </VStack>
      <ResponsivePlot
        data={[
          {
            x: ['Nye'],
            y: [sumNye],
            type: 'bar',
            text: sumNye.toString(),
            textposition: 'outside',
          },
          {
            x: ['Avsluttede'],
            y: [sumAvsluttede],
            text: sumAvsluttede.toString(),
            textposition: 'outside',
            type: 'bar',
          },
        ]}
        layout={{
          yaxis: { title: 'Antall' },
          showlegend: false,
          autosize: true,
        }}
      />
    </PlotWrapper>
  );
};
