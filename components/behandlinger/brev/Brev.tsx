import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SkriveBrevMedDataFetching } from 'components/behandlinger/brev/skriveBrev/SkriveBrevMedDataFetching';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SkriveKlageBrevMedDataFetching } from 'components/behandlinger/brev/skriveBrev/SkriveKlageBrevMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Brev = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const typeBehandling = flyt.data.visning.typeBehandling;

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <StegSuspense>
        {typeBehandling === 'Klage' ? (
          <SkriveKlageBrevMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            aktivtSteg={flyt.data.aktivtSteg}
          />
        ) : (
          <SkriveBrevMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            aktivtSteg={flyt.data.aktivtSteg}
          />
        )}
      </StegSuspense>
    </GruppeSteg>
  );
};
