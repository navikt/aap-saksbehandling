import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { SkriveBrevMedDataFetching } from 'components/behandlinger/brev/skriveBrev/SkriveBrevMedDataFetching';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SkriveKlageBrevMedDataFetching } from 'components/behandlinger/brev/skriveBrev/SkriveKlageBrevMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const Brev = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const typeBehandling = flyt.data.visning.typeBehandling;

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <StegSuspense>
        {typeBehandling === 'Klage' ? (
          <SkriveKlageBrevMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            aktivtSteg={flyt.data.aktivtSteg}
          />
        ) : (
          <SkriveBrevMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            behandlingstype={typeBehandling}
            aktivtSteg={flyt.data.aktivtSteg}
          />
        )}
      </StegSuspense>
    </GruppeSteg>
  );
};
