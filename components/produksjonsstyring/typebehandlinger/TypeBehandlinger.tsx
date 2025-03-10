// import { PlotWrapper } from 'components/plotwrapper/PlotWrapper';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { AntallÅpneOgGjennomsnitt } from 'lib/types/statistikkTypes';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { ResponsivePlot } from 'components/produksjonsstyring/responsiveplot/ResponsivePlot';

interface Props {
  åpneOgGjennomsnitt: Array<AntallÅpneOgGjennomsnitt>;
}
export const TypeBehandlinger = ({ åpneOgGjennomsnitt }: Props) => {
  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'5'}>
        <Heading level={'3'} size={'small'}>
          {'Type behandlinger'}
        </Heading>
        <VStack align={'center'}>
          <BodyShort size={'large'}>{'Åpne behandlinger fordelt på behandlingstype'}</BodyShort>
        </VStack>
      </VStack>
      <ResponsivePlot
        data={åpneOgGjennomsnitt.map((it) => ({
          x: [it.behandlingstype],
          y: [it.antallÅpne],
          type: 'bar',
        }))}
        layout={{
          yaxis: { title: 'Antall' },
          showlegend: false,
        }}
      />
    </PlotWrapper>
  );
};
