import { StegGruppe } from 'lib/types/types';
import { BodyShort, VStack } from '@navikt/ds-react';
import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';
import styles from 'app/saksbehandling/sak/[saksId]/[behandlingsReferanse]/[aktivGruppe]/page.module.css';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
  aktivGruppe: StegGruppe;
}

export const BehandlingPage = async ({ behandlingsReferanse, aktivGruppe }: Props) => {
  const flytResponse = await hentFlyt(behandlingsReferanse);

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

  return stegIkkeVurdertEnda ? (
    <BodyShort>Dette steget er ikke vurdert enda.</BodyShort>
  ) : (
    <OppgaveKolonne
      className={styles.oppgavekolonne}
      behandlingsReferanse={behandlingsReferanse}
      aktivGruppe={decodeURIComponent(aktivGruppe) as StegGruppe}
    />
  );
};
