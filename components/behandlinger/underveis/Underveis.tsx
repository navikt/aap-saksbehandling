import { UnderveisgrunnlagMedDataFetching } from 'components/behandlinger/underveis/underveisgrunnlag/UnderveisgrunnlagMedDatafetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { IkkeOppfyltMeldepliktMedDataFetching } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/IkkeOppfyltMeldepliktMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Underveis = async ({ behandlingsreferanse, flyt }: Props) => {
  return (
    <GruppeSteg
      behandlingVersjon={flyt.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      <StegSuspense>
        <IkkeOppfyltMeldepliktMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          behandlingVersjon={flyt.behandlingVersjon}
          readOnly={flyt.visning.saksbehandlerReadOnly}
        />
      </StegSuspense>
      <StegSuspense>
        <UnderveisgrunnlagMedDataFetching
          readOnly={flyt.visning.saksbehandlerReadOnly}
          behandlingVersjon={flyt.behandlingVersjon}
          behandlingsreferanse={behandlingsreferanse}
        />
      </StegSuspense>
    </GruppeSteg>
  );
};
