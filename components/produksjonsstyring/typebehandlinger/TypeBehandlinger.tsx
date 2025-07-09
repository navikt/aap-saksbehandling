// import { PlotWrapper } from 'components/plotwrapper/PlotWrapper';
import { BodyShort, Detail, VStack } from '@navikt/ds-react';
import { AntallÅpneOgGjennomsnitt } from 'lib/types/statistikkTypes';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { ResponsivePlot } from 'components/produksjonsstyring/responsiveplot/ResponsivePlot';
import styles from '../../barn/oppgittebarnvurdering/OppgitteBarnVurdering.module.css';

interface Props {
  åpneOgGjennomsnitt: Array<AntallÅpneOgGjennomsnitt>;
}
export const TypeBehandlinger = ({ åpneOgGjennomsnitt }: Props) => {
  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'2'}>
        <BodyShort size={'small'}>{'Type behandlinger'}</BodyShort>
        <VStack align={'center'}>
          <Detail className={styles.detailgray}>{'Alle åpne behandlinger fordelt på behandlingstype'}</Detail>
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
