import { SWRConfig } from 'swr';
import { IngenFlereOppgaverModalContextProvider } from 'context/IngenFlereOppgaverModalContext';
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
  hentSak,
  hentSakPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError, isSuccess } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentBrukerInformasjon, hentRollerForBruker, Roller } from 'lib/services/azure/azureUserService';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { logWarning } from 'lib/serverutlis/logger';
import { utledAdressebeskyttelse } from 'lib/utils/adressebeskyttelse';
import { StegGruppe } from 'lib/types/types';
import { SakContextProvider } from 'context/SakContext';
import { KlageBehandlingInfo } from 'components/behandlingsinfo/KlageBehandlingInfo';

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

  const [personInfo, brukerInformasjon, flytResponse, sak, roller, kabalKlageResultat] = await Promise.all([
    hentSakPersoninfo(saksId),
    hentBrukerInformasjon(),
    hentFlyt(behandlingsReferanse),
    hentSak(saksId),
    hentRollerForBruker(),
    hentKabalKlageresultat(behandlingsReferanse),
  ]);

  if (isError(flytResponse)) {
    return (
      <VStack padding={'4'}>
        <ApiException apiResponses={[flytResponse]} />
      </VStack>
    );
  }

  const brukerKanSaksbehandle = roller.some((rolle) =>
    [Roller.SAKSBEHANDLER_OPPFØLGING, Roller.SAKSBEHANDLER_NASJONAL].includes(rolle)
  );

  let oppgave;

  const oppgavesøkRes = await oppgaveTekstSøk(personInfo.fnr);
  if (isSuccess(oppgavesøkRes)) {
    oppgave = oppgavesøkRes.data.oppgaver.find((oppgave) => oppgave.behandlingRef === behandlingsReferanse);
  } else {
    logWarning('henting av oppgave for behandling feilet', oppgavesøkRes.apiException);
  }

  const adressebeskyttelser = utledAdressebeskyttelse(oppgave);

  const stegGrupperSomSkalVises: StegGruppe[] = flytResponse.data.flyt
    .filter((steg) => steg.skalVises)
    .map((stegSomSkalVises) => stegSomSkalVises.stegGruppe);

  const visTotrinnsvurdering =
    flytResponse.data.visning.visBeslutterKort || flytResponse.data.visning.visKvalitetssikringKort;
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
            oppgaveReservertAv={oppgave?.reservertAv}
            påVent={flytResponse.data.visning.visVentekort}
            brukerInformasjon={brukerInformasjon}
            typeBehandling={flytResponse.data.visning.typeBehandling}
            brukerKanSaksbehandle={brukerKanSaksbehandle}
            flyt={flytResponse.data.flyt}
            adressebeskyttelser={adressebeskyttelser}
            harUlesteDokumenter={oppgave?.harUlesteDokumenter}
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
              {/*Vi må ha children inne i en div for å unngå layoutshift*/}
              <div style={{ width: '100%' }}>{children}</div>
              <aside className={`flex-column`}>
                <Behandlingsinfo behandling={behandling.data} sak={sak} />
                <KlageBehandlingInfo kabalKlageResultat={kabalKlageResultat} />
                <Saksbehandlingsoversikt />
                {visTotrinnsvurdering && (
                  <ToTrinnsvurderingMedDataFetching behandlingsReferanse={behandlingsReferanse} />
                )}
              </aside>
            </SakContextProvider>
          </HGrid>
        </div>
      </IngenFlereOppgaverModalContextProvider>
    </SWRConfig>
  );
};
