'use client';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { BehandlingEndringerPerDag } from 'lib/types/statistikkTypes';
import { PlotWrapper } from '../plotwrapper/PlotWrapper';
import { ResponsivePlot } from '../responsiveplot/ResponsivePlot';

interface Props {
  behandlingerEndringer: Array<BehandlingEndringerPerDag>;
}
export const BehandlingerInnUt = ({ behandlingerEndringer }: Props) => {
  const nyeFørsteDag = behandlingerEndringer[0]?.nye;
  const avsluttedeFørsteDag = behandlingerEndringer[0]?.avsluttede;
  const sumInnUt =
    nyeFørsteDag !== undefined && avsluttedeFørsteDag !== undefined ? nyeFørsteDag - avsluttedeFørsteDag : 0;
  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'5'}>
        <Heading level={'3'} size={'small'}>
          {'Inngang / Utgang'}
        </Heading>
        <VStack align={'center'}>
          <BodyShort size={'large'}>
            {sumInnUt >= 0 ? '+ ' : '- '}
            {sumInnUt}
          </BodyShort>
          <BodyShort size={'large'}>{'Endring i åpne behandlinger i dag'}</BodyShort>
        </VStack>
      </VStack>
      <ResponsivePlot
        data={[
          {
            x: ['Nye'],
            y: [nyeFørsteDag],
            type: 'bar',
          },
          {
            x: ['Avsluttede'],
            y: [avsluttedeFørsteDag],
            type: 'bar',
          },
        ]}
        layout={{
          yaxis: { title: 'Antall' },
          showlegend: false,
        }}
      />
    </PlotWrapper>
  );
};
