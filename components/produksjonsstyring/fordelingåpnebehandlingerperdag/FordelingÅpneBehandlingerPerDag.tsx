'use client';

import { BodyShort, Detail, VStack } from '@navikt/ds-react';
import { FordelingÅpneBehandlinger } from 'lib/types/statistikkTypes';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { ResponsivePlot } from 'components/produksjonsstyring/responsiveplot/ResponsivePlot';
import styles from '../../barn/oppgittebarnvurdering/OppgitteBarnVurdering.module.css';

interface Props {
  fordelingÅpneBehandlingerPerDag: Array<FordelingÅpneBehandlinger>;
}

export function FordelingÅpneBehandlingerPerDag({ fordelingÅpneBehandlingerPerDag }: Props) {
  const sortertFordeling = fordelingÅpneBehandlingerPerDag.sort((a, b) => a.bøtte - b.bøtte);
  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'2'}>
        <BodyShort size={'small'}>Liggetid åpne behandlinger</BodyShort>
        <VStack align={'center'}>
          <Detail className={styles.detailgray}>{'Viser hvor mange uker behandlingene har vært åpne.'}</Detail>
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
}
