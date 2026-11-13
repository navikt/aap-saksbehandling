import { VStack } from '@navikt/ds-react';
import styles from 'app/saksbehandling/sak/[saksnummer]/[behandlingsreferanse]/layout.module.css';
import { IngenFlereOppgaverModalContextProvider } from 'context/saksbehandling/IngenFlereOppgaverModalContext';
import { OverstyrTildelingContextProvider } from 'context/saksbehandling/OverstyrTildelingContext';
import { hentOppgaveVisningsinfo } from 'lib/services/oppgaveservice/oppgaveservice';
import {
  auditlog,
  hentBehandling,
  hentBehandlingEgenskaper,
  hentFlyt,
  hentKabalKlageresultat,
  hentKlageresultat,
  hentRettighetsinfo,
  hentSak,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegGruppe } from 'lib/types/types';
import { isError, isSuccess } from 'lib/utils/api';
import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

import { Kolonnelayout } from 'components/behandling/Kolonnelayout';
import { IngenFlereOppgaverModal } from 'components/ingenflereoppgavermodal/IngenFlereOppgaverModal';
import { OverstyrTildelingModal } from 'components/overstyrtildelingmodal/OverstyrTildelingModal';
import { ÅrsakTilBehandling } from 'components/revurderingsinfo/ÅrsakTilBehandling';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { StegGruppeIndikatorAksel } from 'components/steggruppeindikator/StegGruppeIndikatorAksel';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';
import { unleashService } from 'lib/services/unleash/unleashService';

interface Props {
  saksnummer: string;
  behandlingsreferanse: string;
  children: ReactNode;
}

export const BehandlingLayout = async ({ saksnummer, behandlingsreferanse, children }: Props) => {
  const behandling = await hentBehandling(behandlingsreferanse);
  const vedtaksperiodeBeslutterEnabled = unleashService.isEnabled('VedtaksperiodeBeslutter');

  if (isError(behandling)) {
    return (
      <VStack padding={'space-16'}>
        <ApiException apiResponses={[behandling]} />
      </VStack>
    );
  }

  // noinspection ES6MissingAwait - trenger ikke vente på svar fra auditlog-kall
  auditlog(behandlingsreferanse);

  const [
    oppgaveVisningsinfo,
    flytResponse,
    sak,
    kabalKlageResultat,
    klageresultat,
    behandlingEgenskaper,
    rettighetsinfoRes,
  ] = await Promise.all([
    hentOppgaveVisningsinfo(behandlingsreferanse),
    hentFlyt(behandlingsreferanse),
    hentSak(saksnummer),
    hentKabalKlageresultat(behandlingsreferanse),
    hentKlageresultat(behandlingsreferanse),
    hentBehandlingEgenskaper(behandlingsreferanse),
    vedtaksperiodeBeslutterEnabled ? hentRettighetsinfo(saksnummer) : Promise.resolve(null),
  ]);

  if (isError(flytResponse) || isError(klageresultat) || isError(oppgaveVisningsinfo)) {
    return (
      <VStack padding={'space-16'}>
        <ApiException apiResponses={[flytResponse, klageresultat, oppgaveVisningsinfo]} />
      </VStack>
    );
  }

  const stegGrupperSomSkalVises: StegGruppe[] = flytResponse.data.flyt
    .filter((steg) => steg.skalVises)
    .map((stegSomSkalVises) => stegSomSkalVises.stegGruppe);

  const visTotrinnsvurdering =
    flytResponse.data.visning.visBeslutterKort || flytResponse.data.visning.visKvalitetssikringKort;

  const rettighetsinfo = rettighetsinfoRes && isSuccess(rettighetsinfoRes) ? rettighetsinfoRes.data : null;

  return (
    <SWRConfig
      value={{
        fallback: {
          [`api/flyt/${behandlingsreferanse}`]: flytResponse,
        },
      }}
    >
      <IngenFlereOppgaverModalContextProvider>
        <OverstyrTildelingContextProvider>
          <div className={styles.behandling}>
            <IngenFlereOppgaverModal />

            <OverstyrTildelingModal />

            <SaksinfoBanner
              behandling={behandling.data}
              sak={sak}
              oppgaveVisningsinfo={oppgaveVisningsinfo.data}
              flyt={flytResponse.data.flyt}
              visning={flytResponse.data.visning}
              behandlingEgenskaper={behandlingEgenskaper}
            />

            <StegGruppeIndikatorAksel
              flytRespons={flytResponse.data}
              stegGrupperSomSkalVises={stegGrupperSomSkalVises}
            />

            <Kolonnelayout
              visTotrinnsvurdering={visTotrinnsvurdering}
              toTrinnsvurdering={
                visTotrinnsvurdering ? (
                  <ToTrinnsvurderingMedDataFetching behandlingsreferanse={behandlingsreferanse} />
                ) : undefined
              }
              behandling={behandling.data}
              sak={sak}
              klageresultat={klageresultat.data}
              kabalKlageresultat={kabalKlageResultat}
              rettighetsinfo={rettighetsinfo}
              hovedkolonneInnhold={
                <VStack gap={'space-20'}>
                  <ÅrsakTilBehandling behandling={behandling.data} />
                  {/*Vi må ha children inne i en div for å unngå layoutshift*/}
                  <div style={{ width: '100%' }}>{children}</div>
                </VStack>
              }
            />
          </div>
        </OverstyrTildelingContextProvider>
      </IngenFlereOppgaverModalContextProvider>
    </SWRConfig>
  );
};
