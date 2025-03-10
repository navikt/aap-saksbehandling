'use client';

import { HGrid, HStack, VStack } from '@navikt/ds-react';
import { useContext, useMemo } from 'react';
import { statistikkQueryparams } from 'lib/utils/request';
import useSWR from 'swr';
import { AlleFiltereContext } from '../allefiltereprovider/AlleFiltereProvider';
import {
  antallÅpneBehandlingerPerBehandlingstypeClient,
  behandlingerPerSteggruppeClient,
  behandlingerUtviklingClient,
  fordelingLukkedeBehandlingerClient,
  fordelingÅpneBehandlingerClient,
  venteÅrsakerClient,
  årsakTilBehandlingClient,
} from 'lib/oppgaveClientApi';
import { FilterSamling } from '../filtersamling/FilterSamling';
import { BehandlingerInnUt } from '../behandlingerinnut/BehandlingerInnUt';
import { ApneBehandlinger } from 'components/produksjonsstyring/åpnebehandlinger/ÅpneBehandlinger';
import { TypeBehandlinger } from 'components/produksjonsstyring/typebehandlinger/TypeBehandlinger';
import { FordelingÅpneBehandlingerPerDag } from 'components/produksjonsstyring/fordelingåpnebehandlingerperdag/FordelingÅpneBehandlingerPerDag';
import { FordelingLukkedeBehandlingerPerDag } from 'components/produksjonsstyring/fordelinglukkedebehandlingerperdag/FordelingLukkedeBehandlingerPerDag';
import { VenteÅrsaker } from 'components/produksjonsstyring/venteårsaker/VenteÅrsaker';
import { BehandlingerPerSteggruppe } from '../behandlingerpersteggruppe/BehandlingerPerSteggruppe';
import { ÅrsakTilBehandling } from 'components/produksjonsstyring/årsaktilbehandling/ÅrsakTilBehandling';
import { ValgteEnheterContext } from 'components/oppgave/valgteenheterprovider/ValgteEnheterProvider';

export const MinEnhet = () => {
  const valgteEnheter = useContext(ValgteEnheterContext);
  const alleFiltere = useContext(AlleFiltereContext);
  const behandlingstyperQuery = useMemo(
    () =>
      statistikkQueryparams({
        behandlingstyper: alleFiltere.behandlingstyper,
        enheter: valgteEnheter,
      }),
    [alleFiltere, valgteEnheter]
  );

  const antallÅpneBehandlinger = useSWR(
    `/oppgave/api/statistikk/apne-behandlinger?${behandlingstyperQuery}`,
    antallÅpneBehandlingerPerBehandlingstypeClient
  ).data;
  const behandlingerUtvikling = useSWR(
    `/oppgave/api/statistikk/behandlinger/utvikling?antallDager=${0}&${behandlingstyperQuery}`,
    behandlingerUtviklingClient
  ).data;
  const fordelingÅpneBehandlinger = useSWR(
    `/oppgave/api/statistikk/behandlinger/fordeling-apne-behandlinger?${behandlingstyperQuery}`,
    fordelingÅpneBehandlingerClient
  ).data;
  const fordelingLukkedeBehandlinger = useSWR(
    `/oppgave/api/statistikk/behandlinger/fordeling-lukkede-behandlinger?${behandlingstyperQuery}`,
    fordelingLukkedeBehandlingerClient
  ).data;
  const venteÅrsaker = useSWR(
    `/oppgave/api/statistikk/behandlinger/pa-vent?${behandlingstyperQuery}`,
    venteÅrsakerClient
  ).data;
  const antallPåVent =
    venteÅrsaker && venteÅrsaker.type === 'success'
      ? venteÅrsaker.data?.map((årsak) => årsak.antall).reduce((acc, curr) => acc + curr, 0)
      : undefined;
  const behandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?${behandlingstyperQuery}`,
    behandlingerPerSteggruppeClient
  ).data;
  const årsakerTilBehandling = useSWR(
    `/oppgave/api/statistikk/behandlinger/arsak-til-behandling?${behandlingstyperQuery}`,
    årsakTilBehandlingClient
  ).data;
  return (
    <HGrid columns={'1fr 6fr'}>
      <FilterSamling />
      <VStack padding={'5'} gap={'5'}>
        <HStack gap={'4'}>
          {behandlingerUtvikling?.type === 'success' && (
            <BehandlingerInnUt behandlingerEndringer={behandlingerUtvikling.data || []} />
          )}
          {antallÅpneBehandlinger?.type === 'success' && (
            <ApneBehandlinger antallPåVent={antallPåVent} åpneOgGjennomsnitt={antallÅpneBehandlinger.data || []} />
          )}
          {antallÅpneBehandlinger?.type === 'success' && (
            <TypeBehandlinger åpneOgGjennomsnitt={antallÅpneBehandlinger.data || []} />
          )}
          {fordelingÅpneBehandlinger?.type === 'success' && (
            <FordelingÅpneBehandlingerPerDag fordelingÅpneBehandlingerPerDag={fordelingÅpneBehandlinger.data || []} />
          )}
          {fordelingLukkedeBehandlinger?.type === 'success' && (
            <FordelingLukkedeBehandlingerPerDag
              fordelingLukkedeBehandlinger={fordelingLukkedeBehandlinger.data || []}
            />
          )}
          {venteÅrsaker?.type === 'success' && <VenteÅrsaker venteÅrsaker={venteÅrsaker.data || []} />}
          {behandlingerPerSteggruppe?.type === 'success' && (
            <BehandlingerPerSteggruppe data={behandlingerPerSteggruppe.data || []} />
          )}
          {årsakerTilBehandling?.type === 'success' && (
            <ÅrsakTilBehandling årsakTilBehandling={årsakerTilBehandling.data || []} />
          )}
        </HStack>
      </VStack>
    </HGrid>
  );
};
