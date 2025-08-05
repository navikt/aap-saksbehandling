import { AktivitetspliktMedDatafetching } from 'components/behandlinger/underveis/aktivitetsplikt/AktivitetspliktMedDatafetching';
import { UnderveisgrunnlagMedDataFetching } from 'components/behandlinger/underveis/underveisgrunnlag/UnderveisgrunnlagMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { IkkeOppfyltMeldepliktMedDataFetching } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/IkkeOppfyltMeldepliktMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const Underveis = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('UNDERVEIS', flyt.data);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <StegSuspense>
        <IkkeOppfyltMeldepliktMedDataFetching behandlingsreferanse={behandlingsreferanse} />
      </StegSuspense>
      {stegSomSkalVises.includes('EFFEKTUER_11_7') && (
        <StegSuspense>
          <AktivitetspliktMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
      <StegSuspense>
        <UnderveisgrunnlagMedDataFetching behandlingsreferanse={behandlingsreferanse} />
      </StegSuspense>
    </GruppeSteg>
  );
};
