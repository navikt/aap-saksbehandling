import { ReactNode } from 'react';
import {
  auditlog,
  hentBehandling,
  hentFlyt,
  hentSak,
  hentSakPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { HGrid, VStack } from '@navikt/ds-react';

import { StegGruppeIndikatorAksel } from 'components/steggruppeindikator/StegGruppeIndikatorAksel';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { StegGruppe } from 'lib/types/types';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { hentBrukerInformasjon, hentRollerForBruker, Roller } from 'lib/services/azure/azureUserService';
import { logWarning } from 'lib/serverutlis/logger';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError, isSuccess } from 'lib/utils/api';

import styles from './layout.module.css';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';
import { IngenFlereOppgaverModalContextProvider } from 'context/IngenFlereOppgaverModalContext';
import { IngenFlereOppgaverModal } from 'components/ingenflereoppgavermodal/IngenFlereOppgaverModal';
import { Saksbehandlingsoversikt } from 'components/saksbehandlingsoversikt/Saksbehandlingsoversikt';
import { SWRConfig } from 'swr';

interface Props {
  children: ReactNode;
  params: Promise<{ saksId: string; behandlingsReferanse: string }>;
}

const Layout = async (props: Props) => {
  const params = await props.params;

  const { children } = props;

  const behandling = await hentBehandling(params.behandlingsReferanse);

  if (isError(behandling)) {
    return (
      <VStack padding={'4'}>
        <ApiException apiResponses={[behandling]} />
      </VStack>
    );
  }

  // noinspection ES6MissingAwait - trenger ikke vente på svar fra auditlog-kall
  auditlog(params.behandlingsReferanse);

  const [personInfo, brukerInformasjon, flytResponse, sak, roller] = await Promise.all([
    hentSakPersoninfo(params.saksId),
    hentBrukerInformasjon(),
    hentFlyt(params.behandlingsReferanse),
    hentSak(params.saksId),
    hentRollerForBruker(),
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
    oppgave = oppgavesøkRes.data.find((oppgave) => oppgave.behandlingRef === params.behandlingsReferanse);
  } else {
    logWarning('henting av oppgave for behandling feilet', oppgavesøkRes.apiException);
  }

  const stegGrupperSomSkalVises: StegGruppe[] = flytResponse.data.flyt
    .filter((steg) => steg.skalVises)
    .map((stegSomSkalVises) => stegSomSkalVises.stegGruppe);

  return (
    <SWRConfig
      value={{
        fallback: {
          [`api/flyt/${params.behandlingsReferanse}`]: flytResponse,
        },
      }}
    >
      <IngenFlereOppgaverModalContextProvider>
        <div className={styles.behandling}>
          <IngenFlereOppgaverModal />

          <SaksinfoBanner
            personInformasjon={personInfo}
            referanse={params.behandlingsReferanse}
            behandling={behandling.data}
            sak={sak}
            oppgaveReservertAv={oppgave?.reservertAv}
            påVent={flytResponse.data.visning.visVentekort}
            brukerInformasjon={brukerInformasjon}
            typeBehandling={flytResponse.data.visning.typeBehandling}
            brukerKanSaksbehandle={brukerKanSaksbehandle}
            flyt={flytResponse.data.flyt}
          />

          <StegGruppeIndikatorAksel flytRespons={flytResponse.data} stegGrupperSomSkalVises={stegGrupperSomSkalVises} />

          <HGrid columns="4fr 2fr" padding={'4'} gap={'4'}>
            {/*Vi må ha children inne i en div for å unngå layoutshift*/}
            <div style={{ width: '100%' }}>{children}</div>
            <aside className={`flex-column`}>
              <Behandlingsinfo behandling={behandling.data} saksnummer={params.saksId} />
              <Saksbehandlingsoversikt />
              <ToTrinnsvurderingMedDataFetching behandlingsReferanse={params.behandlingsReferanse} />
            </aside>
          </HGrid>
        </div>
      </IngenFlereOppgaverModalContextProvider>
    </SWRConfig>
  );
};

export default Layout;
