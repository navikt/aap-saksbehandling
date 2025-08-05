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

  const antallOppgaver = isSuccess(oppgaverPerSteggruppe)
    ? oppgaverPerSteggruppe.data
    : { nye: 0, lukkede: 0, totalt: 0 };

  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'2'}>
        <BodyShort size={'small'}>{'Nye og avsluttede oppgaver'}</BodyShort>
        <VStack align={'center'}>
          <Heading size={'small'}>{antallOppgaver.totalt} åpne oppgaver totalt</Heading>
        </VStack>
        <AntallDagerFilter selectedValue={selectedValue} onChange={setOppslagsPeriode} />
      </VStack>
      <VStack padding={'space-8'} />
      <ResponsivePlot
        data={[
          {
            x: ['Nye'],
            y: [antallOppgaver.nye],
            type: 'bar',
            text: antallOppgaver.nye.toString(),
            textposition: 'outside',
          },
          {
            x: ['Avsluttede'],
            y: [antallOppgaver.lukkede],
            type: 'bar',
            text: antallOppgaver.lukkede.toString(),
            textposition: 'outside',
          },
        ]}
        layout={{
          yaxis: { title: 'Antall', dtick: antallOppgaver.nye > 4 || antallOppgaver.lukkede > 4 ? '' : 1 },
          showlegend: false,
          autosize: true,
        }}
      />
    </PlotWrapper>
  );
};
