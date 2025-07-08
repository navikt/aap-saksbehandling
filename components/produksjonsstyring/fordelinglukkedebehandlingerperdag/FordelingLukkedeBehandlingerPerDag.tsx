'use client';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';
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
      <VStack align={'center'} gap={'5'}>
        <Heading level={'3'} size={'small'}>
          Liggetid avsluttede behandlinger
        </Heading>
        <VStack align={'center'}>
          <BodyShort size={'large'}>{'Viser hvor mange uker behandlingene var åpne før de ble avsluttet.'}</BodyShort>
        </VStack>
      </VStack>
      <ResponsivePlot
        data={[
          {
            x: sortertFordeling.map((e) => `${e.bøtte}`),
            y: sortertFordeling.map((v) => v.antall),
            type: 'bar',
            hovertemplate: 'Antall behandlinger: %{y} <br> Alder: %{x} uker',
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
