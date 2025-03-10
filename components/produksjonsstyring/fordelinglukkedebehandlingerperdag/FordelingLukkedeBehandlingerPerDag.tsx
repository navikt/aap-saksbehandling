'use client';

import { Heading, VStack } from '@navikt/ds-react';
import { FordelingLukkedeBehandlinger } from 'lib/types/statistikkTypes';
import { PlotWrapper } from '../plotwrapper/PlotWrapper';
import { ResponsivePlot } from 'components/produksjonsstyring/responsiveplot/ResponsivePlot';

interface Props {
  fordelingLukkedeBehandlinger: Array<FordelingLukkedeBehandlinger>;
}
export const FordelingLukkedeBehandlingerPerDag = ({ fordelingLukkedeBehandlinger }: Props) => {
  const sortertFordeling = fordelingLukkedeBehandlinger.sort((a, b) => a.bøtte - b.bøtte);
  return (
    <PlotWrapper>
      <VStack align={'center'}>
        <Heading level={'3'} size={'small'}>
          Liggetid lukkede behandlinger
        </Heading>
      </VStack>
      <ResponsivePlot
        data={[
          {
            x: sortertFordeling.map((e) => `${e.bøtte}`),
            y: sortertFordeling.map((v) => v.antall),
            type: 'bar',
          },
        ]}
        layout={{
          yaxis: { title: 'Antall' },
          xaxis: { title: 'Alder (uker)' },
        }}
      />
    </PlotWrapper>
  );
};
