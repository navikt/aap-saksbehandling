'use client';

import { Heading, VStack } from '@navikt/ds-react';
import { FordelingÅpneBehandlinger } from 'lib/types/statistikkTypes';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { ResponsivePlot } from 'components/produksjonsstyring/responsiveplot/ResponsivePlot';

interface Props {
  fordelingÅpneBehandlingerPerDag: Array<FordelingÅpneBehandlinger>;
}
export function FordelingÅpneBehandlingerPerDag({ fordelingÅpneBehandlingerPerDag }: Props) {
  const sortertFordeling = fordelingÅpneBehandlingerPerDag.sort((a, b) => a.bøtte - b.bøtte);
  return (
    <PlotWrapper>
      <VStack align={'center'}>
        <Heading level={'3'} size={'small'}>
          Liggetid åpne behandlinger
        </Heading>
      </VStack>
      <ResponsivePlot
        data={[
          {
            x: sortertFordeling.map((e) => `${e.bøtte}`),
            y: sortertFordeling.map((v) => v.antall),
            type: 'bar',
            hovertemplate: 'Antall i uke %{x}: %{y}',
          },
        ]}
        layout={{
          yaxis: { title: 'Antall' },
          xaxis: { title: 'Alder (uker)' },
        }}
      />
    </PlotWrapper>
  );
}
