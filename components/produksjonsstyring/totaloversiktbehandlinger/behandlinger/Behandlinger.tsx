import { Box, Heading } from '@navikt/ds-react';
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
  antallÅpneBehandlingerPerBehandlingstypeClient,
  behandlingerUtviklingClient,
  fordelingLukkedeBehandlingerClient,
  fordelingÅpneBehandlingerClient,
  venteÅrsakerClient,
  årsakTilBehandlingClient,
} from 'lib/oppgaveClientApi';

interface Props {
  behandlingstyperQuery: string;
  listeVisning: boolean;
}

const antallDager = 14;

export const Behandlinger = ({ behandlingstyperQuery, listeVisning }: Props) => {
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

  return (
    <Box
      background={'bg-default'}
      borderColor={'border-subtle'}
      borderWidth={'1'}
      padding={'8'}
      borderRadius={'medium'}
    >
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
          <FordelingLukkedeBehandlingerPerDag fordelingLukkedeBehandlinger={fordelingLukkedeBehandlinger.data || []} />
        )}
        {isSuccess(venteÅrsaker) && <VenteÅrsaker venteÅrsaker={venteÅrsaker.data || []} />}
        {isSuccess(årsakerTilBehandling) && (
          <VurderingsbehovPåBehandlinger vurderingsbehov={årsakerTilBehandling.data || []} />
        )}
      </div>
    </Box>
  );
};
