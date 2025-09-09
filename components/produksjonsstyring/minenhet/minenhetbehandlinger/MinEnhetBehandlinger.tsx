import { Box, Heading, VStack } from '@navikt/ds-react';
import styles from 'components/produksjonsstyring/totaloversiktbehandlinger/TotaloversiktBehandlinger.module.css';
import { isSuccess } from 'lib/utils/api';
import { BehandlingerInnUt } from 'components/produksjonsstyring/behandlingerinnut/BehandlingerInnUt';
import { ApneBehandlinger } from 'components/produksjonsstyring/åpnebehandlinger/ÅpneBehandlinger';
import { TypeBehandlinger } from 'components/produksjonsstyring/typebehandlinger/TypeBehandlinger';
import { FordelingÅpneBehandlingerPerDag } from 'components/produksjonsstyring/fordelingåpnebehandlingerperdag/FordelingÅpneBehandlingerPerDag';
import { FordelingLukkedeBehandlingerPerDag } from 'components/produksjonsstyring/fordelinglukkedebehandlingerperdag/FordelingLukkedeBehandlingerPerDag';
import { VenteÅrsaker } from 'components/produksjonsstyring/venteårsaker/VenteÅrsaker';
import { VurderingsbehovPåBehandlinger } from 'components/produksjonsstyring/vurderingsbehov/VurderingsbehovPåBehandlinger';
import useSWR from 'swr';
import {
  antallÅpneBehandlingerMedReturPerAvklaringsbehovClient,
  antallÅpneBehandlingerPerBehandlingstypeClient,
  behandlingerUtviklingClient,
  fordelingLukkedeBehandlingerClient,
  fordelingÅpneBehandlingerClient,
  venteÅrsakerClient,
  årsakTilBehandlingClient,
} from 'lib/oppgaveClientApi';
import { useMemo } from 'react';
import { statistikkQueryparams } from 'lib/utils/request';
import { useProduksjonsstyringFilter } from 'hooks/produksjonsstyring/ProduksjonsstyringFilterHook';
import { AvklaringsbehovReturer } from 'components/produksjonsstyring/avklaringsbehovreturer/AvklaringsbehovReturer';
import { isDev } from 'lib/utils/environment';

interface Props {
  listeVisning: boolean;
  aktivEnhet: string;
}

const antallDager = 14;

export const MinEnhetBehandlinger = ({ listeVisning, aktivEnhet }: Props) => {
  const { filter } = useProduksjonsstyringFilter();

  const behandlingstyperQuery = useMemo(
    () =>
      statistikkQueryparams({
        behandlingstyper: filter.behandlingstyper,
        ...(aktivEnhet ? { enheter: [aktivEnhet] } : {}),
      }),
    [filter, aktivEnhet]
  );

  const { data: antallÅpneBehandlinger } = useSWR(
    `/oppgave/api/statistikk/apne-behandlinger?${behandlingstyperQuery}`,
    antallÅpneBehandlingerPerBehandlingstypeClient
  );
  const { data: behandlingerUtvikling } = useSWR(
    `/oppgave/api/statistikk/behandlinger/utvikling?antallDager=${antallDager}&${behandlingstyperQuery}`,
    behandlingerUtviklingClient
  );
  const { data: fordelingÅpneBehandlinger } = useSWR(
    `/oppgave/api/statistikk/behandlinger/fordeling-apne-behandlinger?${behandlingstyperQuery}`,
    fordelingÅpneBehandlingerClient
  );
  const { data: fordelingLukkedeBehandlinger } = useSWR(
    `/oppgave/api/statistikk/behandlinger/fordeling-lukkede-behandlinger?${behandlingstyperQuery}`,
    fordelingLukkedeBehandlingerClient
  );
  const { data: venteÅrsaker } = useSWR(
    `/oppgave/api/statistikk/behandlinger/pa-vent?${behandlingstyperQuery}`,
    venteÅrsakerClient
  );
  const årsakerTilBehandling = useSWR(
    `/oppgave/api/statistikk/behandlinger/arsak-til-behandling?${behandlingstyperQuery}`,
    årsakTilBehandlingClient
  ).data;
  const { data: fordelingReturerPerAvklaringsbehov } = useSWR(
    `/oppgave/api/statistikk/behandlinger/retur?${behandlingstyperQuery}`,
    antallÅpneBehandlingerMedReturPerAvklaringsbehovClient
  );

  return (
    <Box
      background={'bg-default'}
      borderColor={'border-subtle'}
      borderWidth={'1'}
      padding={'8'}
      borderRadius={'medium'}
    >
      <VStack gap={'4'}>
        <Heading size={'large'} spacing>
          Behandlinger
        </Heading>
        <div className={listeVisning ? styles.plotList : styles.plotGrid}>
          {isSuccess(behandlingerUtvikling) && (
            <BehandlingerInnUt behandlingerEndringer={behandlingerUtvikling.data || []} />
          )}
          <ApneBehandlinger behandlingstyperQuery={behandlingstyperQuery} />
          {isSuccess(antallÅpneBehandlinger) && (
            <TypeBehandlinger åpneOgGjennomsnitt={antallÅpneBehandlinger.data || []} />
          )}
          {isSuccess(fordelingÅpneBehandlinger) && (
            <FordelingÅpneBehandlingerPerDag fordelingÅpneBehandlingerPerDag={fordelingÅpneBehandlinger.data || []} />
          )}
          {isSuccess(fordelingLukkedeBehandlinger) && (
            <FordelingLukkedeBehandlingerPerDag
              fordelingLukkedeBehandlinger={fordelingLukkedeBehandlinger.data || []}
            />
          )}
          {isSuccess(venteÅrsaker) && <VenteÅrsaker venteÅrsaker={venteÅrsaker.data || []} />}
        </div>
        {isDev() && isSuccess(fordelingReturerPerAvklaringsbehov) && (
          <AvklaringsbehovReturer data={fordelingReturerPerAvklaringsbehov.data || []} />
        )}
        <div className={listeVisning ? styles.plotList : styles.plotGrid}>
          {isSuccess(årsakerTilBehandling) && (
            <VurderingsbehovPåBehandlinger vurderingsbehov={årsakerTilBehandling.data || []} />
          )}
        </div>
      </VStack>
    </Box>
  );
};
