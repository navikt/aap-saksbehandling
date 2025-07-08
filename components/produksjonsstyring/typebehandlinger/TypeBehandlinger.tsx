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
          <BodyShort size={'large'}>{'Alle åpne behandlinger fordelt på behandlingstype'}</BodyShort>
        </VStack>
      </VStack>
      <ResponsivePlot
        data={åpneOgGjennomsnitt.map((it) => ({
          x: [it.antallÅpne],
          y: [it.behandlingstype],
          type: 'bar',
          text: it.antallÅpne.toString(),
          textposition: 'outside',
          orientation: 'h',
        }))}
        layout={{
          yaxis: { title: 'Antall', automargin: true },
          showlegend: false,
        }}
      />
    </PlotWrapper>
  );
};
