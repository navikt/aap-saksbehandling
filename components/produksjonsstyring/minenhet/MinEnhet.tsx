'use client';

import { Box, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { statistikkQueryparams } from 'lib/utils/request';
import useSWR from 'swr';
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
import { VurderingsbehovPåBehandlinger } from 'components/produksjonsstyring/vurderingsbehov/VurderingsbehovPåBehandlinger';
import styles from './MinEnhet.module.css';
import { BulletListIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { Enhet } from 'lib/types/oppgaveTypes';
import { EnhetSelect } from 'components/oppgaveliste/enhetselect/EnhetSelect';

import { isSuccess } from 'lib/utils/api';
import { useLagreAktivEnhet } from 'hooks/oppgave/aktivEnhetHook';
import { OppgaverInnUt } from '../oppgaverinnut/OppgaverInnUt';
import { useProduksjonsstyringFilter } from 'components/produksjonsstyring/allefiltereprovider/ProduksjonsstyringFilterHook';

interface Props {
  enheter: Array<Enhet>;
}

export const MinEnhet = ({ enheter }: Props) => {
  const { hentLagretAktivEnhet, lagreAktivEnhet } = useLagreAktivEnhet();
  const antallDager = 14;

  const [listeVisning, setListeVisning] = useState<boolean>(false);
  const [aktivEnhet, setAktivEnhet] = useState<string>(hentLagretAktivEnhet() ?? enheter[0]?.enhetNr ?? '');
  const { filter } = useProduksjonsstyringFilter();

  const behandlingstyperQuery = useMemo(
    () =>
      statistikkQueryparams({
        behandlingstyper: filter.behandlingstyper,
        ...(aktivEnhet ? { enheter: [aktivEnhet] } : {}),
      }),
    [filter, aktivEnhet]
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
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Førstegangsbehandling&enheter=${aktivEnhet}`,
    behandlingerPerSteggruppeClient
  ).data;
  const klageBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Klage&enheter=${aktivEnhet}`,
    behandlingerPerSteggruppeClient
  ).data;
  const revurderingBehandlingerPerSteggruppe = useSWR(
    `/oppgave/api/statistikk/behandling-per-steggruppe?behandlingstyper=Revurdering&enheter=${aktivEnhet}`,
    behandlingerPerSteggruppeClient
  ).data;

  return (
    <HGrid columns={'1fr 6fr'}>
      <FilterSamling />
      <VStack padding={'5'} gap={'5'}>
        <Box
          background={'bg-default'}
          borderColor={'border-subtle'}
          borderWidth={'1'}
          padding={'4'}
          borderRadius={'medium'}
        >
          <HStack justify={'space-between'} align={'center'}>
            <EnhetSelect enheter={enheter} aktivEnhet={aktivEnhet} setAktivEnhet={oppdaterEnhet} />
            <Button
              variant={'secondary'}
              icon={listeVisning ? <MenuGridIcon /> : <BulletListIcon />}
              className={'fit-content'}
              size={'small'}
              onClick={() => setListeVisning(!listeVisning)}
            >
              {listeVisning ? 'Gridvisning' : 'Listevisning'}
            </Button>
          </HStack>
        </Box>
        <VStack gap={'4'}>
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
                <FordelingÅpneBehandlingerPerDag
                  fordelingÅpneBehandlingerPerDag={fordelingÅpneBehandlinger.data || []}
                />
              )}
              {isSuccess(fordelingLukkedeBehandlinger) && (
                <FordelingLukkedeBehandlingerPerDag
                  fordelingLukkedeBehandlinger={fordelingLukkedeBehandlinger.data || []}
                />
              )}
              {isSuccess(venteÅrsaker) && <VenteÅrsaker venteÅrsaker={venteÅrsaker.data || []} />}
              {isSuccess(årsakerTilBehandling) && (
                <VurderingsbehovPåBehandlinger vurderingsbehov={årsakerTilBehandling.data || []} />
              )}
            </div>
          </Box>
          <Box
            background={'bg-default'}
            borderColor={'border-subtle'}
            borderWidth={'1'}
            padding={'8'}
            borderRadius={'medium'}
          >
            <Heading size={'large'} spacing>
              Oppgaver
            </Heading>
            <div className={listeVisning ? styles.plotList : styles.plotGrid}>
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
              <OppgaverInnUt behandlingstyperQuery={behandlingstyperQuery} />
            </div>
          </Box>
        </VStack>
      </VStack>
    </HGrid>
  );
};
