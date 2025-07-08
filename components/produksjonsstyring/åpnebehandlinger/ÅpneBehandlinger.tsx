'use client';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { PlotWrapper } from 'components/produksjonsstyring/plotwrapper/PlotWrapper';
import { ResponsivePlot } from 'components/produksjonsstyring/responsiveplot/ResponsivePlot';
import { useState } from 'react';
import { AntallDagerFilter, periodeOptions } from '../antalldagerfilter/AntallDagerFilter';
import { OppslagsPeriode } from '../../../lib/types/statistikkTypes';
import { antallÅpneBehandlingerPerBehandlingstypeClient, venteÅrsakerClient } from '../../../lib/oppgaveClientApi';
import useSWR from 'swr';
import { isSuccess } from '../../../lib/utils/api';

interface Props {
  behandlingstyperQuery: string;
}
export const ApneBehandlinger = ({ behandlingstyperQuery }: Props) => {
  const [selectedValue, setOppslagsPeriode] = useState(0);

  const oppslagsPeriode: OppslagsPeriode =
    periodeOptions.find((o) => o.value === selectedValue)?.oppslagsPeriode ?? 'IDAG';

  const { data: antallÅpneBehandlingerMedPeriode } = useSWR(
    `/oppgave/api/statistikk/apne-behandlinger-med-periode?oppslagsPeriode=${oppslagsPeriode}&${behandlingstyperQuery}`,
    antallÅpneBehandlingerPerBehandlingstypeClient
  );

  const { data: venteÅrsakerMedPeriode } = useSWR(
    `/oppgave/api/statistikk/behandlinger/pa-vent-med-periode?oppslagsPeriode=${oppslagsPeriode}&${behandlingstyperQuery}`,
    venteÅrsakerClient
  );
  const antallPåVentMedPeriode = isSuccess(venteÅrsakerMedPeriode)
    ? venteÅrsakerMedPeriode.data?.map((årsak) => årsak.antall).reduce((acc, curr) => acc + curr, 0)
    : undefined;

  const åpneOgGjennomsnitt = isSuccess(antallÅpneBehandlingerMedPeriode)
    ? antallÅpneBehandlingerMedPeriode.data || []
    : [];

  const totaltAntallÅpneBehandlinger = åpneOgGjennomsnitt.reduce((acc, curr) => acc + curr.antallÅpne, 0);
  const antallPåVentEllerNull = antallPåVentMedPeriode === undefined ? 0 : antallPåVentMedPeriode;

  return (
    <PlotWrapper>
      <VStack align={'center'} gap={'5'}>
        <Heading level={'3'} size={'small'}>
          {'Status på behandlinger'}
        </Heading>
        <VStack align={'center'}>
          <BodyShort size={'large'}>{totaltAntallÅpneBehandlinger + antallPåVentEllerNull} totalt</BodyShort>
        </VStack>
        <AntallDagerFilter selectedValue={selectedValue} onChange={setOppslagsPeriode} />
      </VStack>
      <ResponsivePlot
        data={[
          {
            y: [totaltAntallÅpneBehandlinger],
            x: ['Åpne behandlinger'],
            type: 'bar',
            text: totaltAntallÅpneBehandlinger.toString(),
            textposition: 'outside',
          },
          {
            y: [antallPåVentEllerNull],
            x: ['På vent'],
            type: 'bar',
            text: antallPåVentEllerNull.toString(),
            textposition: 'outside',
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
