import { DetaljertBehandling, StegGruppe } from 'lib/types/types';
import { SakContextProvider } from 'context/SakContext';
import { BodyShort, VStack } from '@navikt/ds-react';
import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';
import styles from 'app/saksbehandling/sak/[saksId]/[behandlingsReferanse]/[aktivGruppe]/page.module.css';
import { hentFlyt, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
  aktivGruppe: StegGruppe;
  saksId: string;
  behandling: DetaljertBehandling;
}

export const BehandlingPage = async ({ behandlingsReferanse, aktivGruppe, saksId, behandling }: Props) => {
  const [flytResponse, sak] = await Promise.all([hentFlyt(behandlingsReferanse), hentSak(saksId)]);

  if (isError(flytResponse)) {
    return (
      <VStack padding={'4'}>
        <ApiException apiResponses={[flytResponse]} />
      </VStack>
    );
  }

  const ferdigeSteg = flytResponse.data.flyt.filter((steg) => steg.erFullført).map((steg) => steg.stegGruppe);

  const stegIkkeVurdertEnda =
    !ferdigeSteg.includes(decodeURIComponent(aktivGruppe) as StegGruppe) &&
    flytResponse.data.aktivGruppe != decodeURIComponent(aktivGruppe);

  return (
    <SakContextProvider
      sak={{
        saksnummer: sak.saksnummer,
        periode: sak.periode,
        ident: sak.ident,
        opprettetTidspunkt: sak.opprettetTidspunkt,
        virkningsTidspunkt: behandling.virkningstidspunkt,
      }}
    >
      {stegIkkeVurdertEnda ? (
        <BodyShort>Dette steget er ikke vurdert enda.</BodyShort>
      ) : (
        <OppgaveKolonne
          className={styles.oppgavekolonne}
          saksnummer={sak.saksnummer}
          behandlingsReferanse={behandlingsReferanse}
          aktivGruppe={decodeURIComponent(aktivGruppe) as StegGruppe}
        />
      )}
    </SakContextProvider>
  );
};
