'use client';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { ResponsivePlot } from 'components/produksjonsstyring/responsiveplot/ResponsivePlot';
import { useState } from 'react';
import { AntallDagerFilter, periodeOptions } from '../antalldagerfilter/AntallDagerFilter';
import { OppslagsPeriode } from '../../../lib/types/statistikkTypes';
import { oppgaverPerSteggruppeClient } from '../../../lib/oppgaveClientApi';
import useSWR from 'swr';
import { isSuccess } from '../../../lib/utils/api';

interface Props {
  behandlingstyperQuery: string;
}

export const OppgaverInnUt = ({ behandlingstyperQuery }: Props) => {
  const [selectedValue, setOppslagsPeriode] = useState(0);

  const oppslagsPeriode: OppslagsPeriode =
    periodeOptions.find((o) => o.value === selectedValue)?.oppslagsPeriode ?? 'IDAG';

  const { data: oppgaverPerSteggruppe } = useSWR(
    `/oppgave/api/statistikk/apne-oppgaver-med-periode?oppslagsPeriode=${oppslagsPeriode}&${behandlingstyperQuery}`,
    oppgaverPerSteggruppeClient
  );

  const antallOppgaver = isSuccess(oppgaverPerSteggruppe) ? oppgaverPerSteggruppe : { nye: 0, lukkede: 0 };
  console.log(antallOppgaver);

  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'2'}>
        <BodyShort size={'small'}>{'Nye og avsluttede oppgaver'}</BodyShort>
        <VStack align={'center'}>
          <Heading size={'small'}>{1} totalt</Heading>
        </VStack>
        <AntallDagerFilter selectedValue={selectedValue} onChange={setOppslagsPeriode} />
      </VStack>
      <VStack padding={'space-8'} />
      <ResponsivePlot
        data={[
          {
            y: [1],
            x: ['Åpne behandlinger'],
            type: 'bar',
            text: '',
            textposition: 'outside',
          },
          {
            y: [1],
            x: ['På vent'],
            type: 'bar',
            text: '',
            textposition: 'outside',
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
