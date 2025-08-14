'use client';

import { BodyShort, Detail, VStack } from '@navikt/ds-react';
import { FordelingLukkedeBehandlinger } from 'lib/types/statistikkTypes';
import { PlotWrapper } from '../plotwrapper/PlotWrapper';
import { ResponsivePlot } from 'components/produksjonsstyring/responsiveplot/ResponsivePlot';
import styles from '../../barn/oppgittebarnvurdering/OppgitteBarnVurdering.module.css';

interface Props {
  fordelingLukkedeBehandlinger: Array<FordelingLukkedeBehandlinger>;
}

export const FordelingLukkedeBehandlingerPerDag = ({ fordelingLukkedeBehandlinger }: Props) => {
  const sortertFordeling = fordelingLukkedeBehandlinger.sort((a, b) => a.bøtte - b.bøtte);
  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'2'}>
        <BodyShort size={'small'}>Liggetid avsluttede behandlinger</BodyShort>
        <VStack align={'center'}>
          <Detail className={styles.detailgray}>
            {'Viser hvor mange uker behandlingene var åpne før de ble avsluttet.'}
          </Detail>
        </VStack>
      </VStack>
      <VStack padding={'space-8'} />
      <ResponsivePlot
        data={[
          {
            x: sortertFordeling.map((e) => `${e.bøtte-1}`),
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
