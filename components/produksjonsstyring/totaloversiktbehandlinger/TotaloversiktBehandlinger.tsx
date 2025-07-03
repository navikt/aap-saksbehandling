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
  const antallPåVent = isSuccess(venteÅrsaker)
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
        <Button
          variant={'secondary'}
          icon={listeVisning ? <MenuGridIcon /> : <BulletListIcon />}
          className={'fit-content'}
          onClick={() => setListeVisning(!listeVisning)}
        >
          {listeVisning ? 'Gridvisning' : 'Listevisning'}
        </Button>
        <div className={listeVisning ? styles.plotList : styles.plotGrid}>
          {isSuccess(behandlingerUtvikling) && (
            <BehandlingerInnUt behandlingerEndringer={behandlingerUtvikling.data || []} />
          )}
          {isSuccess(antallÅpneBehandlinger) && (
            <ApneBehandlinger antallPåVent={antallPåVent} åpneOgGjennomsnitt={antallÅpneBehandlinger.data || []} />
          )}
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
          {isSuccess(behandlingerPerSteggruppe) && (
            <BehandlingerPerSteggruppe data={behandlingerPerSteggruppe.data || []} />
          )}
          {isSuccess(årsakerTilBehandling) && (
            <ÅrsakTilBehandling årsakTilBehandling={årsakerTilBehandling.data || []} />
          )}
        </div>
      </VStack>
    </HGrid>
  );
};
