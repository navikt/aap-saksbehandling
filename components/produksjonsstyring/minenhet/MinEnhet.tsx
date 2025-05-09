'use client';

import { Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
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
import { BehandlingerPerSteggruppe } from '../behandlingerpersteggruppe/BehandlingerPerSteggruppe';
import { ÅrsakTilBehandling } from 'components/produksjonsstyring/årsaktilbehandling/ÅrsakTilBehandling';
import styles from './MinEnhet.module.css';
import { BulletListIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Enhet } from 'lib/types/oppgaveTypes';
import { EnhetSelect } from 'components/oppgaveliste/enhetselect/EnhetSelect';
import { hentLagretAktivEnhet, lagreAktivEnhet } from 'lib/utils/aktivEnhet';
import { isSuccess } from 'lib/utils/api';

interface Props {
  enheter: Array<Enhet>;
}

export const MinEnhet = ({ enheter }: Props) => {
  const [listeVisning, setListeVisning] = useState<boolean>(false);
  const [aktivEnhet, setAktivEnhet] = useState<string>(hentLagretAktivEnhet() ?? enheter[0]?.enhetNr ?? '');
  const alleFiltere = useContext(AlleFiltereContext);

  const behandlingstyperQuery = useMemo(
    () =>
      statistikkQueryparams({
        behandlingstyper: alleFiltere.behandlingstyper,
        ...(aktivEnhet ? { enheter: [aktivEnhet] } : {}),
      }),
    [alleFiltere, aktivEnhet]
  );

  const oppdaterEnhet = (enhetsnr: string) => {
    setAktivEnhet(enhetsnr);
    lagreAktivEnhet(enhetsnr);
  };

  const { data: antallÅpneBehandlinger } = useSWR(
    `/oppgave/api/statistikk/apne-behandlinger?${behandlingstyperQuery}`,
    antallÅpneBehandlingerPerBehandlingstypeClient
  );
  const { data: behandlingerUtvikling } = useSWR(
    `/oppgave/api/statistikk/behandlinger/utvikling?antallDager=${0}&${behandlingstyperQuery}`,
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
        <HStack gap={'5'}>
          <Heading level={'2'} size={'large'}>
            Min enhet
          </Heading>
          <Button
            variant={'secondary'}
            icon={listeVisning ? <MenuGridIcon /> : <BulletListIcon />}
            onClick={() => setListeVisning(!listeVisning)}
          >
            {listeVisning ? 'Gridvisning' : 'Listevisning'}
          </Button>
        </HStack>
        <HStack>
          <EnhetSelect enheter={enheter} aktivEnhet={aktivEnhet} valgtEnhetListener={oppdaterEnhet} />
        </HStack>
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
