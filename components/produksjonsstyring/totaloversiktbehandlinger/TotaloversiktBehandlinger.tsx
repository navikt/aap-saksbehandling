'use client';

import { Button, HGrid, VStack } from '@navikt/ds-react';
import { useContext, useMemo, useState } from 'react';
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
import { BehandlingerPerSteggruppe } from 'components/produksjonsstyring/behandlingerpersteggruppe/BehandlingerPerSteggruppe';
import { ÅrsakTilBehandling } from 'components/produksjonsstyring/årsaktilbehandling/ÅrsakTilBehandling';
import styles from './TotaloversiktBehandlinger.module.css';
import { BulletListIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { isSuccess } from 'lib/utils/api';

export const TotaloversiktBehandlinger = () => {
  const [listeVisning, setListeVisning] = useState<boolean>(false);
  const alleFiltere = useContext(AlleFiltereContext);
  const antallDager = 14;
  const behandlingstyperQuery = useMemo(
    () => statistikkQueryparams({ behandlingstyper: alleFiltere.behandlingstyper }),
    [alleFiltere]
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
  const behandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?${behandlingstyperQuery}`,
    behandlingerPerSteggruppeClient
  ).data;
  const førstegangsBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Førstegangsbehandling`,
    behandlingerPerSteggruppeClient
  ).data;
  const klageBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Klage`,
    behandlingerPerSteggruppeClient
  ).data;
  const revurderingBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Revurdering`,
    behandlingerPerSteggruppeClient
  ).data;

  return (
    <HGrid columns={'1fr 6fr'}>
      <FilterSamling />
      <VStack padding={'5'} gap={'5'}>
        <VStack align={'end'}>
          <Button
            variant={'secondary'}
            icon={listeVisning ? <MenuGridIcon /> : <BulletListIcon />}
            className={'fit-content'}
            size={'small'}
            onClick={() => setListeVisning(!listeVisning)}
          >
            {listeVisning ? 'Gridvisning' : 'Listevisning'}
          </Button>
        </VStack>

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
          {isSuccess(årsakerTilBehandling) && (
            <ÅrsakTilBehandling årsakTilBehandling={årsakerTilBehandling.data || []} />
          )}
          {isSuccess(behandlingerPerSteggruppe) && (
            <BehandlingerPerSteggruppe
              data={behandlingerPerSteggruppe.data || []}
              title={'Stegfordeling behandling og revurdering'}
            />
          )}
          {isSuccess(førstegangsBehandlingerPerSteggruppe) && (
            <BehandlingerPerSteggruppe
              data={førstegangsBehandlingerPerSteggruppe.data || []}
              title={'Stegfordeling førstegangsbehandling'}
            />
          )}
          {isSuccess(klageBehandlingerPerSteggruppe) && (
            <BehandlingerPerSteggruppe
              data={klageBehandlingerPerSteggruppe.data || []}
              title={'Stegfordeling klagebehandlinger'}
            />
          )}
          {isSuccess(revurderingBehandlingerPerSteggruppe) && (
            <BehandlingerPerSteggruppe
              data={revurderingBehandlingerPerSteggruppe.data || []}
              title={'Stegfordeling revurderingbehandlinger'}
            />
          )}
        </div>
      </VStack>
    </HGrid>
  );
};
