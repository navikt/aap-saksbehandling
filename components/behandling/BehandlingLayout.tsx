import { SWRConfig } from 'swr';
import { IngenFlereOppgaverModalContextProvider } from 'context/saksbehandling/IngenFlereOppgaverModalContext';
import styles from 'app/saksbehandling/sak/[saksId]/[behandlingsReferanse]/layout.module.css';
import { IngenFlereOppgaverModal } from 'components/ingenflereoppgavermodal/IngenFlereOppgaverModal';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { StegGruppeIndikatorAksel } from 'components/steggruppeindikator/StegGruppeIndikatorAksel';
import { HGrid, VStack } from '@navikt/ds-react';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { Saksbehandlingsoversikt } from 'components/saksbehandlingsoversikt/Saksbehandlingsoversikt';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';
import { ReactNode } from 'react';
import {
  auditlog,
  hentBehandling,
  hentFlyt,
  hentKabalKlageresultat,
  hentKlageresultat,
  hentSak,
  hentSakPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentBrukerInformasjon, hentRollerForBruker, Roller } from 'lib/services/azure/azureUserService';
import { hentOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { StegGruppe } from 'lib/types/types';
import { SakContextProvider } from 'context/saksbehandling/SakContext';
import { KlageBehandlingInfo } from 'components/behandlingsinfo/KlageBehandlingInfo';
import { ÅrsakTilBehandling } from 'components/revurderingsinfo/ÅrsakTilBehandling';

interface Props {
  saksId: string;
  behandlingsReferanse: string;
  children: ReactNode;
}

export const BehandlingLayout = async ({ saksId, behandlingsReferanse, children }: Props) => {
  const behandling = await hentBehandling(behandlingsReferanse);

  if (isError(behandling)) {
    return (
      <VStack padding={'4'}>
        <ApiException apiResponses={[behandling]} />
      </VStack>
    );
  }

  // noinspection ES6MissingAwait - trenger ikke vente på svar fra auditlog-kall
  auditlog(behandlingsReferanse);

  const [oppgave, personInfo, brukerInformasjon, flytResponse, sak, roller, kabalKlageResultat, klageresultat] =
    await Promise.all([
      hentOppgave(behandlingsReferanse),
      hentSakPersoninfo(saksId),
      hentBrukerInformasjon(),
      hentFlyt(behandlingsReferanse),
      hentSak(saksId),
      hentRollerForBruker(),
      hentKabalKlageresultat(behandlingsReferanse),
      hentKlageresultat(behandlingsReferanse),
    ]);

  if (isError(flytResponse) || isError(klageresultat) || isError(oppgave)) {
    return (
      <VStack padding={'4'}>
        <ApiException apiResponses={[flytResponse, klageresultat, oppgave]} />
      </VStack>
    );
  }

  const brukerKanSaksbehandle = roller.some((rolle) =>
    [Roller.SAKSBEHANDLER_OPPFØLGING, Roller.SAKSBEHANDLER_NASJONAL].includes(rolle)
  );
  const brukerErBeslutter = roller.includes(Roller.BESLUTTER);

  const stegGrupperSomSkalVises: StegGruppe[] = flytResponse.data.flyt
    .filter((steg) => steg.skalVises)
    .map((stegSomSkalVises) => stegSomSkalVises.stegGruppe);

  const visTotrinnsvurdering =
    flytResponse.data.visning.visBeslutterKort || flytResponse.data.visning.visKvalitetssikringKort;

  const visÅrsakTilAktivitetspliktBehandling =
    ['Aktivitetsplikt', 'Aktivitetsplikt11_9'].includes(behandling.data.type) &&
    behandling.data.vurderingsbehovOgÅrsaker?.some((e) => e.årsak === 'OMGJØRING_ETTER_KLAGE');
  const visÅrsakTilRevurdering =
    behandling.data.vurderingsbehovOgÅrsaker.length > 0 && behandling.data.type != 'Førstegangsbehandling';
  const visÅrsakTilEndreStartstidspunkt = behandling.data.vurderingsbehovOgÅrsaker
    ?.flatMap((v) => v.vurderingsbehov)
    ?.some((v) => v.type === 'VURDER_RETTIGHETSPERIODE');

  const visÅrsakTilBehandling =
    visÅrsakTilAktivitetspliktBehandling || visÅrsakTilRevurdering || visÅrsakTilEndreStartstidspunkt;

  return (
    <SWRConfig
      value={{
        fallback: {
          [`api/flyt/${behandlingsReferanse}`]: flytResponse,
        },
      }}
    >
      <IngenFlereOppgaverModalContextProvider>
        <div className={styles.behandling}>
          <IngenFlereOppgaverModal />

          <SaksinfoBanner
            personInformasjon={personInfo}
            referanse={behandlingsReferanse}
            behandling={behandling.data}
            sak={sak}
            oppgave={oppgave.data}
            brukerInformasjon={brukerInformasjon}
            brukerKanSaksbehandle={brukerKanSaksbehandle}
            flyt={flytResponse.data.flyt}
            visning={flytResponse.data.visning}
            brukerErBeslutter={brukerErBeslutter}
          />

          <StegGruppeIndikatorAksel flytRespons={flytResponse.data} stegGrupperSomSkalVises={stegGrupperSomSkalVises} />

          <HGrid columns="4fr 2fr" padding={'4'} gap={'4'} maxWidth={'1680px'} marginInline={'auto'} marginBlock={'0'}>
            <SakContextProvider
              sak={{
                ident: sak.ident,
                opprettetTidspunkt: sak.opprettetTidspunkt,
                periode: sak.periode,
                saksnummer: sak.saksnummer,
                virkningsTidspunkt: behandling.data.virkningstidspunkt,
              }}
            >
              <VStack gap={'5'}>
                {visÅrsakTilBehandling && (
                  <ÅrsakTilBehandling
                    behandlingType={behandling.data.type}
                    vurderingsbehovOgÅrsaker={behandling.data.vurderingsbehovOgÅrsaker}
                  />
                )}
                {/*Vi må ha children inne i en div for å unngå layoutshift*/}
                <div style={{ width: '100%' }}>{children}</div>
              </VStack>
              <aside className={`flex-column`}>
                <Behandlingsinfo behandling={behandling.data} sak={sak} klageresultat={klageresultat.data} />
                <KlageBehandlingInfo kabalKlageResultat={kabalKlageResultat} klageresultat={klageresultat.data} />
                {visTotrinnsvurdering && (
                  <ToTrinnsvurderingMedDataFetching behandlingsReferanse={behandlingsReferanse} />
                )}
                <Saksbehandlingsoversikt />
              </aside>
            </SakContextProvider>
          </HGrid>
        </div>
      </IngenFlereOppgaverModalContextProvider>
    </SWRConfig>
  );
};
