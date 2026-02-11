import { UnderveisgrunnlagMedDataFetching } from 'components/behandlinger/underveis/underveisgrunnlag/UnderveisgrunnlagMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { IkkeOppfyltMeldepliktMedDataFetching } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/IkkeOppfyltMeldepliktMedDataFetching';

interface Props {
  behandlingsreferanse: string;
  saksnummer: string;
}

export const Underveis = async ({ behandlingsreferanse, saksnummer }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <StegSuspense>
        <IkkeOppfyltMeldepliktMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.data.behandlingVersjon}
          readOnly={flyt.data.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>
      <StegSuspense>
        <UnderveisgrunnlagMedDataFetching
          readOnly={flyt.data.visning.saksbehandlerReadOnly}
          behandlingVersjon={flyt.data.behandlingVersjon}
          behandlingsreferanse={behandlingsreferanse}
          saksnummer={saksnummer}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
