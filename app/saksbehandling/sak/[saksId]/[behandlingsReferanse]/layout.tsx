import { ReactNode } from 'react';
import {
  auditlog,
  hentBehandling,
  hentFlyt,
  hentSak,
  hentSakPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { VStack } from '@navikt/ds-react';

import { StegGruppeIndikatorAksel } from 'components/steggruppeindikator/StegGruppeIndikatorAksel';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { StegGruppe } from 'lib/types/types';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { logWarning } from 'lib/serverutlis/logger';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

import styles from './layout.module.css';

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

  const [personInfo, brukerInformasjon, flytResponse, sak] = await Promise.all([
    hentSakPersoninfo(params.saksId),
    hentBrukerInformasjon(),
    hentFlyt(params.behandlingsReferanse),
    hentSak(params.saksId),
  ]);

  if (isError(flytResponse)) {
    return (
      <VStack padding={'4'}>
        <ApiException apiResponses={[flytResponse]} />
      </VStack>
    );
  }

  let oppgave;

  try {
    const oppgaver = await oppgaveTekstSøk(personInfo.fnr);
    oppgave = oppgaver.find((oppgave) => oppgave.behandlingRef === params.behandlingsReferanse);
  } catch (err: unknown) {
    logWarning('henting av oppgave for behandling feilet', err);
  }

  const stegGrupperSomSkalVises: StegGruppe[] = flytResponse.data.flyt
    .filter((steg) => steg.skalVises)
    .map((stegSomSkalVises) => stegSomSkalVises.stegGruppe);

  return (
    <div className={styles.behandling}>
      <SaksinfoBanner
        personInformasjon={personInfo}
        referanse={params.behandlingsReferanse}
        behandling={behandling.data}
        sak={sak}
        oppgaveReservertAv={oppgave?.reservertAv}
        påVent={flytResponse.data.visning.visVentekort}
        brukerInformasjon={brukerInformasjon}
        typeBehandling={flytResponse.data.visning.typeBehandling}
      />

      <StegGruppeIndikatorAksel flytRespons={flytResponse.data} stegGrupperSomSkalVises={stegGrupperSomSkalVises} />

      {children}
    </div>
  );
};

export default Layout;
